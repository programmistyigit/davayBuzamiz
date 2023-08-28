const {Schema , model} = require("mongoose")
const schema = new Schema({
    localStorage:{type : Object , required: true},
    name :{ type : String , default :"no name"}
})

module.exports = model("data" , schema)