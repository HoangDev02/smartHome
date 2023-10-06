const mongooes = require('mongoose')

const UserModel = new mongooes.Schema({
    username: {
        type: String,
        require: true,
        unique:true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type:String,
        require:true,
        default: "abc.12345"
    },
    isAdmin: {
        type:Boolean,
    }
})
module.exports = mongooes.model("user", UserModel)