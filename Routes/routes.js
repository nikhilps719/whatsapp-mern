import express,{Router} from "express"
import dbobj from "../dbmsgs.js"
const route=express.Router()

route.post("/new",async (req,res)=>{
       const dbmsg=req.body
       const msg=new dbobj(dbmsg)
       try{
         await msg.save();
         res.json(msg)
       }catch(err){
           res.json({message:err.message})
       }
})
route.get("/sync",async (req,res) => {
     try{
         const user = await dbobj.find()
         res.json(user)
     }catch(err){
         res.json({message:err.message})
     }
})




export default route