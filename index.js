const express = require("express")
const auth = require("./routes/auth")
const post = require("./routes/posts")

const app = express()

app.use(express.json()) // to accept json

app.use("/auth",auth)
app.use("/post", post)

app.get("/", (req, res) => {
    res.send("i am working ")
})

app.listen(5000, ()=>{
    console.log("running at port 5000")
})
