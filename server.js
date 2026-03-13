require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./src/config/user.db");
const userRoutes = require("./routes/userRoutes");
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDb(process.env.MONGO_URI);

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(
    `Server is listening on the port ${port} : http://localhost:${port}`,
  );
});