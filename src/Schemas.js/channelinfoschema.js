const { model, Schema } = require('mongoose')
 
let channelinfoschema = new Schema({
    Guild: String,
    Channel: String
})
 
module.exports = model('channelinfoschema', channelinfoschema);