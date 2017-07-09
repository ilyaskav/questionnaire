const mongoose = require('mongoose');

var organizationSchema = mongoose.Schema({
    name : String
}); 


module.exports = mongoose.model("Organization", organizationSchema);