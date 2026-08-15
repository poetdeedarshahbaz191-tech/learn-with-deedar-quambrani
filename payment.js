
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


const books = {

    book1: {
        name: "Simple Sentences — Book 1",
        price: 200
    },

    book2: {
        name: "English with Deedar — Book 2",
        price: 200
    },

    book3: {
        name: "English Patterns — Book 3",
        price: 200
    },

    book4: {
        name: "Baat — Different English Words for ڳالھ",
        price: 200
    }

};


const params = new URLSearchParams(window.location.search);

const selectedBook = params.get("book");

const book = books[selectedBook];


const bookName = document.getElementById("bookName");

const paymentForm = document.getElementById("paymentForm");

const statusMessage = document.getElementById("statusMessage");

const submitButton = document.getElementById("submitPayment");


if (book) {

    bookName.textContent = book.name;

} else {

    bookName.textContent = "No book selected";

    paymentForm.style.display = "none";

    statusMessage.textContent =
        "Please select a book from the Books section.";

}


paymentForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    if (!book) {

        alert("Please select a book from the Books section.");

        return;

    }


    const name =
        document.getElementById("studentName")
            .value
            .trim();


    const whatsapp =
        document.getElementById("studentWhatsapp")
            .value
            .trim();


    const transactionId =
        document.getElementById("transactionId")
            .value
            .trim();


    if (!name || !whatsapp || !transactionId) {

        alert("Please complete all fields.");

        return;

    }


    submitButton.disabled = true;

    submitButton.textContent = "Submitting...";

    statusMessage.textContent =
        "Saving your payment request...";


    try {

        const paymentRef =
            push(
                ref(database, "paymentRequests")
            );


        await set(paymentRef, {

            studentName: name,

            whatsapp: whatsapp,

            bookId: selectedBook,

            bookName: book.name,

            amount: book.price,

            transactionId: transactionId,

            status: "pending",

            createdAt: new Date().toISOString()

        });


        const message =
            "Payment Verification Request\n\n" +

            "Student Name: " + name + "\n" +

            "WhatsApp: " + whatsapp + "\n" +

            "Book: " + book.name + "\n" +

            "Amount: Rs. " + book.price + "\n" +

            "JazzCash TID: " + transactionId;


        const whatsappNumber = "923073223367";


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        statusMessage.textContent =
            "✅ Request saved. Opening WhatsApp...";


        paymentForm.reset();


        window.open(whatsappURL, "_blank");


    } catch (error) {

        console.error(
            "Payment submission error:",
            error
        );


        statusMessage.textContent =
            "❌ Your request could not be submitted. Please try again.";


        submitButton.disabled = false;

        submitButton.textContent =
            "✅ Submit Payment for Verification";

    }

});
