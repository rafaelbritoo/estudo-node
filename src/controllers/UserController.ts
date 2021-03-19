import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";

class UserController {
 async create(request: Request, response: Response) {
    const {name, email} = request.body;
    const userRepository = getCustomRepository(UserRepository);
    const userAlreadExists = await userRepository.findOne({
        email
    });
    if (userAlreadExists) {
        return response.status(400).json({
           error: "Usuario já cadastrado na base de dados!"
        });
    }

    const user = userRepository.create({
        name, email
    });

    await userRepository.save(user);

    return response.json(user);
 }
}

export {UserController};