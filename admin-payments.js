import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyAJ6dcJZxYTnH3R3XWr3qdk6EDpfa7jphU",

    authDomain:
        "learn-with-deedar.firebaseapp.com",

    databaseURL:
        "https://learn-with-deedar-default-rtdb.firebaseio.com",

    projectId:
        "learn-with-deedar",

    storageBucket:
        "learn-with-deedar.firebasestorage.app",

    messagingSenderId:
        "93219928041",

    appId:
        "1:93219928041:web:5f3ea3d3b1055f760b3d78"
};


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const database =
    getDatabase(app);


const paymentList =
    document.getElementById("paymentList");


const paymentsRef =
    ref(database, "paymentRequests");


const ADMIN_EMAIL =
    "poetshahbaz_quambrani@gmail.com";


// =====================================================
// CHECK ADMIN LOGIN
// =====================================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            paymentList.innerHTML =
                "<p style='color:red;'>" +
                "❌ Admin login required." +
                "</p>";

            setTimeout(() => {

                window.location.href =
                    "admin-login.html";

            }, 1000);

            return;
        }


        // =================================================
        // CHECK ADMIN EMAIL
        // =================================================

        if (
            user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            paymentList.innerHTML =
                "<p style='color:red;'>" +
                "❌ You are not authorized to access " +
                "the payment dashboard." +
                "</p>";

            return;
        }


        // =================================================
        // ADMIN IS AUTHENTICATED
        // =================================================

        paymentList.innerHTML =
            "<p>🔄 Loading payment requests...</p>";


        loadPayments();

    }
);


// =====================================================
// LOAD PAYMENTS
// =====================================================

function loadPayments() {

    onValue(

        paymentsRef,

        (snapshot) => {

            paymentList.innerHTML = "";


            if (!snapshot.exists()) {

                paymentList.innerHTML =
                    "<p>No payment requests found.</p>";

                return;
            }


            const payments =
                snapshot.val();


            Object.entries(payments)
                .reverse()
                .forEach(
                    ([id, payment]) => {

                        createPaymentCard(
                            id,
                            payment
                        );

                    }
                );

        },

        (error) => {

            console.error(
                "Firebase payment read error:",
                error
            );


            paymentList.innerHTML =

                "<p style='color:red;'>" +

                "❌ Could not load payment requests." +

                "<br><br>" +

                error.message +

                "</p>";

        }

    );

}


// =====================================================
// CREATE PAYMENT CARD
// =====================================================

