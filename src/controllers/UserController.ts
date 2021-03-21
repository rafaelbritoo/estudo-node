import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import * as yup from 'yup';
import {AppError} from "../errors/AppError";

class UserController {
 async create(request: Request, response: Response) {
    const {name, email} = request.body;
    const schema = yup.object().shape({
        name: yup.string().required("Nome é obrigatorio!"),
        email: yup.string().email().required("Email é obrigatório!")
    });

     try {
         await schema.validate(request.body, {abortEarly: false});
     } catch (err) {
         response.status(400).json({
                     error: err
                 });
     }

    const userRepository = getCustomRepository(UserRepository);
    const userAlreadExists = await userRepository.findOne({
        email
    });
    if (userAlreadExists) {
        throw new AppError("Usuario já cadastrado na base de dados!");
    }

    const user = userRepository.create({
        name, email
    });

    await userRepository.save(user);

    return response.status(201).json(user);
 }
}

export {UserController};