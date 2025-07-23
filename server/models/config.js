const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/adminDB");

connect.then(()=>{
   console.log("Database created successfully");
}).catch(()=>
{
    console.log("Database cannot be connected");
});

const adminSchema = new mongoose.Schema({
  adminid: { type: String, required: true, unique: true },
  adminname: { type: String, required: true },
  apassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model('Admindash', adminSchema);
module.exports=Admin;