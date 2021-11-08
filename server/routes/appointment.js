const express= require('express');
const router = express.Router();
const redis= require("redis");
const client = redis.createClient();
const moment = require('moment');

//method to validate the id format
function validateEmailId(argument){
     if(!(argument.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)))
     throw `Id should be in the format xyz@abc.xyz`;
 }


// post end point to post an appointment
router.post("/", async(req,res)=>{
    let data=req.body;

    // if one of the parameter is missing, throwing error to the user
    if(!(data.id) || !(data.date) || !(data.time)){
        res.status(400).json({Error:"Please provide id, date and time to book an appointment"})
        return;
    }

    const id = data.id;

   //validating id
    try{
        validateEmailId(id);
    }
    catch(e)
    {
        res.status(400).json({Error:e})
        return;
    }

    const date = data.date.split(":");
    const time=data.time.split(":");

    // generating date using moment from the passed date and time
    const appointDate = moment([date[0],date[1]-1,date[2],time[0],time[1]])

    // if date is not valid sending error to customer
    try
    {
        if(!(appointDate._isValid)){
            res.status(400).json({error:"Please provide date in YYYY:MM:DD and time in hh:mm format"});
            return;
        }
    }
    catch(e){
        res.json({error:"Invalid"});
        return;
    }
    
    // if date is not starting at hour or half hour sending error to user
    try{
        if(parseInt(time[1],10)%10!=0 || parseInt(time[1],10)%30!=0){
            res.status(400).json({Error: "All appointments must start and end on the hour or half hour"});
            return;
        }
    }
    catch(e){
        res.status(400).json({Error:"All appointments must start and end on the hour or half hour"});
        return;
    }

    const now = moment();

    // if date is past date sending error to user
    if(appointDate.isBefore(now))
    {
        res.status(400).json({error:"Appointment cannot be booked for past date"});
        return;
    }
       

// checking for id already present in the cache if present then checking for same day appointment
  try
    {
    client.lrange(id,0,-1, function(err, result){
    if(result!=null){
        let existingAppointments=result;
        for(let appointment of result){

            if(moment(appointment).date()==parseInt(date[2],10))
            {
                res.status(400).json({error:"You already have an appointment on " + appointDate.format("MMMM DD YYYY") + 
                " at " + moment(appointment).format("hh:mm A")})
                return;
            }
        }
    }
            
        client.lpush(id,appointDate.format())
        res.json({Message:"Congratulations, your appointment is booked for "+ 
        appointDate.format("MMMM DD YYYY hh:mm A")+ " to " 
        + appointDate.add(30,'m').format("hh:mm A")});


    });   
}
catch(e){
    res.status(500).send();
}

})

// method to get all the appoinntments for the user
router.get("/:id", async(req,res)=>{
    let id = req.params.id;
    // if id is not in valid format sending error to user
    try{
        validateEmailId(id);
    }
    catch(e)
    {
        res.status(400).json({Error:e})
        return;
    }

    // getting all the appointments of the user
    try
    {
        client.lrange(id,0,-1, function(err, result){
        if(result!=null){
            let existingAppointments=[]
            for(let appointment of result){
                existingAppointments.push(moment(appointment).format("MMMM DD YYYY hh:mm A")
                + " to " 
                + moment(appointment).add(30,'m').format("hh:mm A"))
            }
                
            if(existingAppointments.length!=0)
                res.json({Appointments:existingAppointments});
            else
                res.status(404).json({Message:"You do not have any booked appointments"});
    
            }
        });
        
    }
    catch(e){
        res.status(500).send();
    }
   
})

module.exports=router;

