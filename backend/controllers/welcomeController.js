const welcome = require('../models/welcome');

const createWelcome = async (req,res) =>{
    try { 
        const{backgroundImage , title, subtitle} = req.body;

        const welcomeData = await welcome.create({
            backgroundImage,
            title,
            subtitle
        });

        res.status(201).json({
            success : true,
            message:'welcome data created successfully',
            data: welcomeData
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get welcome data

const getWelcome = async (req , res) =>{
    try {
        const welcomeData = await welcome.findOne();

        if(!welcomeData){
            return res.status(404).json({
                success : false,
                message : 'No welcome data found'
            });
        }

        res.status(200).json({
            success : true,
            data: welcomeData
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
};

// Update welcome data

const updateWelcome = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedData = await welcome.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if(!updatedData){
            return res.status(404).json({
                success : false,
                message : 'Welcome data not found'
            });
        }

        res.status(200).json({
            success:true,
            message:'Welcome data updated successfully',
            data: updatedData
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        });
    }
};

// Delete welcome data

const deleteWelcome = async (req, res) => {
    try{
    const {id} = req.params;
    const deletedData = await welcome.findByIdAndDelete(id);

    if(!deletedData) {
        return res.status(404).json({
            success: false,
            message:'welcome data not found'
        });
    }

    res.status(200).json({
        success: true,
        message:'welcome data deleted successfuly'
    });

    } catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createWelcome, getWelcome, updateWelcome,deleteWelcome};