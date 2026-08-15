import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAJ6dcJZxYTnH3R3XWr3qdk6EDpfa7jphU",
    authDomain: "learn-with-deedar.firebaseapp.com",
    databaseURL: "https://learn-with-deedar-default-rtdb.firebaseio.com",
    projectId: "learn-with-deedar",
    storageBucket: "learn-with-deedar.firebasestorage.app",
    messagingSenderId: "93219928041",
    appId: "1:93219928041:web:5f3ea3d3b1055f760b3d78"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const trialForm = document.getElementById("trialForm");

trialForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();

    if (!name || !email || !whatsapp) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const bookingRef = push(ref(database, "trialBookings"));

        await set(bookingRef, {
            name: name,
            email: email,
            whatsapp: whatsapp,
            createdAt: new Date().toISOString()
        });

        alert("Thank you! Your free trial class request has been received.");

        trialForm.reset();

    } catch (error) {

        console.error("Firebase error:", error);

        alert("Sorry, your request could not be submitted. Please try again.");

    }

});