function createPaymentCard(
    id,
    payment
) {

    const card =
        document.createElement("div");


    card.style.border =
        "1px solid #ddd";

    card.style.padding =
        "15px";

    card.style.marginBottom =
        "15px";

    card.style.borderRadius =
        "10px";

    card.style.background =
        "#fff";


    // =================================================
    // BOOK
    // =================================================

    const title =
        document.createElement("h3");

    title.textContent =
        "📚 " +
        (
            payment.bookName ||
            "Book"
        );


    // =================================================
    // STUDENT
    // =================================================

    const student =
        document.createElement("p");

    student.innerHTML =
        "<strong>Student:</strong> ";


    student.append(
        document.createTextNode(
            payment.studentName ||
            ""
        )
    );


    // =================================================
    // WHATSAPP
    // =================================================

    const whatsapp =
        document.createElement("p");

    whatsapp.innerHTML =
        "<strong>WhatsApp:</strong> ";


    whatsapp.append(
        document.createTextNode(
            payment.whatsapp ||
            ""
        )
    );


    // =================================================
    // AMOUNT
    // =================================================

    const amount =
        document.createElement("p");

    amount.innerHTML =
        "<strong>Amount:</strong> Rs. ";


    amount.append(
        document.createTextNode(
            String(
                payment.amount ||
                ""
            )
        )
    );


    // =================================================
    // BOOK ID
    // =================================================

    const bookId =
        document.createElement("p");

    bookId.innerHTML =
        "<strong>Book ID:</strong> ";


    bookId.append(
        document.createTextNode(
            payment.bookId ||
            "Not specified"
        )
    );


    // =================================================
    // TRANSACTION ID
    // =================================================

    const transaction =
        document.createElement("p");

    transaction.innerHTML =
        "<strong>JazzCash TID:</strong> ";


    transaction.append(
        document.createTextNode(
            payment.transactionId ||
            ""
        )
    );


    // =================================================
    // STATUS
    // =================================================

    const status =
        document.createElement("p");

    status.innerHTML =
        "<strong>Status:</strong> ";


    status.append(
        document.createTextNode(
            payment.status ||
            "pending"
        )
    );


    card.append(
        title,
        student,
        whatsapp,
        amount,
        bookId,
        transaction,
        status
    );


    // =================================================
    // PENDING
    // =================================================

    if (
        payment.status ===
        "pending"
    ) {

        const approveButton =
            document.createElement(
                "button"
            );


        approveButton.className =
            "btn";


        approveButton.textContent =
            "✅ Approve Payment";


        approveButton.style.marginRight =
            "10px";


        approveButton.addEventListener(
            "click",
            () =>
                approvePayment(
                    id,
                    payment
                )
        );


        const rejectButton =
            document.createElement(
                "button"
            );


        rejectButton.className =
            "btn";


        rejectButton.textContent =
            "❌ Reject";


        rejectButton.addEventListener(
            "click",
            () =>
                updatePayment(
                    id,
                    "rejected"
                )
        );


        card.append(
            approveButton,
            rejectButton
        );

    }


    // =================================================
    // APPROVED — BOOK NOT SENT
    // =================================================

    else if (

        payment.status ===
            "approved" &&

        payment.bookSent !== true

    ) {

        const verified =
            document.createElement(
                "p"
            );


        verified.style.color =
            "green";


        verified.style.fontWeight =
            "bold";


        verified.textContent =
            "✅ Payment verified.";


        card.appendChild(
            verified
        );


        const sendButton =
            document.createElement(
                "button"
            );


        sendButton.className =
            "btn";


        sendButton.textContent =
            "📚 Send Book";


        sendButton.addEventListener(
            "click",
            () =>
                sendBook(
                    id,
                    payment
                )
        );


        card.appendChild(
            sendButton
        );

    }


    // =================================================
    // BOOK SENT
    // =================================================

    else if (

        payment.status ===
            "approved" &&

        payment.bookSent === true

    ) {

        const sentMessage =
            document.createElement(
                "p"
            );


        sentMessage.style.color =
            "green";


        sentMessage.style.fontWeight =
            "bold";


        sentMessage.textContent =
            "📚 Book access has been sent.";


        card.appendChild(
            sentMessage
        );

    }


    // =================================================
    // REJECTED
    // =================================================

    else if (

        payment.status ===
        "rejected"

    ) {

        const rejectedMessage =
            document.createElement(
                "p"
            );


        rejectedMessage.style.color =
            "red";


        rejectedMessage.style.fontWeight =
            "bold";


        rejectedMessage.textContent =
            "❌ Payment rejected.";


        card.appendChild(
            rejectedMessage
        );

    }


    paymentList.appendChild(
        card
    );

}


// =====================================================
// APPROVE PAYMENT
// =====================================================

