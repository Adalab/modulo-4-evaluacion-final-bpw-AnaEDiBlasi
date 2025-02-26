//imports
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

//crear el servidor
const server = express();

// configurar el servidor
server.use(cors());
server.use(express.json());
//plantillas ejs
server.set('view engine', 'ejs');
require('dotenv').config();

// Conectar a la base de datos
async function connectDB(){
  const conex = await mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSDB,
    database: process.env.DATADB,
  });
  console.log('Conectado a la base de datos');
  // conex.connect();
  return conex;
}
//connectDB()//quitar

const PORT = 5005;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});


//////////////////////////////////////////EVENTOS///////////////////////////////////////////

//endpoint obtener todos los eventos GET
server.get('/eventos', async(req,res)=>{
  try{
    const connection = await connectDB()
    //crear el sql
    const select = 'SELECT id, nombre, DATE_FORMAT(fecha, "%Y-%m-%d") as fecha, lugar FROM eventos'
    const [results] = await connection.query(select)
    //cerrar conexion
    connection.end()
    res.status(200).json({
      info:{count:results.length},//numero de elementos
      results: results//listado
    })

  }catch(error){
    res.status(500).json(error)

  }
})

//CRUD para eventos 
//agregar un nuevo evento POST
server.post('/eventos', async(req,res)=>{
  console.log(req.body)
  try{
    const connection = await connectDB()
    //destructuring
    const {nombre, fecha, lugar} = req.body

    if(!nombre || !fecha || !lugar){
      return res.status(400).json({
        success: false,
        message: 'no se inserto'
      })

    }
    
    const sqlInsert = 'INSERT INTO eventos (nombre,fecha, lugar)VALUES (?,?,?)'
    const [result]= await connection.query(sqlInsert, [
      nombre,
      fecha,
      lugar
    ])

 

    if(result){
      res.status(201).json({
        success:true,
        id: result.insertId//id que genera mysql para la nueva fila
      })
    }else{
      res.status(400).json({
        success: false,
        message: 'no se inserto'
      })
    }

  }catch(error){
   res.status(500).json(error)
  }
})


//actualizar evento existente PUT

server.put('/eventos/:id', async(req,res)=>{
  const connection = await connectDB()
  const {id} = req.params
  const {nombre,fecha, lugar}= req.body
  
  const updateEvento = 'UPDATE eventos SET nombre=?, fecha=?, lugar=? WHERE id=?'

  const [result] = await connection.query(updateEvento, [nombre,fecha,lugar,id])

  //affecteRows --> es una propiedad de result, indica las filas que se han modificado
  if(result.affectedRows >0){
    res.status(200).json({success:true})
  }else{
    res.status(400).json({success:false, message: 'ha ocurrido un error'})
  }

})


//Eliminar evento DELETE

server.delete('/eventos/:id', async (req,res)=>{
  const connection = await connectDB()
  const {id} = req.params
  const sqlDelete = 'DELETE FROM eventos WHERE id=?'
  const [result] = await connection.query(sqlDelete, [id])

  if(result.affectedRows > 0){
    res.status(200).json({success:true})
  }else{
    res.status(400).json({success:false, message: 'ha ocurrido un error al eliminar'})
  }
})



//////////////////////////////////////////////PARTICIPANTES///////////////////////////////////////

//OBTENER TODOS LOS PARTICIPANTES GET
server.get('/participantes', async (req,res)=>{
  try{
    const connection = await connectDB()
    //crear el sql
    const select = 'SELECT * FROM participantes'
    const [results] = await connection.query(select)
      //cerrar conexion
    connection.end()
    res.status(200).json({
        info:{count:results.length},//numero de elementos
        results: results//listado
    })
  
    }catch(error){
      res.status(500).json(error)
  
    }
  })


//AGREGAR UN NUEVO PARTICIPANTE POST
server.post('/participantes', async(req, res)=>{
  try{
    const connection = await connectDB()
    const {nombre, email} = req.body

    if(!nombre || !email){
      return res.status(400).json({
        success: false,
        message: 'no se inserto'
      })

    }
    
    const sqlInsert = 'INSERT INTO participantes (nombre,email)VALUES (?,?)'
    const [result]= await connection.query(sqlInsert, [
      nombre,
      email
    ])

 
    connection.end()
    if(result){
      res.status(201).json({
        success:true,
        id: result.insertId//id que genera mysql para la nueva fila
      })
    }else{
      res.status(400).json({
        success: false,
        message: 'no se inserto'
      })
    } 

  }catch(error){
    res.status(500).json(error)
  }
})

//ACTUALIZAR DATOS DEL PARTICIPANTE EXISTENTE PUT
server.put('/participantes/:id', async(req,res)=>{
  const connection = await connectDB()
  const {id} = req.params
  const {nombre,email}= req.body

   const updateParticipante = 'UPDATE participantes SET nombre=?, email=? WHERE id=?'
   const [result] = await connection.query(updateParticipante, [nombre, email, id])

   if(result.affectedRows > 0){
    res.status(200).json({success:true})
   }else{
    res.status(400).json({success:false, message:'ha ocurrido un error'})
   }

})

//ELIMINAR UN PARTICIPANTE DELETE
server.delete('/participantes/:id', async(req,res)=>{
  const connection = await connectDB()
  const {id} = req.params
  const sqlDelete = 'DELETE FROM participantes WHERE id=?'
  const [result] = await connection.query(sqlDelete, [id])

  if(result.affectedRows > 0){
    res.status(200).json({success:true})
  }else{
    res.status(400).json({success:false, message: 'ha ocurrido un error al eliminar'})
  }

})


///////////////////////// TABLA DE RELACION (EVENTOS--PARTICIPANTES)/////////////////////////////

//INSCRIBIR UN PARTICIPANTE EN UN EVENTO POST
server.post('/inscripciones', async(req,res)=>{
  try{
    const connection = await connectDB()
    const{evento_id, participante_id}= req.body
    const sqlPartToEvent= 'INSERT INTO eventos_participantes (evento_id, participante_id) VALUES (?,?)' 
    const [result] = await connection.query(sqlPartToEvent, [evento_id, participante_id])

    connection.end()
    if(result){
      res.status(201).json({
        success:true,
        id: result.insertId//id que genera mysql para la nueva fila
      })
    }else{
      res.status(400).json({
        success: false,
        message: 'no se inserto'
      })
    } 

  }catch(error){
    res.status(500).json(error)

  }
})

//OBTENER EVENTOS DE PARTICIPANTES GET
server.get('/participantes/:id/eventos', async (req,res)=>{
  try{
    const connection = await connectDB()

  }catch(error){
    res.status(500).json(error)
  }
})

//OBTENER PARTICIPANTES DE UN EVENTO GET
server.get('/eventos/:id/participantes', async(req,res)=>{
  try{
    const connection = await connectDB()

  }catch(error){
    res.status(500).json(error)
  }
})
