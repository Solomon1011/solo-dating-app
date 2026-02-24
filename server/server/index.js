const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  coins: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false }
}));

app.get("/", (req, res) => {
  res.send("Dating App Running ❤️");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();
  res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRETKEY");

  res.json({ message: "Login successful", token });
});

app.post("/bot", (req, res) => {
  const { message } = req.body;

  let reply = "Hello dear ❤️";

  if (message.includes("hi")) {
    reply = "Hi handsome 😘";
  }

  res.json({ reply });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server Started")
);
