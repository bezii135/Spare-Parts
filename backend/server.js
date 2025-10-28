import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './Routes/authRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
app.get('/', (req, res) => {
  res.send('Server is running!');
});
