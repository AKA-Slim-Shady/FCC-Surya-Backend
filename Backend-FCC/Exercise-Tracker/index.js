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

let user =  mongoose.model('userModel' , userSchema);

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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
