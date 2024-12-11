import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";

let db; // Variable pour stocker la base de données

const connectDB = async () => {
  try {
    const client = new MongoClient(uri, {
    });
    await client.connect();
    db = client.db("DB");
    console.log("Connected to Database");
    await mongoose.connect(uri, {
      dbName: "DB",
    });
  } catch (err) {
    console.error("Please connect Database: " + err);
  }
};

export { connectDB, db };