async function approvePayment(
    paymentId,
    payment
) {

    const question =

        "Have you checked and received this payment?" +

        "\n\n" +

        "Student: " +
        (
            payment.studentName ||
            ""
        ) +

        "\n" +

        "Book: " +
        (
            payment.bookName ||
            "Book"
        ) +

        "\n" +

        "Amount: Rs. " +
        (
            payment.amount ||
            ""
        ) +

        "\n" +

        "JazzCash TID: " +
        (
            payment.transactionId ||
            ""
        ) +

        "\n\n" +

        "Approve this payment?";


    if (!confirm(question)) {
        return;
    }


    try {

        await update(

            ref(
                database,
                "paymentRequests/" +
                paymentId
            ),

            {

                status:
                    "approved",

                verifiedAt:
                    new Date()
                        .toISOString(),

                bookSent:
                    false

            }

        );


        alert(

            "✅ Payment approved." +

            "\n\n" +

            "📚 Send Book button will now appear."

        );

    }

    catch (error) {

        console.error(
            "Approve payment error:",
            error
        );


        alert(

            "❌ Payment could not be approved." +

            "\n\n" +

            error.message

        );

    }

}


// =====================================================
// SEND BOOK
// =====================================================

async function sendBook(
    paymentId,
    payment
) {

    const bookName =
        payment.bookName ||
        "your book";


    const whatsapp =
        payment.whatsapp ||
        "";


    const bookId =
        payment.bookId ||
        "";


    if (!bookId) {

        alert(
            "❌ This payment has no Book ID."
        );

        return;
    }


    if (!whatsapp) {

        alert(
            "❌ This payment has no WhatsApp number."
        );

        return;
    }


    const question =

        "Send access for:" +

        "\n\n" +

        bookName +

        "\n\n" +

        "to WhatsApp:" +

        "\n" +

        whatsapp +

        "?";


    if (!confirm(question)) {
        return;
    }


    try {

        // =================================================
        // CORRECT GITHUB PAGES URL
        // =================================================

        const accessUrl =

            window.location.origin +

            "/learn-with-deedar-quambrani/" +

            "book-access.html?payment=" +

            encodeURIComponent(
                paymentId
            );


        // =================================================
        // MARK BOOK AS SENT
        // =================================================

        await update(

            ref(
                database,
                "paymentRequests/" +
                paymentId
            ),

            {

                status:
                    "approved",

                bookSent:
                    true,

                bookId:
                    bookId,

                bookName:
                    bookName,

                sentAt:
                    new Date()
                        .toISOString()

            }

        );


        // =================================================
        // WHATSAPP MESSAGE
        // =================================================

        const message =

            "Assalam-o-Alaikum " +

            (
                payment.studentName ||
                ""
            ) +

            ",\n\n" +

            "Your payment for:\n" +

            "📚 " +

            bookName +

            "\n\n" +

            "has been verified successfully. ✅" +

            "\n\n" +

            "You can access your book here:\n" +

            accessUrl +

            "\n\n" +

            "Thank you for learning with Deedar Quambrani.";


        let whatsappNumber =
            whatsapp.replace(
                /\D/g,
                ""
            );


        if (
            whatsappNumber.startsWith(
                "0"
            )
        ) {

            whatsappNumber =
                "92" +
                whatsappNumber.substring(
                    1
                );

        }


        const whatsappUrl =

            "https://wa.me/" +

            whatsappNumber +

            "?text=" +

            encodeURIComponent(
                message
            );


        window.open(
            whatsappUrl,
            "_blank"
        );


        alert(
            "✅ Book access message opened in WhatsApp."
        );

    }

    catch (error) {

        console.error(
            "Send book error:",
            error
        );


        alert(

            "❌ Could not send book access." +

            "\n\n" +

            error.message

        );

    }

}


// =====================================================
// REJECT PAYMENT
// =====================================================

async function updatePayment(
    paymentId,
    newStatus
) {

    if (
        !confirm(
            "Reject this payment?"
        )
    ) {
        return;
    }


    try {

        await update(

            ref(
                database,
                "paymentRequests/" +
                paymentId
            ),

            {

                status:
                    newStatus,

                verifiedAt:
                    new Date()
                        .toISOString()

            }

        );


        alert(
            "❌ Payment rejected."
        );

    }

    catch (error) {

        console.error(
            "Payment update error:",
            error
        );


        alert(

            "❌ Could not update payment." +

            "\n\n" +

            error.message

        );

    }

}
