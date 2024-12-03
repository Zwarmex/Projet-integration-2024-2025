import express from "express";

import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
console.log(ObjectId); // J'ai mis cette ligne
//  routeur Express qui est utilisé pour définir des routes pour différentes opérations CRUD
const router = express.Router();

// définir les routes ici

export default router;
