const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose');
const Person = require('../test-backend/models/person');
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);


app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended : true}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const userSchema =  mongoose.Schema({
  'username' : String
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  username: String,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});


let user =  mongoose.model('userModel' , userSchema);
let exercise = mongoose.model('exerciseModel' , exerciseSchema);

const createUser = async (userName) => {
  const newUser = await user.create({'username' : userName});
  return newUser;
}

app.route("/api/users").post(
  async function(req , res){
    const userName = req.body.username;
    const newUser = await createUser(userName);
    res.json({
      '_id' : newUser._id,
      'username' : newUser.username
    });
}).get(
  async function(req , res){
    const allUsers = await user.find({});
    res.json(allUsers);
  }
);

const createExercise = async (id , desc , dur , date) => {
    const found = await user.findById(id); 
    const newExercise = await exercise.create({
      userId : id,
      username : found.username,
      description : desc,
      duration : dur,
      date : date ? new Date(date) : new Date()
    });
    return newExercise;
}

app.post('/api/users/:_id/exercises', async function(req, res) {
  const id = req.params._id;
  const desc = req.body.description;
  const dur = parseInt(req.body.duration); 
  const date = req.body.date;
  const entry = await createExercise(id, desc, dur, date);
  res.json({
    "_id": id,
    "username": entry.username, 
    "date": entry.date.toDateString(),
    "duration": entry.duration, 
    "description": entry.description
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


