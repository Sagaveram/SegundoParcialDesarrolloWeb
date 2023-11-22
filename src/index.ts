import express, { Application, NextFunction,Request,Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import routerUsuario from "./routes/loginRoutes";
import jwt from "jsonwebtoken";
import fs from "fs";
import jugadorRouter from "./routes/jugadorRoutes";

const port: number=3000;
const app: Application = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/login",routerUsuario)


    app.use((req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
    
      // Verificar si el encabezado de autorización está presente
      if (!authHeader) {
        return res.status(400).json({ message: "No tiene authorization para realizar esta acción" });
      }
    
      const token = authHeader.split(" ")[1];
    
      // Leer la clave privada desde el archivo
      const RSA_PRIVATE_KEY = fs.readFileSync('private.key');
    
      try {
        // Verificar y decodificar el token
        let comprobante = jwt.verify(token, RSA_PRIVATE_KEY);
        console.log(comprobante);
    
        // El token es válido, llamar a la siguiente función en la cadena de middleware
        next();
      } catch (error) {
        // Si hay un error en la verificación del token, responder con un código de estado 403
        res.status(403).json({ message: "No se pudo verificar" });
      }
    });

app.use("/api/jugador",jugadorRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
