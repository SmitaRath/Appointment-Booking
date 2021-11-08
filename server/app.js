const express = require('express');
const app=express();
const configRoutes = require('./routes');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
configRoutes(app);
app.listen(4000,()=>{
    console.log("We've got a server now");
    console.log("Your routes will be running on http://localhost:4000");
});