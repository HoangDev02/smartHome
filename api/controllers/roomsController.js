
const roomsModels = require('../models/roomsModel')

    exports.createRoom = async (req,res,next) => {
        const newRoom = new roomsModels(req.body)
        try {
            await newRoom.save()
            res.status(200).json('create room success')
        } catch (error) {
            next(error)
        }
},
    exports.updateRoom= async (req,res,next) => {
        const updateRoom = await roomsModels.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true })
        try {
            if(!updateRoom) {
                res.status(404).json("room not found")
            }
            res.status(200).json(updateRoom)
        }catch(err) {
            next(err)
        }
    },
    exports.deleteRoom= async (req,res,next) => {
        try {
            await roomsModels.findByIdAndDelete(req.params.id);
            res.status(200).json("Room has been delete")
        }catch(err) {
            next(err)
        }
    },
    exports.getRoom= async (req,res,next) => {
        try {
            const room = await roomsModels.findById(req.params.id);
            res.status(200).json(room)
        }catch(err) {
            next(err)
        }
    },
    exports.getAllRooms=async () => {
        try {
            const room = await roomsModels.find();
            res.status(200).json(room)
        }catch(err) {
            next(err)
        }
    }
