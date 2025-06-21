const mongoose = require('mongoose');
const exercises = require('./seedExercises');

const workoutSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'workoutUsers'
  },
  workouts: [{
    exercise: { type: String, required: true },
    reps: { type: Number, required: true },
    sets: { type: Number, required: true },
    weights: { type: Number, required: true }
  }],
  name: String,
  schedule: String
});

const workout = mongoose.model('Workout', workoutSchema);

const createWorkOut = async (userID, workouts) => {
  const created = await workout.create({
    userID,
    workouts
  });
  return created;
};

const getWorkouts = async (userID) => {
  const created = await workout.find({ userID });
  return created;
};

const updateWorkouts = async (workoutID, exercises, workoutName) => {
  const updated = await workout.findOneAndUpdate(
    { _id: workoutID },
    { workouts: exercises, name: workoutName },
    { new: true }
  );
  return updated;
};

const scheduleWorkout = async (workoutID, scheduledAt) => {
  const updated = await workout.findOneAndUpdate(
    { _id: workoutID },
    { schedule: scheduledAt },
    { new: true }
  );
  return updated;
};

const deleteWorkout = async (workoutID) => {
  const deleted = await workout.deleteOne({ _id: workoutID });
  return deleted;
};

module.exports = {
  workout,
  createWorkOut,
  getWorkouts,
  updateWorkouts,
  scheduleWorkout,
  deleteWorkout
};
