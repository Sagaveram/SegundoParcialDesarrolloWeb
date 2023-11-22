import express, { Request, Response } from 'express';
import IJugador from '../models/jugador';


const jugadorRouter = express.Router();

let listaJugadores:IJugador[]=[];
let listaJugadoresConvocados:IJugador[]=[];

//Ingresa jugador
jugadorRouter.post('/post', async (req: Request, res: Response) => {
    try {
      const data: IJugador=({
        id:req.body.id,
        nombre:req.body.nombre,
        posicion:req.body.posicion,
        suspendido:req.body.suspendido,
        lesionado:req.body.lesionado  
      });
      if(data.posicion=="GK"||data.posicion=="DF"||data.posicion=="MD"||data.posicion=="FW"){
        listaJugadores.push(data);
        res.status(200).json(data);
      }else{
        res.status(400).json({message: "La posición ingresada no es válida, intente de nuevo"})
      }  
      
    } catch (error) {
      res.status(400).json({ message: error });
    }
  });

  //Lista todos los jugadores
  jugadorRouter.get('/listadoJugadores', async (req: Request, res: Response) => {
    try {
      res.json(listaJugadores);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

  //Eliminar jugadores por ID
  jugadorRouter.delete('/delete/:id',async (req: Request, res:Response)=>{
    try {
        let busquedaID= listaJugadores.findIndex(jugador=>jugador.id==req.params.id);
        if(busquedaID==-1){
            res.status(404).json({message: "El jugador no se ha encontrado"})
        }else{
            listaJugadores.splice(busquedaID,1);
            res.status(200).json({message: "Elemento eliminado correctamente"})
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }

});


//Opcionales

//Obtener jugador por su nombre
jugadorRouter.get('/getPersona/:nombre',async (req:Request,res:Response)=>{

    try{
      let busquedaJugador=listaJugadores.findIndex(persona=>persona.nombre==req.params.nombre);
      if(busquedaJugador==-1){
        res.status(404).json({message: "persona not found"})
      }else{
        res.json(listaJugadores[busquedaJugador]);
      }
    }catch (error) {
      res.status(500).json({ message: error });
    }
  });

//Listado jugadores disponibles (Supongo que un jugador es disponible cuando no esta ni suspendido ni lesionado)
jugadorRouter.get('/listadoJugadoresDisponibles', async (req: Request, res: Response) => {
    let listaJugadoresConvocados:IJugador[]=[];
    try {
      for(let i=0;i<listaJugadores.length;i++){
        if(listaJugadores[i].lesionado!=true &&listaJugadores[i].suspendido!=true){
            listaJugadoresConvocados.push(listaJugadores[i])
        }
      }  
      res.json(listaJugadoresConvocados);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

  //Convocar jugadores por id
  jugadorRouter.post('/convocar/:id',async (req: Request, res:Response)=>{
    try {
        let busquedaID= listaJugadores.findIndex(jugador=>jugador.id==req.params.id);
        if(busquedaID==-1){
            res.status(404).json({message: "El jugador no se ha encontrado"})
        }else{
            listaJugadoresConvocados.push(listaJugadores[busquedaID])
            res.status(200).json({message: "Se ha convocado al jugador"})
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }

});

  

  

export default jugadorRouter;