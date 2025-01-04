const express=require("express");
const app= express();
const path=require("path");
let mongoose= require("mongoose");
const fs= require('fs');
const ejsMate= require("ejs-mate");
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine('ejs',ejsMate);



app.listen(8080,()=>{
    console.log("server is listening");
});



const Schema= mongoose.Schema;
const listingSchema= new Schema({
   
       
         eventName:{
           type: String,
         } ,
     date: {
       type: String,
     },
     time:{
       type: String,
     },
     location: {
       
     
       building:{
           type: String,
         },
       room: {
           type: String,
         },
       address: {
         street: {
           type: String,
         },
         city: {
           type: String,
         },
         zip: {
           type: String,
         }
       }
   },
   
     organizer: {
     name: {
       type: String,
     },
     email: {
       type: String,
     },
     phone: {
       type: String,
     },
   }
       
     
});
const Listing=mongoose.model("Listing",listingSchema);



main().then(()=>{
    console.log("connection successful");
    insertd().then(()=>{
        console.log("data inserted");
     })
     .catch(err=>{
        console.log(err);
     });
})
.catch(err=>{
    console.log(err);
});
 async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/events');
 };

let jsonpath = './t.json';
 async function insertd(){
    try{
            const data= JSON.parse(fs.readFileSync(jsonpath,'utf-8'));
            console.log(data.events);
            await Listing.deleteMany({});
            const result=await Listing.insertMany(data.events);
    }catch(err){
        console.log(err);
    }
 }

 //show Route
 app.get("/events",async (req,res)=>{
    let listings= await Listing.find();
    
    res.render("events.ejs",{listings});

});

//Edit Route
app.get("/events/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    console.log(listing);
    res.render("edit.ejs",{listing});

   });

   app.post("/events/update/:id",async(req,res)=>{
    let{id}= req.params;
    
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/events");
   });


   //delete Route
   app.get("/delete/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/events");
   });

   app.get("/add", async(req,res)=>{
    res.render("new.ejs");
   });
   app.post("/add",async(req,res)=>{
    // console.log(req.body.listing);
    newlisting=new Listing(req.body.listing);
    await newlisting.save();

    res.redirect("/events");


});

