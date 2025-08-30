// Simulated user database
let users = JSON.parse(localStorage.getItem('users')) || [];

// Check if user is logged in
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

// Redirect to login if not logged in (except for Home, Login, and Register pages)
if (
    !loggedInUser &&
    !window.location.pathname.endsWith('index.html') &&
    !window.location.pathname.endsWith('login.html') &&
    !window.location.pathname.endsWith('register.html')
) {
    window.location.href = "login.html";
}

// Register functionality
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        document.getElementById('register-status').textContent = "User already exists!";
        return;
    }

    // Add new user
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('register-status').textContent = "Registration successful! Redirecting to login...";
    setTimeout(() => window.location.href = "login.html", 2000);
});

// Login functionality
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        document.getElementById('login-status').textContent = "Login successful! Redirecting to home...";
        setTimeout(() => window.location.href = "index.html", 2000);
    } else {
        document.getElementById('login-status').textContent = "Invalid email or password!";
    }
});

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = "index.html";
});

// Update navigation based on login status
const authLink = document.getElementById('auth-link');
if (loggedInUser) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.id = "logout-btn";
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = "index.html";
    });
} else {
    authLink.textContent = "Login";
    authLink.href = "login.html";
}

// Gemini API integration for chatbot
const GEMINI_API_URL = "https://api.gemini.com/v1/chat"; // Replace with the actual Gemini API endpoint
const GEMINI_API_KEY = "AIzaSyCo-ZEW9eVIb7OCTCNKd4o0-wAtGkDecBU"; // Replace with your actual Gemini API key

// Function to send user input to Gemini API and get a response
async function sendToGeminiAPI(userInput) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GEMINI_API_KEY}`,
            },
            body: JSON.stringify({
                message: userInput, // Send the user's input to the API
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from Gemini API");
        }

        const data = await response.json();
        return data.response; // Assuming the API returns a response in JSON format with a "response" field
    } catch (error) {
        console.error("Error communicating with chatbot :", error);
        return "Sorry, I couldn't process your request. Please try again later.";
    }
}

// Chatbot functionality
document.getElementById('send-btn')?.addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return; // Ignore empty input

    // Display user's message in the chat log
    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML += `<div class="user-message">You: ${userInput}</div>`;

    // Clear the input field
    document.getElementById('user-input').value = "";

    // Send user input to Gemini API and get a response
    const botResponse = await sendToGeminiAPI(userInput);

    // Display chatbot's response in the chat log
    chatLog.innerHTML += `<div class="bot-message">Beacon: ${botResponse}</div>`;

    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;

});
