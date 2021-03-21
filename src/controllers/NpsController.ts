import {Request} from "express";
import {getCustomRepository, Not, IsNull} from "typeorm";
import {SurveysUsersRepository} from "../repositories/SurveysUsersRepository";

class NpsController {

    /**
     *
     * Detratores => 0 - 6
     * Passivo => 7 - 8
     * Promotores => 9 - 10
     * (Número de promotores - Número de detratores)/ (número de respondente) x 100
     */
    async execute(request: Request, response: Response) {
        const {survey_id} = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            valor: Not(IsNull())
        });

        const detractor = surveyUsers.filter(
            (survey) =>  survey.valor >= 0 && survey.valor <= 6
        ).length;

        const promoter = surveyUsers.filter(
            (survey) => survey.valor >= 9 && survey.valor <= 10
        ).length;

        const passive = surveyUsers.filter(
            (survey)  => survey.valor <= 7 && survey.valor >=8
        ).length;

        const totalAnsewrs = surveyUsers.length;

        const calculate = (((promoter - detractor) / totalAnsewrs) * 100).toFixed(2);

        // @ts-ignore
        return response.json({
            detractor,
            promoter,
            passive,
            totalAnsewrs,
            nps: calculate
        });
    }
}
export {NpsController};