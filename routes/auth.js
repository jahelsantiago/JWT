const router = require("express").Router()
const users = require("../db")
const bycrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const { check, validationResult } = require("express-validator")

//middlewares para verificar si el password y email es correcto
const signupMiddleware = [
    check("email", "invalida email").isEmail(),
    check("password", "invalid password").isLength({
        min : 6
    })
]

//recibe usuario y contraseña en el body y lo crea en la db
router.post("/signup",signupMiddleware, async (req, res)=> {
    const {email, password} = req.body
    
    const errors = validationResult(req) //mirara dentro del reuqest para saber si hubo errores con los check

    //verificamos que el arrglo de validate results no este vacio y si tiene algo (errores) retorna un error
    if(!errors.isEmpty()){
        //retorna un error de respuesta
        return res.status(400).json({
            errors : errors.array()
        })
    }

    //verificar si el usuario existe
    const user = users.find((user)=>(user.email === email))

    //si  exite enviar un error
    if(user){        
        return res.status(400).json({
            
                "errors": [
                  {                
                    "msg": "email alredy exist",                                
                  }
                ]                
        })
    }
    
    //hacer un hash con salt para encriptarla 
    const hashedPassword = await bycrypt.hash(password, 5)    
            
    //añadir el usuario nuevo
    users.push({
        email,
        password : hashedPassword
    })

    //enviar el JWT
    const token = JWT.sign({email}, "123secrete123", {expiresIn : "1h"})
    res.json({
        "x-auth-token" : token
    })

    res.send("validation passed")
})


router.get("/login", async (req, res) =>{
    const {email, password} = req.body

    const user = users.find((user)=>user.email == email)

    //verificar que el usuario exista por el email
    if(!user){
        res.status(400).json({
            "errors": [
                {                
                  "msg": "email does not exist",                                
                }
              ] 
        })
    }

    //comparar ambas contraseñas 
    const arePasswordsMathc = bycrypt.compare(user.password, password)

    //si no coincide retornar un error
    if(!arePasswordsMathc){
        return res.status(400).json({
            "errors": [
                {                
                  "msg": "password is incorrect", 
                }
              ] 
        })
    }

    const token = JWT.sign({email}, "123secrete123", {expiresIn : "1h"})
    res.json({
        "x-auth-token" : token
    })


})

//retorna todos los usuarios
router.get("/all", (req, res)=>{
    res.json(users)
})

module.exports = router