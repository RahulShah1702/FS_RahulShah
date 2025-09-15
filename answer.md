Student Commute Optimizer (Full Stack)

The Student Commute Optimizer is a web application designed to help students share rides efficiently by matching them based on their commuting routes. Instead of traveling individually to school or college, students can carpool or share rides with others going in the same direction, reducing travel costs, traffic congestion, and pollution.

✅ What It Does:

🧑‍🎓 For Students:
Students enter their home and destination locations (or use automatic location detection), and the system finds other nearby students traveling along similar routes.

🌐 Map Interface:
Displays the user’s route and nearby matched students anonymously on an interactive map.

🔄 Anonymous Interaction:
Students are assigned random unique usernames (e.g., Student_abc123), so their real identities are kept private.

💬 Chat System:
Students can chat anonymously in real-time with matched students to coordinate rides.

✅ Why It’s Useful:

🚗 Saves money by reducing individual commuting costs.

🌱 Environmentally friendly by reducing the number of vehicles on the road.

⏱️ Saves time by sharing routes efficiently.

🛡️ Protects student privacy via anonymous usernames.

✅ Simple Example Use Case:

Rahul inputs his home and destination coordinates.

The system checks existing registered students and finds other students with overlapping routes.

Matches (e.g., Student_xyz456) are shown on the map.

Rahul clicks a matched student icon → Starts chatting anonymously.

They agree to share a car for their commute.

✅ In Summary:

The Student Commute Optimizer is an efficient, anonymous, and user-friendly web app that helps students find others with similar travel paths and share rides, promoting convenience and sustainability.


# Frontend Approach:

Here’s the detailed step-by-step approach I would follow to build the Frontend (Student-Facing Interface) of the Student Commute Optimizer

✅ Step 1: Set Up React Project

### Tool: Use create-react-app to bootstrap the project.

```
npx create-react-app student-commute-optimizer
cd student-commute-optimizer
```

### Install required libraries:

```
npm install leaflet react-leaflet socket.io-client
```

✅ Step 2: Home & Destination Input Form
🎯 Goal:

Let students enter their home and destination locations, or auto-detect their home location.

✅ Approach:

Create a React component <LocationForm />.

Inputs:

Home Latitude & Longitude (Auto-detect with Geolocation API).

Destination Latitude & Longitude (manual input).

On submit → send data to backend API (/api/register) via Fetch API.

✅ Example Flow:

```
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

```

✅ Step 3: Display Map with Routes
🎯 Goal:

Show:

User’s own route.

Nearby matched students as markers.

✅ Approach:

Use React-Leaflet to display the map.

Draw route as a polyline from home → destination.

After fetching matched students from backend (/api/findMatches), display their locations as anonymous markers.

Example Steps:

Initialize map centered on user's home location.

Render a polyline with user route points.

Loop through matched students → Place markers using <Marker> component.

On marker click → Open option to chat.

✅ Step 4: Implement Anonymous Chat Interface
🎯 Goal:

Allow real-time, anonymous chat between matched students.

✅ Approach:

Create a <ChatBox /> component.

Establish a Socket.io connection to backend:

```
import { io } from "socket.io-client";
const socket = io('http://localhost:5000');
```

Handle sending & receiving messages:

On form submit → emit sendMessage event with { sender, receiver, message }.

Listen for receiveMessage event → display in chat window.


✅ Step 5: UI/UX Considerations

Show loader during API calls (registration, match fetching).

Handle errors gracefully (e.g., invalid location input).

Disable chat input until user selects a matched student.


✅ Step 6: Testing Each Step

Test Geolocation API separately → Ensure home location is detected.

Test API calls independently using Postman or curl.

Test WebSocket connection manually to confirm chat works.

Test full flow: Register → Find Matches → Chat.


✅ Step 7: Future Improvements

Add visual route drawing where students can click on map to select destination.

Use Google Maps API for more advanced routing.

Add notifications for incoming chat messages.


# Backend (system operations):

Here’s the detailed step-by-step approach I would follow to build the Backend (System Operations) of the Student Commute Optimizer:

✅ Step 1: Set Up Backend Project

Initialize Node.js project:

```
mkdir backend
cd backend
npm init -y
npm install express mongoose socket.io cors uuid
```
Create main file: server.js

✅ Step 2: Set Up MongoDB Database
✅ Approach:

Use MongoDB Atlas for production or MongoMemoryServer for prototyping (no need to install MongoDB locally).

Define two main schemas:

```
// User Schema
{
    username: String,  // Unique anonymous username (e.g., Student_abc123)
    homeLocation: { lat: Number, lng: Number },
    destinationLocation: { lat: Number, lng: Number },
    route: [{ lat: Number, lng: Number }]
}

// Chat Schema
{
    senderUsername: String,
    receiverUsername: String,
    message: String,
    timestamp: Date
}
```

✅ Step 3: Implement User Registration
🎯 Goal:

Generate a unique anonymous username.

Save home location, destination, and route in the database.

✅ Approach:

Receive request from frontend:
{ homeLocation, destinationLocation, route }

Generate random UUID-based username:
Example → Student_<uuidv4().slice(0,8)>

Save user to DB.

Return generated username to frontend.


✅ Step 4: Implement Route Matching Logic
🎯 Goal:

Given a new route, find users with similar routes.

✅ Approach:

Receive route from frontend (current user).

Query database: User.find()

For each user in database:

Compute overlap percentage using Haversine Distance formula.

Example Threshold: ≥ 60% overlap.

```
function calculateRouteOverlap(routeA, routeB) {
    let overlapCount = 0;
    routeA.forEach(pointA => {
        routeB.forEach(pointB => {
            if (haversineDistance(pointA, pointB) < 0.5) { // 0.5 km threshold
                overlapCount++;
            }
        });
    });
    return (overlapCount / routeA.length) * 100;
}
```
Return list of matching anonymous usernames to frontend.


✅ Step 5: Implement WebSocket for Real-Time Chat
🎯 Goal:

Allow anonymous real-time chat between matched students.

✅ Approach:

1. Initialize Socket.io in the backend.
```
const io = new Server(server, { cors: { origin: "*" } });
```
2. On connection event:

Listen for sendMessage events:

Save message in MongoDB (with sender and receiver username).

Emit receiveMessage event back to connected clients.


✅ Step 6: Ensure Anonymity & Uniqueness

Username is never tied to real identity.

Random UUID ensures uniqueness.

Example:
```
const username = 'Student_' + uuidv4().slice(0, 8);
```

✅ Step 7: Testing & Validation

Test registration → Check DB if username is stored.

Test /findMatches → Ensure correct matching logic.

Test WebSocket chat manually → Send and receive messages.