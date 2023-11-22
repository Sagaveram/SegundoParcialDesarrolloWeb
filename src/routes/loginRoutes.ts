import express from 'express';
import fs from "fs";
import { Request, Response} from 'express';
import { IUsuario } from '../models/usuario';
import jwt from 'jsonwebtoken';

let listaUsuarios:IUsuario[]=[];


const RSA_PRIVATE_KEY = fs.readFileSync('private.key');
const routerUsuario = express.Router();

routerUsuario.post('/registroUsuario', async (req: Request, res: Response) => {
    try {
      const data: IUsuario=({
        username: req.body.username,
	    password: req.body.password,
      });
      listaUsuarios.push(data);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  });

  routerUsuario.post('/loginUsuario',async (req: Request, res:Response)=>{
    const username = req.body.username;
	const password = req.body.password;

	const user: IUsuario = {
		username,
		password
	}


	if (username && password) {
		try {
      let usuario = listaUsuarios.find(elem => elem.username === user.username);
			if(password===usuario?.password){
        //const idUser: string = result.userId.toString();
				const token = generateJWT(username);
        res.cookie("SESSIONID", jwt, { httpOnly: true, secure: true });
				res.status(200).json({message:token});
        
      }	
			}catch (err) {
        res.status(500).json({ message: "No tiene permisos para realizar esta acción" });
      }

		} else {
		
		res.status(404).json({message:"Usuario no encontrado"});
	}

  });

  const generateJWT = (username: string) => {
    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: 2000,
      subject: username
    })
    return jwtBearerToken;
  }



export default routerUsuario;