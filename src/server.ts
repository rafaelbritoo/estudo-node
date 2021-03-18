import 'reflect-metadata';
import express, {request, response} from 'express';
import './database';

const app = express ();

app.get("/", (request, response) => {
    return response.json({message: "Hello world"});
});

app.post("/", (request,response) =>{
   return response.json({message: "Os dados foram gravados com sucesso."})
});

app.listen(3333, () => console.log("Server is running!"));