const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema( 
    {
        lat: {
            type: String,
        },
        long: {
            type: String,
        }
    },
    {timestamps: true}
)
module.exports = mongoose.model('location', locationSchema)
