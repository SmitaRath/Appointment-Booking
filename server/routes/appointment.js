const express= require('express');
const router = express.Router();
const redis= require("redis");
const client = redis.createClient();
const moment = require('moment');

function validateEmailId(argument){
     if(!(argument.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)))
     throw `Id should be in the format xyz@abc.xyz`;
 }


router.post("/", async(req,res)=>{
    let data=req.body;

    if(!(data.id) || !(data.date) || !(data.time)){
        res.status(400).json({Error:"Please provide id, date and time to book an appointment"})
        return;
    }

    const id = data.id;

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

    const appointDate = moment([date[0],date[1]-1,date[2],time[0],time[1]])

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
    if(appointDate.isBefore(now))
    {
        res.status(400).json({error:"Appointment cannot be booked for past date"});
        return;
    }
       

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

router.get("/:id", async(req,res)=>{
    let id = req.params.id;
    try{
        validateEmailId(id);
    }
    catch(e)
    {
        res.status(400).json({Error:e})
        return;
    }

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

