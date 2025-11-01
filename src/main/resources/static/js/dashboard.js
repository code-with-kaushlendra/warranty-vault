document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("userName").textContent = userName;

  loadWarranties();
});

// ✅ Fetch warranties from backend
async function loadWarranties() {
  try {

     const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
      }

    const response = await fetch(`http://localhost:8080/api/dashboard/vaults/${email}`);
    if (!response.ok) throw new Error("Failed to fetch warranties");

    const data = await response.json();
    renderWarranties(data);
    document.getElementById("totalWarranties").textContent = data.length;
  } catch (error) {
    console.error("Error loading warranties:", error);
  }
}

// ✅ Display warranties on dashboard
function renderWarranties(warranties) {
  const filesGrid = document.getElementById("filesGrid");
  filesGrid.innerHTML = "";

  if (!warranties || warranties.length === 0) {
    filesGrid.innerHTML = `
      <div class="empty-state">
        <p>📁 No warranties uploaded yet</p>
        <button class="btn btn-primary" onclick="window.location.href='vault-upload.html'">Upload Now</button>
      </div>`;
    return;
  }

  warranties.forEach(w => {
    const card = document.createElement("div");
    card.classList.add("file-card");
    card.innerHTML = `
      <h3>${w.productName}</h3>
      <p><strong>Brand:</strong> ${w.brand}</p>
      <p><strong>Expiry:</strong> ${new Date(w.warrantyExpiry).toLocaleDateString()}</p>
      <a href="${w.warrantyFilePath}" target="_blank">View Warranty</a>
    `;
    filesGrid.appendChild(card);
  });
}

// ✅ Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ✅ Upgrade Modal
function showUpgradeModal() {
  document.getElementById("planInfo").style.display = "none";
  document.getElementById("upgradeOptions").style.display = "block";
}
function hideUpgradeModal() {
  document.getElementById("planInfo").style.display = "block";
  document.getElementById("upgradeOptions").style.display = "none";
}

// ✅ Selecting Plan
function selectPlan(planType) {
  alert(`Redirecting to payment for ${planType} plan`);
  // Later you can integrate Razorpay/Stripe here
}
