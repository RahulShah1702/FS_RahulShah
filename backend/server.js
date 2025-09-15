// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS so frontend can talk to backend
app.use(cors());

// Sample data of students
const students = [
    { name: 'Alice', location: 'New York' },
    { name: 'Bob', location: 'Los Angeles' },
    { name: 'Charlie', location: 'New York' },
];

// API to return nearby students by location
app.get('/nearby', (req, res) => {
    const userLocation = req.query.location;
    const nearbyStudents = students.filter(student => student.location.toLowerCase() === userLocation.toLowerCase());
    res.json(nearbyStudents);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
