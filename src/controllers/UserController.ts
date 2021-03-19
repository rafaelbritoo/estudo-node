import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../models/User";

class UserController {
 async create(request: Request, response: Response) {
    const {name, email} = request.body;
    const userRepository = getRepository(User);
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