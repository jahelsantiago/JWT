const JWT = require("jsonwebtoken")

const checkAuthMiddleware = (req, res, next) => {
    const token = req.header("x-auth-token") //obtenemos el token del header

    if(!token){ //si no hay token responder con error
        return res.status(400).json({            
            "errors": [
              {                
                "msg": "no token found",                                
              }
            ]                
        })
    }

    try{
        const user = JWT.verify(token, "123secrete123") //desencriptamos el token
        req.user = user.email //sacamos el email del token y se pasa a la req
        next() //se llama next para seguir con el siguiente middle ware
    }catch(e){
        return res.status(400).json({            
            "errors": [
              {                
                "msg": "invalid token",                                
              }
            ]                
        })
    }
}

module.exports = checkAuthMiddleware