const express = require('express');
const mongoose = require('mongoose');
const Person = require('./models/person');
require("dotenv").config();

let app = express();
app.use(express.json());

app.use(express.urlencoded({extended : true}));
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI);

app.get("/form" , function(req , res){
    res.sendFile(__dirname + "/views/form.html");
});

app.post("/createPerson" , function(req , res){
    const name = req.body.name;
    const age = req.body.age;
    const favoriteFood = req.body.favoriteFoods;
    const data = {
        'name' : name,
        'age' : age,
        'favouriteFoods' : favoriteFood
    }
    createAndSavePerson(data);
    res.json(data);
});

const createAndSavePerson = (dict , done) => {
    Person.create(dict);
}

module.exports = app;