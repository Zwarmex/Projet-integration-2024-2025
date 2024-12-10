import express from "express";

import eauRoutes from "./eau.js";
import nourritureRoutes from "./nourriture.js";
const router = express.Router();

router.use("/eau", eauRoutes);
router.use("/nourriture", nourritureRoutes);

export default router;
