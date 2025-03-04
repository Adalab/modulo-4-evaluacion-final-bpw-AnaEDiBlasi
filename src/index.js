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
// server.set('view engine', 'ejs');
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
//connectDB()//

const PORT = 5005;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});


//////////////////////////////////////////EVENTOS///////////////////////////////////////////

//endpoint obtener todos los eventos GET
//DATE_FORMAT(fecha, "%Y-%m-%d") elimina la hora y solo deja año, mes y dia
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
    
    res.status(200).json({
      success: true,
      message: 'participante inscrito al evento'})

    // connection.end()
    // if(result){
    //   res.status(201).json({
    //     success:true,
    //     id: result.insertId//id que genera mysql para la nueva fila
    //   })
    // }else{
    //   res.status(400).json({
    //     success: false,
    //     message: 'no se inserto'
    //   })
    // } 

  }catch(error){
    res.status(500).json(error)

  }
})

//OBTENER EVENTOS DE UN PARTICIPANTES GET
server.get('/participantes/:id/eventos', async (req,res)=>{
  try{
    const connection = await connectDB()

    const {id} = req.params
    const sql = 'SELECT eventos.* FROM eventos JOIN eventos_participantes ON eventos.id = eventos_participantes.evento_id WHERE eventos_participantes.participante_id = ?'
    const [result] = await connection.query(sql, [id])
    connection.end()
    res.status(200).json(result)


  }catch(error){
    res.status(500).json(error)
  }
})

//OBTENER PARTICIPANTES DE UN EVENTO GET
server.get('/eventos/:id/participantes', async(req,res)=>{
  try{
    const connection = await connectDB()
    const {id} = req.params
    const sql = 'SELECT participantes.* From participantes JOIN eventos_participantes ON participantes.id = eventos_participantes.participante_id WHERE eventos_participantes.evento_id = ?'
    const[result] = await connection.query(sql, [id])
    connection.end()
    res.status(200).json(result)

  }catch(error){
    res.status(500).json(error)
  }
})

//OBTENER LA LISTA DE PARTICIPANTES Y LOS EENTOS A LOS QUE ESTAN INSCRITOS
server.get('/inscripciones/finales', async(req,res)=>{
  try{
    const connection = await connectDB()
    const sql = `SELECT participantes.id AS participante_id,
     participantes.nombre AS participante_nombre, 
     participantes.email, 
     eventos.id AS evento_id,
     eventos.nombre AS evento_nombre, 
     DATE_FORMAT(eventos.fecha, "%Y-%m-%d") AS fecha,
     eventos.lugar 
     FROM eventos_participantes JOIN participantes ON eventos_participantes.participante_id = participantes.id JOIN eventos ON eventos_participantes.evento_id = eventos.id`
    const[result]= await connection.query(sql)
    connection.end()
    res.status(200).json(result)

  }catch(error){
    res.status(500).json(error)
  }
})

/////////////BONUS///////////////
//REGISTRAR USUARIO (POST)
server.post('/registro', async(req, res) =>{
  const connection = await connectDB()
  //recibir los datos del usuarior a registrar
  const {email, password} = req.body

  //comprobar si el email existe
  const selectEmail = 'SELECT email FROM usuarios_db WHERE email = ?'
  const [emailResult] = await connection.query(selectEmail, [email])

  //si el usuario no existe, se añade, verifico la longitud del array
  if(emailResult.length === 0){
    //antes de hacer insert encriptar contraseña
    const passwordHashed = await bcrypt.hash(password,10)
    //hacemos el insert
    const insertUser = 'INSERT INTO usuarios_db (email, password) VALUES (?,?)'
    const [result] = await connection.query(insertUser, [email, passwordHashed])
    connection.end()
    res.status(201).json({success:true, id: result.insertId})
  }else{
    //el usuario ya existe resp= error
    res.status(200).json({success:false, message: 'El usuario ya existe'})
  }

})

//LOG IN

 server.post('/login', async(req,res)=>{
  const connection = await connectDB()
  const {email, password} = req.body

  const selectEmail = 'SELECT * FROM usuarios_db WHERE email = ?'
  const [emailResult] = await connection.query(selectEmail, [email])

  //si el email existe --> comprobar si coincide contraseña
  if(emailResult.lenght !==0){
    const passwordDB = emailResult[0].password
    const isSamePassword = await bcrypt.compare(password, passwordDB)

    if(isSamePassword){
      //las contraseñas iguales crea token
      const infoToken = {email: emailResult[0].email, id: emailResult[0].id}
      const token = jwt.sign(infoToken, "armario", {expiresIn: '1h'} )
      res.status(200).json({success:true, token: token})
        } else{
          res.status(200).json({success:false, message: 'contraseña incorrecta'})
        }
  }else{
    res.status(200).json({success:false, message: 'email incorrecto'})
  }
 })


 //// middleware de autenticacion jwt

 function auth(req,res,next){

  const tokenString = req.headers['authorization']
  console.log(tokenString)

  if(!tokenString) {
    res.status(400).json({success:false, message: 'No tiene autorización'})
  }else{
    try{
      const token = tokenString.split(' ')[1]
      const verifyToken = jwt.verify(token, 'armario')
      req.data = verifyToken
    
    }catch(error){
      res.status(400).json({success:false, message: error})
    }
    //acceso a la ruta privada
    next();
  }

 }

 server.get('/listaparticipantes', auth,async(req,res) =>{
  const connection = await connectDB()
  try {
    const sqlParticipante = 'SELECT * FROM participantes';
    const [results] = await connection.query(sqlParticipante);

    connection.end(); 
    return res.status(200).json({ success: true, data: results }); 
  } catch (error) {
    connection.end();
    return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message }); 
  }
 })