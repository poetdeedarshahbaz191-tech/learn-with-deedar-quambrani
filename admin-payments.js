import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {

    apiKey: "AIzaSyAJ6dcJZxYTnH3R3XWr3qdk6EDpfa7jphU",

    authDomain: "learn-with-deedar.firebaseapp.com",

    databaseURL:
        "https://learn-with-deedar-default-rtdb.firebaseio.com",

    projectId: "learn-with-deedar",

    storageBucket:
        "learn-with-deedar.firebasestorage.app",

    messagingSenderId: "93219928041",

    appId:
        "1:93219928041:web:5f3ea3d3b1055f760b3d78"
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const paymentList =
    document.getElementById("paymentList");

const paymentsRef =
    ref(database, "paymentRequests");


// =====================================================
// LOAD PAYMENT REQUESTS
// =====================================================

onValue(paymentsRef, (snapshot) => {

    paymentList.innerHTML = "";

    if (!snapshot.exists()) {

        paymentList.innerHTML =
            "<p>No payment requests found.</p>";

        return;
    }


    const payments = snapshot.val();


    Object.entries(payments)
        .reverse()
        .forEach(([id, payment]) => {

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
                (payment.bookName || "Book");


            // =================================================
            // STUDENT
            // =================================================

            const student =
                document.createElement("p");

            student.innerHTML =
                "<strong>Student:</strong> ";

            student.append(
                document.createTextNode(
                    payment.studentName || ""
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
                    payment.whatsapp || ""
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
                    String(payment.amount || "")
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
                    payment.bookId || "Not specified"
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
                    payment.transactionId || ""
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
                    payment.status || "pending"
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
            // PENDING PAYMENT
            // =================================================

            if (payment.status === "pending") {

                const approveButton =
                    document.createElement("button");

                approveButton.className = "btn";

                approveButton.textContent =
                    "✅ Approve Payment";

                approveButton.style.marginRight =
                    "10px";


                approveButton.addEventListener(
                    "click",
                    () => approvePayment(
                        id,
                        payment
                    )
                );


                const rejectButton =
                    document.createElement("button");

                rejectButton.className = "btn";

                rejectButton.textContent =
                    "❌ Reject";


                rejectButton.addEventListener(
                    "click",
                    () => updatePayment(
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
                payment.status === "approved" &&
                payment.bookSent !== true
            ) {

                const verified =
                    document.createElement("p");

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
                    document.createElement("button");

                sendButton.className = "btn";

                sendButton.textContent =
                    "📚 Send Book";


                sendButton.addEventListener(
                    "click",
                    () => sendBook(
                        id,
                        payment
                    )
                );


                card.appendChild(
                    sendButton
                );
            }


            // =================================================
            // BOOK ALREADY SENT
            // =================================================

            else if (
                payment.status === "approved" &&
                payment.bookSent === true
            ) {

                const sentMessage =
                    document.createElement("p");

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
                payment.status === "rejected"
            ) {

                const rejectedMessage =
                    document.createElement("p");

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


            paymentList.appendChild(card);

        });

});


// =====================================================
// APPROVE PAYMENT
// =====================================================

async function approvePayment(
    paymentId,
    payment
) {

    const question =
        "Have you checked and received this payment?\n\n" +

        "Book: " +
        (payment.bookName || "Book") +
        "\n" +

        "Amount: Rs. " +
        (payment.amount || "") +
        "\n" +

        "JazzCash TID: " +
        (payment.transactionId || "") +

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

                status: "approved",

                verifiedAt:
                    new Date().toISOString(),

                bookSent: false

            }
        );


        alert(
            "✅ Payment approved.\n\n" +
            "Now the 📚 Send Book button will appear."
        );


    } catch (error) {

        console.error(
            "Approve payment error:",
            error
        );


        alert(
            "❌ Payment could not be approved."
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
        payment.bookName || "your book";

    const whatsapp =
        payment.whatsapp || "";

    const bookId =
        payment.bookId || "";


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
        "Send access for:\n\n" +

        bookName +

        "\n\n" +

        "to WhatsApp:\n" +

        whatsapp +

        "?";


    if (!confirm(question)) {
        return;
    }


    try {

        // =================================================
        // CREATE BOOK ACCESS LINK
        // =================================================

        const accessUrl =
            window.location.origin +
            "/book-access.html?payment=" +
            encodeURIComponent(paymentId);


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

                status: "approved",

                bookSent: true,

                bookId: bookId,

                bookName: bookName,

                sentAt:
                    new Date().toISOString()

            }
        );


        // =================================================
        // WHATSAPP MESSAGE
        // =================================================

        const message =
            "Assalam-o-Alaikum " +
            (payment.studentName || "") +

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


        const whatsappNumber =
            whatsapp.replace(
                /\D/g,
                ""
            );


        const whatsappUrl =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        window.open(
            whatsappUrl,
            "_blank"
        );


        alert(
            "✅ Book access sent on WhatsApp."
        );


    } catch (error) {

        console.error(
            "Send book error:",
            error
        );


        alert(
            "❌ Could not send book access."
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

    if (!confirm("Reject this payment?")) {
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

                status: newStatus,

                verifiedAt:
                    new Date().toISOString()

            }
        );


        alert(
            "❌ Payment rejected."
        );


    } catch (error) {

        console.error(
            "Payment update error:",
            error
        );


        alert(
            "❌ Could not update payment."
        );

    }

}
