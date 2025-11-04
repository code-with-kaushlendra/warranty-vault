document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("userName").textContent = userName;
   const userEmail = localStorage.getItem("userEmail");

 loadWarranties();
 loadUserPlan(userEmail);
  showReminders();
  checkWarrantyReminders();
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
  showNotification("Redirecting to Login Page..","success");
  setTimeout(()=>{
              window.location.href = "login.html";
  },2000);
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


// check warrnaty reminders

async function checkWarrantyReminders() {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  try {
    const res = await fetch(`http://localhost:8080/api/reminders/expiring/${email}`);
    if (!res.ok) throw new Error("Failed to fetch reminders");

    const warranties = await res.json();
    const remindersGrid = document.getElementById("remindersGrid");

    if (warranties.length === 0) {
      remindersGrid.innerHTML = `<div class="empty-reminders">✅ No upcoming warranty expiries.</div>`;
      return;
    }

    // Show cards for each expiring warranty
    remindersGrid.innerHTML = "";
    warranties.forEach(w => {
      const expiry = new Date(w.warrantyExpiry);
      const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

      const div = document.createElement("div");
      div.classList.add("reminder-card", "warning");
      div.innerHTML = `
        ⏰ <b>${w.productName}</b> warranty expires in <b>${daysLeft}</b> day(s) on ${expiry.toLocaleDateString()}.
      `;
      remindersGrid.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching reminders:", err);
  }
}


// ===============================
// FETCH USER PLAN DETAILS
// ===============================
async function loadUserPlan(email) {
  try {
    const res = await fetch(`http://localhost:8080/api/dashboard/user/${email}`);

    if (!res.ok) throw new Error("Failed to load user data");

    const user = await res.json();
    console.log("User plan data received:", user);

    // ✅ Extract plan details
    const { planType, planStartDate, planExpiryDate } = user;

    // ✅ Store for reuse
    localStorage.setItem("planType", planType);
    localStorage.setItem("planStartDate", planStartDate);
    localStorage.setItem("planExpiryDate", planExpiryDate);

        // ✅ Dynamically update displayed plan info
        document.getElementById("planType").textContent = planType || "Free";
        document.getElementById("planStart").textContent = planStartDate
          ? new Date(planStartDate).toLocaleDateString()
          : "--";
        document.getElementById("planExpiry").textContent = planExpiryDate
          ? new Date(planExpiryDate).toLocaleDateString()
          : "--";


    // ✅ Update plan section dynamically
    const planNameEl = document.getElementById("planName");
    const planBadgeEl = document.getElementById("planBadge");
    const planDescEl = document.getElementById("planDescription");
    const upgradeBtn = document.getElementById("upgradeBtn");

    if (planType === "Premium") {
      planBadgeEl.textContent = "Premium Plan ⭐";
      planNameEl.textContent = "Premium";
      planDescEl.textContent = "Lifetime warranty tracking with unlimited uploads.";
      upgradeBtn.style.display = "none";
    } else if (planType === "Basic") {
      planBadgeEl.textContent = "Basic Plan 🕒";
      planNameEl.textContent = "Basic";
      planDescEl.textContent = planExpiryDate
        ? `Expires on ${new Date(planExpiryDate).toLocaleDateString()}`
        : "Expires soon.";
      upgradeBtn.style.display = "inline-block";
    } else if (planType === "Expired") {
      planBadgeEl.textContent = "Expired ⚠️";
      planNameEl.textContent = "Expired Plan";
      planDescEl.textContent = "Your plan has expired. Please upgrade to continue.";
      upgradeBtn.style.display = "inline-block";
    } else {
      planBadgeEl.textContent = "Free Plan";
      planNameEl.textContent = "Free";
      planDescEl.textContent = "Start managing your warranties easily.";
      upgradeBtn.style.display = "inline-block";
    }
  } catch (err) {
    console.error("Error loading user plan:", err);
  }
}

// ===============================
// FETCH WARRANTIES
// ===============================
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

       // ✅ Calculate Active & Expiring Soon warranties
        let activeCount = 0;
        let expiringSoonCount = 0;

        const today = new Date();

        data.forEach((w) => {
          if (!w.warrantyExpiry) return; // skip if no expiry date

          const expiryDate = new Date(w.warrantyExpiry);
          const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

          if (daysLeft > 0) activeCount++;              // still valid
          if (daysLeft > 0 && daysLeft <= 7) expiringSoonCount++; // within 7 days
        });

        // ✅ Update dashboard counts
        document.getElementById("totalWarranties").textContent = data.length;
        document.getElementById("activeWarranties").textContent = activeCount;
        document.getElementById("expiringSoon").textContent = expiringSoonCount;
    renderWarranties(data);

    document.getElementById("totalWarranties").textContent = data.length;
  } catch (error) {
    console.error("Error loading warranties:", error);
  }
}

// ===============================
// DISPLAY WARRANTIES
// ===============================
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

  warranties.forEach((w) => {
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

// ===============================
// SHOW REMINDERS (Plan expiry notice)
// ===============================
function showReminders() {
  const remindersGrid = document.getElementById("remindersGrid");
  remindersGrid.innerHTML = "";

  const planType = localStorage.getItem("planType");
  const planExpiryDate = localStorage.getItem("planExpiryDate");

  // ✅ For Premium users
  if (planType === "Premium") {
    remindersGrid.innerHTML = `<div class="empty-reminders">✅ You have lifetime access. No reminders needed!</div>`;
    return;
  }

  // ✅ No expiry info
  if (!planExpiryDate) {
    remindersGrid.innerHTML = `<div class="empty-reminders">⚠️ Plan expiry date not found.</div>`;
    return;
  }

  const expiry = new Date(planExpiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    remindersGrid.innerHTML = `<div class="reminder-card expired">❌ Your plan has expired. Please upgrade to continue enjoying features.</div>`;
  } else if (daysLeft <= 5) {
    remindersGrid.innerHTML = `<div class="reminder-card warning">⏰ Your plan expires in <b>${daysLeft} days</b>. Renew soon!</div>`;
  } else {
    remindersGrid.innerHTML = `<div class="empty-reminders">✅ Your plan is active. No reminders at this time.</div>`;
  }
}

// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
  localStorage.clear();
  showNotification("Redirecting to Login Page...", "success");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}

// ===============================
// PLAN MODAL HANDLERS
// ===============================
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
