import express from "express";

import eauRoutes from "./eau.js";
import friandisesRoutes from "./friandises.js";
import nourritureRoutes from "./nourriture.js";
const router = express.Router();

router.use("/eau", eauRoutes);
router.use("/nourriture", nourritureRoutes);
router.use("/friandises", friandisesRoutes);

export default router;
