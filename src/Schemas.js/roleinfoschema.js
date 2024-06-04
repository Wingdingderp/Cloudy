const { model, Schema } = require('mongoose')
 
let roleinfoschema = new Schema({
    Guild: String,
    Channel: String
})
 
module.exports = model('roleinfoschema', roleinfoschema);