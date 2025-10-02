require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const PaymentRoutes = require("./routes/PaymentRoutes");

// console.log(process.env.BASE_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(PaymentRoutes);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
