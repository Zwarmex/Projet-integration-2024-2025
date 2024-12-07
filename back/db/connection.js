import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async (DATABASE_URL, db) => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: db, // Remplacez par le nom de votre base de données
    });
    console.log("Connected to Database");
  } catch (err) {
    console.log("Please connect Database" + err);
  }
};

const uri = process.env.ATLAS_URI || "";

let db;

export { db, connectDB };
