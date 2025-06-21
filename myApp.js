require('dotenv').config(); // Add this as the FIRST line

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookie = require('cookie-parser');

const workoutUsers = require("./models/createUser");
const workout = require("./models/workOuts");
const cookieParser = require('cookie-parser');
const exerciseModel = require('./models/seedExercises');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("views"));

//home page
app.get("/" , function(req , res){
  res.sendFile(__dirname + "/views/homePage.html");
});

app.route("/api/users").get(function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  res.json({
    "name" : payload.name
  });
});

//signup
app.route("/signup").post(async function(req , res){
  const username = req.body.username;
  let password = req.body.password;
  let hashed = await bcrypt.hash(password , 10);
  const name = req.body.name;
  const created = await workoutUsers.createUser(username , hashed , name);
  res.status(200).json({success : true});
}).get(function(req , res){
  res.sendFile(__dirname + "/views/signup.html");
});

//login
app.route("/login").post(async function(req , res){
  const gotUsername = req.body.username;
  let gotPassword = req.body.password;
  const found = await workoutUsers.findUser(gotUsername);
  if(!found){
    return res.redirect("/auth?error=usernotfound");
  }
  const verify = await bcrypt.compare(gotPassword , found.password);
  if(!verify){
    return res.redirect("/auth?error=wrongpassword");
  }
  const token = jwt.sign({
    "username" : gotUsername,
    "name" : found.name , 
    "id" : found._id
  } , process.env.JWT_KEY , {expiresIn : '24h'});
  const cookie = res.cookie('authToken' , token , {httpOnly : true});
  res.redirect("/auth");
}).get(function(req , res){
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/auth", (req, res) => {
  res.sendFile(__dirname + "/views/authentication.html");
});

app.get("/authentication", async function(req, res) {
  try {
    const token = req.cookies.authToken;
    const { username } = jwt.verify(token, process.env.JWT_KEY);
    
    const found = await workoutUsers.findUser(username);
    if (!found) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.route("/dashboard").get(function(req , res){
  res.sendFile(__dirname + "/views/dashboard.html");
});

app.route("/dashboard/create-workout").post(async function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  const userName = payload.username;
  const found = await workoutUsers.findUser(userName);
  if(!found){
    return res.status(401).json({ success: false, message: "User not found" });
  }
  const userID = found._id;
  const workouts = req.body.workouts;
  const newWorkout = await workout.createWorkOut(userID , workouts);
  if(!newWorkout){
    return res.status(401).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true });
}).get(function(req , res){
  res.sendFile(__dirname + "/views/create-workout.html");
});

app.route("/api/exercises").get(async function(req , res){
  const exercises = await exerciseModel.exercisesList();
  res.json({
    "exercises" : exercises
  });
});

app.route("/dashboard/update-workout").get(
  function(req , res){
    res.sendFile(__dirname + "/views/update-workout.html");
});

app.get("/api/workouts" , async function(req , res){
    const token = req.cookies.authToken;
    const payload = jwt.verify(token , process.env.JWT_KEY);
    const found = await workout.getWorkouts(payload.id);
    let allWorkouts = {};
    let workoutIDs = {};
    let names = {};
    for(let i = 0 ; i < found.length ; i++){ 
      allWorkouts[i] = found[i].workouts;
      workoutIDs[i] = found[i]._id;
      names[i] = found[i].name;
    }
    res.json({ workouts: allWorkouts , workoutID : workoutIDs , name : names});
});

app.route("/dashboard/update-workouts/:id").get(function(req , res){
  res.sendFile(__dirname + "/views/yourWorkout.html");
}).post(async function(req , res){
  if(req.body.delete){
    const deleted = await workout.deleteWorkout(req.body.id);
    if(!deleted){
      return res.status(401).json({ success: false, message: "Incorrect Workout ID" });
    }
    return res.status(200).json({ success: true });
  }
  const updatedWorkout = req.body.exercises;
  const body = req.body;
  const id = req.body.id;
  const updated = await workout.updateWorkouts(id , body.exercises , body.name);
  if(!updated) return res.status(401).json({ success: false, message: "Incorrect Workout ID" });
  return res.status(200).json({ success: true });
});

app.route("/dashboard/schedule-workout").get(function(req , res){
  res.sendFile(__dirname + "/views/scheduleWorkout.html");
}).post(async function(req , res){
  const id = req.body.workoutId;
  let schedule = req.body.scheduledAt;
  let scheduleDate = new Date(schedule).toString();
  const newSchedule = await workout.scheduleWorkout(id , scheduleDate);
  if(!newSchedule) return res.status(401).json({ success: false, message: "Incorrect Workout ID" });
  return res.status(200).json({ success: true });
});

//define the get request for /api/schedule
app.route("/api/schedules").get(async function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  const id = payload.id;
  const all = await workout.getWorkouts(id);
  let result = {};
  for(let i = 0 ; i < all.length ; i++){
    if(all[i].schedule){
      result[all[i]._id] = {"name" : all[i].name ,"workouts" : all[i].workouts , "schedule" : all[i].schedule};
    }
  }
  res.json(result);
});

