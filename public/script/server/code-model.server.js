const mongoose = require('mongoose');

var codeSchema = mongoose.Schema({
    code : Number,
    hashedCode: String,
    organizations: mongoose.Schema.Types.ObjectId,
    status: String,
    fullUserData: {
        name: String,
        campaing: String
    }
}); 


module.exports = mongoose.model("Code", codeSchema);