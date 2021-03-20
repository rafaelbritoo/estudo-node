import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {SurveysRepository} from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const {title, description} = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);
        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveyRepository = getCustomRepository(SurveysRepository);
        const all = await surveyRepository.find();

        return response.json(all);
    }
}

export { SurveysController };