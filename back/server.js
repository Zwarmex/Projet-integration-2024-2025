import express from "express";
import cors from "cors";
import recordRoutes from "./routes/record.js"; // Ajout de la route

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/records", recordRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
