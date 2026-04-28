// server/seed.js
const mongoose = require('mongoose');
require('dotenv').config(); // Make sure this is at the top

// --- Define the Course Model (needs to be identical to index.js) ---
const courseSchema = new mongoose.Schema({
  imageUrl: String,
  category: String,
  title: String,
  price: Number,
  rating: Number,
  studentCount: Number
});

const Course = mongoose.model('Course', courseSchema);

// --- Your Course Data ---
const seedCourses = [
  {
    imageUrl: "https://placehold.co/600x400/007bff/white?text=Communication",
    category: "Communication",
    title: "Communication skills - Master Your Communication",
    price: 35.00,
    rating: 4.5,
    studentCount: 1324
  },
  {
    imageUrl: "https://placehold.co/600x400/e83e8c/white?text=Development",
    category: "Development",
    title: "The Complete 2024 Web Development Bootcamp",
    price: 49.00,
    rating: 4.8,
    studentCount: 2840
  },
  {
    imageUrl: "https://placehold.co/600x400/28a745/white?text=Photography",
    category: "Photography",
    title: "The Complete Guide to Photography for Beginners",
    price: 29.00,
    rating: 4.7,
    studentCount: 980
  }
];

// --- The Seed Function ---
const seedDB = async () => {
  try {
    // 1. Connect to the database
    const dbUrl = process.env.DATABASE_URL;
    await mongoose.connect(dbUrl);
    console.log("✅ Seed script connected to MongoDB Atlas!");

    // 2. Clear out any old courses
    await Course.deleteMany({});
    console.log("🧹 Cleared old courses.");

    // 3. Insert the new courses
    await Course.insertMany(seedCourses);
    console.log("🌱 Database successfully seeded with 3 courses!");

  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    // 4. Disconnect from the database
    mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB.");
  }
};

// Run the function
seedDB();