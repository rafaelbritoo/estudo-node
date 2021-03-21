import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import {SurveysRepository} from "../repositories/SurveysRepository";
import {SurveysUsersRepository} from "../repositories/SurveysUsersRepository";

class SendMailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlredyExits = await userRepository.findOne({email});
        if (!userAlredyExits) {
            return response.status(400).json({
                error: "User does not exists!"
            });
        }

        const surveysAlreadyExists = await surveysRepository.findOne({id: survey_id});
        if (!surveysAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exists!"
            });
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlredyExits.id,
            survey_id
        });
        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export {SendMailController}