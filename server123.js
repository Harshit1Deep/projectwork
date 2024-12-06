const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/eventsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  eventDate: String,
  message: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

// Route to handle form submissions
app.post("/register", async (req, res) => {
  const { name, email, event, eventDate, message } = req.body;

  const newRegistration = new Registration({
    name,
    email,
    event,
    eventDate,
    message,
  });

  try {
    await newRegistration.save();
    res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving registration data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
