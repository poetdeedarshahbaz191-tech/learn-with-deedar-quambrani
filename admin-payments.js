
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
