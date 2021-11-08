# Appointment-Booking
API to book appointments for the user

This api is built using Node.js, Express and Redis.
It accepts two end points

### Customer can add a new appointment using post request
http://localhost:4000/ 

-->
Should provide the below details
{
"id" : "xyz@abc.xyz", // should be in email format

"date": "2021:11:11", // should be in YYYY:MM:DD format

"time":"1:00" //should be in hh:mm format(24 hr format)
}

This end point accepts numbers in both format 9 and 09 for hours, minutes, day and month

### Customer can check all the appointments using get request
http://localhost:4000/id 
-->
id should be in email format.

### Instructions for running the application

#### If redis is not installed in the system, please install it using the below link
https://phoenixnap.com/kb/install-redis-on-mac

### If Node.js is not installed in the system, please install it using below link
https://nodejs.org/en/download/

Once redis and Node.js are installed successfully
Open terminal in the project folder
• cd server
• npm install
• npm start

The server will start running at localhost:4000
And start booking appointments for the user.




