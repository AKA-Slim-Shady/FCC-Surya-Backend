const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI);

const userSchema = mongoose.Schema({
    'userName': String,
    'password': String,
    'name': String
});

const users = mongoose.model('workoutUsers', userSchema);

const createUser = async(username , password , name) => {
    const newUser = await users.create({
        "name" : name,
        "userName" : username,
        "password" : password
    });
    return newUser;
}

const findUser = async(username) => {
    const found = await users.findOne({"userName" : username});
    return found;
}

module.exports = {
    users,
    createUser,
    findUser
};

