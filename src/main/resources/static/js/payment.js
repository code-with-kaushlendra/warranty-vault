async function initiatePayment(planType, amount) {
  try {
    const userEmail = localStorage.getItem("userEmail");
      const userPhone = localStorage.getItem("userPhone") || "9999999999"; // ✅ fallback if missing
    if (!userEmail) {
      showNotification("Please Login First!","error");
      return;
    }

    // Step 1: Create order on backend
    const res = await fetch(
      `https://warranty-vault-4v38.onrender.com/api/payment/create-order?amount=${amount}&email=${userEmail}&planType=${planType}`,
      { method: "POST" }
    );

    const order = await res.json();
    if (order.error) {
      alert("Error creating order: " + order.error);
      return;
    }

    // Step 2: Razorpay Checkout Options
    const options = {
      key: "rzp_live_RUv2nx9Eg3xoQf", // Replace with your test key
      amount: order.amount,
      currency: order.currency,
      name: "Warranty Vault",
      description: `Upgrade to ${planType} Plan`,
      order_id: order.id,
      handler: async function (response) {
       showNotification("Payment Successfull...","success");
        console.log(response);

        // Step 3: Notify backend of successful payment
        await fetch("https://warranty-vault-4v38.onrender.com/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
             email: userEmail,
          }),
        });

        // Step 4: UI update
        document.getElementById("planBadge").textContent = planType + " Plan";
        document.getElementById("planName").textContent = planType;
        document.getElementById("planDescription").textContent =
          "You are now a premium user!";
        hideUpgradeModal();
      },
      prefill: {
        email: userEmail,
        name: localStorage.getItem("userName") || "User",
        contact: userPhone,
      },
      theme: { color: "#007bff" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment initiation failed:", err);

    showNotification("Error initiating payment!","error");
  }
}

// Attach to buttons
function showUpgradeModal() {
  document.getElementById("planInfo").style.display = "none";
  document.getElementById("upgradeOptions").style.display = "block";
}

function hideUpgradeModal() {
  document.getElementById("upgradeOptions").style.display = "none";
  document.getElementById("planInfo").style.display = "block";
}
