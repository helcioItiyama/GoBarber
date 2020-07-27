import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name:'Helcio', 
    email:'helcio.itiyama@gmail.com', 
    password:'123456',
    techs: [
      'Nodejs', 
      'ReactJs', 
      'React Native',
      {title: 'Javascript', experience: 100}
    ]
  });
  
  return response.json({message: "Hello World"});

}