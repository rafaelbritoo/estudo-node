import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import {SurveysRepository} from "../repositories/SurveysRepository";
import {SurveysUsersRepository} from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from "path";

class SendMailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await userRepository.findOne({email});
        if (!user) {
            return response.status(400).json({
                error: "User does not exists!"
            });
        }

        const surveys = await surveysRepository.findOne({id: survey_id});
        const testePath = resolve(__dirname,'..', 'views', 'emails', 'testeMail.hbs');

        const variables = {
            name: user.name,
            title: surveys.title,
            description: surveys.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserAlreadExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {valor: null}],
            relations: ["user", "survey"]
        });

        if (surveyUserAlreadExists) {
            await SendMailService.execute(email, surveys.title, variables, testePath);
            return response.json(surveyUserAlreadExists);
        }

        if (!surveys) {
            return response.status(400).json({
                error: "Survey does not exists!"
            });
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });



        await surveysUsersRepository.save(surveyUser);
        await SendMailService.execute(email, surveys.title, variables, testePath);
        return response.json(surveyUser);
    }
}

export {SendMailController}