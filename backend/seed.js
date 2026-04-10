import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();

  const users = [
    {
      name: "Admin",
      email: "admin@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "admin"
    },
    {
      name: "Technician",
      email: "tech@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "technician"
    }
  ];

  await User.insertMany(users);

  console.log("Seed Done");
  process.exit();
};

seed();