const router = require("express").Router()

const checkAuth = require("../midlewares/checkAuth")

//info privada
const publicPosts = [
    "hola", "como" , "estas"
]

//check auth es e middleware
router.get("/private", checkAuth, (req, res) => {
    res.json({
        publicPosts
    })
})

router.get("/public", (req, res) => {
    res.json({
        publicPosts
    })
})


module.exports = router

