import mongoose from "mongoose";

const whatsapp_schema=mongoose.Schema({
    message:String,
    name:String,
    time:String,
    received:Boolean
})

const dbmsg = mongoose.model('whatsappmsgs',whatsapp_schema)
export default dbmsg