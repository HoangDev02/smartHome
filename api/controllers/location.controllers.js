const locationSchema = require('../models/location.model')
const locationController = {
    getLocations: async (req,res) => {
        try {
            const location = await locationSchema.find()
            res.status(200).json(location)
        }
        catch(err) {
            res.status(500).json({message: err.message})
        }
    },
    createLocation : async (req, res) => {
        try{ 
            const location = new locationSchema(req.body)
            const saveLocation = await location.save()
            res.status(200).json(saveLocation)
        }
        catch(err ) {
            res.status(500).json({message: err.message})
        }
    },
    deleteLocation : async (req, res) => {
        try{ 
            const location = locationSchema.find()
            const removeLocation = await location.remove()
            res.status(200).json(removeLocation)
        }
        catch(err ) {
            res.status(500).json({message: err.message})
        }
    }
}
module.exports =locationController