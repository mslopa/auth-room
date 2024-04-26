// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://lopamudrasahoo199:ievQ5gs0YN3HolYD@cluster0.uuqc5t6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define User schema
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String }
}));

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(cors());

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid email or password');
        }
        const token = jwt.sign({ userId: user.id }, 'secret');
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
