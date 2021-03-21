import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import {SurveysRepository} from "../repositories/SurveysRepository";
import {SurveysUsersRepository} from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from "path";
import {AppError} from "../errors/AppError";

class SendMailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await userRepository.findOne({email});
        if (!user) {
            throw new AppError("Usuario já cadastrado na base de dados!");
        }

        const surveys = await surveysRepository.findOne({id: survey_id});
        const testePath = resolve(__dirname,'..', 'views', 'emails', 'testeMail.hbs');

        const surveyUserAlreadExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, valor: null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: surveys.title,
            description: surveys.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadExists) {
            variables.id = surveyUserAlreadExists.id;
            await SendMailService.execute(email, surveys.title, variables, testePath);
            return response.json(surveyUserAlreadExists);
        }

        if (!surveys) {
            throw new AppError("Survey does not exists!");
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);
        variables.id = surveyUser.id;
        await SendMailService.execute(email, surveys.title, variables, testePath);
        return response.json(surveyUser);
    }
}

export {SendMailController}