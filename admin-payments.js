
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


            const title =
                document.createElement("h3");

            title.textContent =
                "📚 " +
                (payment.bookName || "Book");


            const student =
                document.createElement("p");

            student.innerHTML =
                "<strong>Student:</strong> ";

            student.append(
                document.createTextNode(
                    payment.studentName || ""
                )
            );


            const whatsapp =
                document.createElement("p");

            whatsapp.innerHTML =
                "<strong>WhatsApp:</strong> ";

            whatsapp.append(
                document.createTextNode(
                    payment.whatsapp || ""
                )
            );


            const amount =
                document.createElement("p");

            amount.innerHTML =
                "<strong>Amount:</strong> Rs. ";

            amount.append(
                document.createTextNode(
                    String(payment.amount || "")
                )
            );


            const transaction =
                document.createElement("p");

            transaction.innerHTML =
                "<strong>JazzCash TID:</strong> ";

            transaction.append(
                document.createTextNode(
                    payment.transactionId || ""
                )
            );


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
                transaction,
                status
            );


            if (payment.status === "pending") {

                const approveButton =
                    document.createElement("button");

                approveButton.className = "btn";

                approveButton.textContent =
                    "✅ Approve";

                approveButton.style.marginRight =
                    "10px";


                approveButton.addEventListener(
                    "click",
                    () => updatePayment(
                        id,
                        "approved"
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


            paymentList.appendChild(card);

        });

});


async function updatePayment(
    paymentId,
    newStatus
) {

    const question =
        newStatus === "approved"

            ? "Approve this payment?"

            : "Reject this payment?";


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

                status: newStatus,

                verifiedAt:
                    new Date().toISOString()

            }
        );


        alert(
            newStatus === "approved"

                ? "✅ Payment approved."

                : "❌ Payment rejected."
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