//SHOW FREQUENCY AS NO OF WORKOUTS/MONTH/YEAR
app.route("/api/report/frequency").get(async function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  const id = payload.id;
  const all = await workout.getWorkouts(id);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let map = {};
  for(let i = 0 ; i < all.length ; i++){
    let date = new Date(all[i].schedule);
    let month = date.getMonth();
    let year = date.getFullYear(); 
    let monthName = monthNames[month];
    let key = `${monthName}-${year}`;
    if(map[key]){
      map[key] += 1;
    }
    else{
      map[key] = 1;
    }
  }
  res.json(map);
});

app.route("/dashboard/reports").get(function(req , res){
  res.sendFile(__dirname + "/views/progressReports.html");
})

app.route("/api/report/volume").get(async function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  const id = payload.id;
  const all = await workout.getWorkouts(id);

  let perWorkoutMap = {};
  let perMonthMap = {};

  for (let i = 0; i < all.length; i++) {
    if (all[i].schedule) {
      const dateObj = new Date(all[i].schedule);
      const workoutDate = dateObj.toISOString().split('T')[0];
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();
      const monthKey = `${month}-${year}`;
      
      const workouts = all[i].workouts;
      let weightedVolume = 0;
      let repVolume = 0;

      for (let j = 0; j < workouts.length; j++) {
        const sets = workouts[j].sets || 0;
        const reps = workouts[j].reps || 0;
        const weights = workouts[j].weights || 0;
        weightedVolume += sets * reps * weights;
        repVolume += sets * reps;
      }
      perWorkoutMap[`${workoutDate} - ${all[i]._id}`] = {
        weightedVolume,
        repetitionVolume: repVolume
      };

      if (perMonthMap[monthKey]) {
        perMonthMap[monthKey].totalWeightedVolume += weightedVolume;
        perMonthMap[monthKey].totalRepVolume += repVolume;
      } else {
        perMonthMap[monthKey] = {
          totalWeightedVolume: weightedVolume,
          totalRepVolume: repVolume
        };
      }
    }
  }
  res.json({ perMonth: perMonthMap, perWorkout: perWorkoutMap });
});

app.route("/api/report/classes").get(async function(req , res){
  const token = req.cookies.authToken;
  const payload = jwt.verify(token , process.env.JWT_KEY);
  const id = payload.id;
  const all = await workout.getWorkouts(id);
  const splitMap = {
    // Push Exercises
    "Push-Up": "Push",
    "Pushups": "Push", // Added for common variation
    "Wall Push Ups": "Push", // Added from data
    "Shoulder Press": "Push",
    "Overhead Press": "Push", // Added from data
    "Bench Press": "Push",
    "Tricep Dips": "Push",

    // Pull Exercises
    "Pull-Up": "Pull",
    "Pull Ups": "Pull", // Added for common variation
    "Bicep Curl": "Pull",
    "Bicep Curls": "Pull", // Added for common variation
    "Lat Pulldown": "Pull", // Added from data
    "Rows": "Pull", // Added from data

    // Legs Exercises
    "Squat": "Legs",
    "Squats": "Legs", // Added for common variation
    "Lunges": "Legs",
    "Jump Squats": "Legs",
    "Leg Press": "Legs", // Added from data

    // Core Exercises
    "Plank": "Core",
    "Side Plank": "Core",
    "Russian Twists": "Core",
    "Leg Raises": "Core",

    // Cardio Exercises
    "Mountain Climbers": "Cardio",
    "Mountain Climber": "Cardio", // Added for common variation
    "Burpees": "Cardio",
    "Jump Rope": "Cardio",
    "High Knees": "Cardio",

    // Full Body Exercises
    "Deadlift": "Full Body",
    "Deadlifts": "Full Body", // Added for common variation
    "Kettlebell Swing": "Full Body",

    // Plyometrics (existing, assuming it's still needed)
    "Box Jumps": "Plyometrics"
  };
  exerciseType = {};
  for(let i = 0 ; i < all.length ; i++){
    let workouts = all[i].workouts;
    for(let j = 0 ; j < workouts.length ; j++){
      let exerciseName = workouts[j].exercise;
      if(splitMap[exerciseName]){
        let type = splitMap[exerciseName];
        if(exerciseType[type]){
          exerciseType[type] += 1;
        }
        else{
          exerciseType[type] = 1;
        }
      }
    }
  }
  res.json(exerciseType);
});

module.exports = app;