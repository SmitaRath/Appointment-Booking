# Appointment-Booking
API to book appointments for the user

This api is built using Node.js, Express and Redis.
It accepts two end points

### Customer can add a new appointment using post request
http://localhost:4000/ 

-->
Request body should be in the below format.
In the postman, under Body tag select raw and JSON format and please remove the comments from the request before running the application

![image](https://user-images.githubusercontent.com/72769273/140690001-61784a9f-8183-4a66-847b-dcfaff1afb55.png)

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

### If postman is not installed, please install it using below link
https://www.postman.com/downloads/

Once redis and Node.js are installed successfully<br/><br/>
### Start redis by performing below steps:<br/>
In a terminal window type in the follwing to get the Redis server running on the default port: brew services start redis <br/>
Test whether the redis server is running by typing in: redis-cli ping and it should return "PONG" </br>
To clear the old redis cache enter redis-cli FLUSHALL (it will clear all the old data from the cache)

### Open terminal in the project folder

cd server <br/>
npm install <br/>
npm start <br/>

### The server will start running at localhost:4000 <br/>
Start booking appointments for the user.

### Once application is done booking for the day, please stop the redis server using command: brew services stop redis


