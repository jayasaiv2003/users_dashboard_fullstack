import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes.js";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);
app.use("/users",userRoutes);


console.log("PORT IS:", process.env.PORT);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
