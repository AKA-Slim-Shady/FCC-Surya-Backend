require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const exerciseSchema = mongoose.Schema({
  name: String,
  category: String,
  difficulty: String,
  equipment: String,
  instructions: String
});

const exercises = mongoose.model('exercise' , exerciseSchema);

const exerciseData = [
  {
    name: "Push-Up",
    category: "Strength",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Place hands on the ground shoulder-width apart, lower your body until your chest nearly touches the floor, then push yourself back up."
  },
  {
    name: "Pull-Up",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: "Pull-Up Bar",
    instructions: "Hang from a bar with palms facing away and pull yourself up until your chin is above the bar, then lower yourself slowly."
  },
  {
    name: "Squat",
    category: "Strength",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Stand with feet shoulder-width apart, bend knees and lower hips, keeping chest up, then return to standing."
  },
  {
    name: "Deadlift",
    category: "Strength",
    difficulty: "Advanced",
    equipment: "Barbell",
    instructions: "With feet hip-width apart, bend at hips and knees to grip the barbell, lift by straightening hips and knees simultaneously."
  },
  {
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Keep your body straight and hold yourself up on forearms and toes, maintaining a flat back."
  },
  {
    name: "Mountain Climbers",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "None",
    instructions: "From a plank position, quickly alternate driving knees towards your chest."
  },
  {
    name: "Burpees",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "None",
    instructions: "Drop into a squat, kick feet back into a push-up position, return to squat, and jump up explosively."
  },
  {
    name: "Bicep Curl",
    category: "Strength",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    instructions: "Hold dumbbells at your side and curl them toward your shoulders, keeping elbows close to your torso."
  },
  {
    name: "Shoulder Press",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    instructions: "Push dumbbells upward from shoulder height until arms are fully extended overhead, then return."
  },
  {
    name: "Lunges",
    category: "Strength",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Step forward with one leg and lower your hips until both knees are bent at about 90 degrees, then push back."
  },
  {
    name: "Jump Rope",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: "Jump Rope",
    instructions: "Swing the rope and jump as it passes under your feet, maintaining a consistent rhythm."
  },
  {
    name: "Russian Twists",
    category: "Core",
    difficulty: "Intermediate",
    equipment: "Medicine Ball",
    instructions: "Sit with knees bent, lean back slightly, and twist your torso side to side while holding a medicine ball."
  },
  {
    name: "Leg Raises",
    category: "Core",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Lie on your back and lift your legs straight up until they form a 90-degree angle with your torso, then lower slowly."
  },
  {
    name: "Bench Press",
    category: "Strength",
    difficulty: "Advanced",
    equipment: "Barbell, Bench",
    instructions: "Lie on a bench and press a barbell from chest level upward until arms are extended, then lower under control."
  },
  {
    name: "High Knees",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: "None",
    instructions: "Run in place while driving your knees up towards your chest as high as possible."
  },
  {
    name: "Tricep Dips",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: "Bench",
    instructions: "With hands behind on a bench, lower your body by bending elbows, then push back up."
  },
  {
    name: "Box Jumps",
    category: "Plyometrics",
    difficulty: "Intermediate",
    equipment: "Box",
    instructions: "Jump explosively onto a sturdy box or platform and land softly with knees slightly bent."
  },
  {
    name: "Side Plank",
    category: "Core",
    difficulty: "Intermediate",
    equipment: "None",
    instructions: "Lie on one side and lift your body off the ground, supporting weight on one forearm and foot."
  },
  {
    name: "Jump Squats",
    category: "Plyometrics",
    difficulty: "Intermediate",
    equipment: "None",
    instructions: "Perform a squat, then jump explosively and land softly back into a squat position."
  },
  {
    name: "Kettlebell Swing",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: "Kettlebell",
    instructions: "Swing a kettlebell from between your legs to shoulder height using your hips and core."
  }
];

const exercisesList = async() => {
  const list = await exercises.find();
  return list;
}

module.exports = {exercises , exercisesList};