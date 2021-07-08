//imports
import express from "express"
import mongoose from "mongoose"
import messages from "./dbmsgs.js"
import cors from "cors"
import bodyParser from "body-parser"
import route from "./Routes/routes.js"
import Pusher from "pusher"


//app config
const app=express();
const port=process.env.PORT || "8000";
const db_url="mongodb+srv://user:nickcrud@cluster0.h0nyt.mongodb.net/WHATSAPP-DB?retryWrites=true&w=majority"
//nickcrud (password of db)
const pusher = new Pusher({
    appId: "1226929",
    key: "e779659a226a72598fc3",
    secret: "7d158904fb5cc60d27ee",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json())
app.use(cors())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
//Db config
mongoose.connect(db_url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true}).then(()=>{
    app.listen(port,()=>{
        console.log("listening")
    })
}).catch((err)=>{
    console.log(err)
})


//api routes
const db=mongoose.connection                    //establishing connection
db.once("open",()=>{                              //once connection is opened callback is called
    console.log("connected")                             
    const msgCollection = db.collection("whatsappmsgs")        //making collection obj tht is db.collection_name
    const changeStream = msgCollection.watch()                 

    changeStream.on("change",(change)=>{                //onChange
        console.log(change)
        if(change.operationType==="insert")            //if change event type is insert then it runs
        {
           const msgDetails = change.fullDocument       //converting whole change into a document
           pusher.trigger("messages","inserted",{       //pushing data to pusher
              message:msgDetails.message,
              name:msgDetails.name,                     //obj.property
              time:msgDetails.time,
              received:msgDetails.received

           })
        }else {
           console.log("err in pushing")
        }
    })
})
 app.get("/",(req,res)=>{
     res.status(200).send("hey nick build projects")
 })
 app.use("/messages",route)
//listen
