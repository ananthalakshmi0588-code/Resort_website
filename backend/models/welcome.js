const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema(
    {
        backgroundImage: {type : String},
        title : {type: String},
        subtitle : {type: String},
    
        
    }
);

module.exports = mongoose.model('welcome', welcomeSchema);