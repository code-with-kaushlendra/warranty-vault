
BASE_URL="https://warranty-vault-4v38.onrender.com";


// ✅ Prevent browser from caching the dashboard page






if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
  window.location.reload(true);
}


// ✅ Prevent access without login
const userEmail = localStorage.getItem("userEmail");
if (!userEmail) {
  showNotification("Please log in to continue", "error");
  window.location.replace("login.html");
}


document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("userName").textContent = userName;
   const userEmail = localStorage.getItem("userEmail");

   if(!userEmail){
   showNotification("User not logged in!","error");
   setTimeout(()=>{
     window.location.href="login.html";
   },2000);
   return;
   }


 loadWarranties();
 loadUserPlan(userEmail);
  showReminders();


  setTimeout(()=>{
       showExpiryNotifications(userEmail);
  },1000);

});


// ===============================
// DISPLAY WARRANTIES (Table + Edit/Delete)
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

  // Build table
  const table = document.createElement("table");
  table.classList.add("warranty-table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Brand</th>
        <th>Purchase Date</th>
        <th>Expiry Date</th>
        <th>File</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  warranties.forEach((w) => {
    const expiry = new Date(w.warrantyExpiry).toLocaleDateString();
    const purchase = w.purchaseDate
      ? new Date(w.purchaseDate).toLocaleDateString()
      : "—";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${w.productName}</td>
      <td>${w.brand}</td>
      <td>${purchase}</td>
      <td>${expiry}</td>
      <td><a href="${w.warrantyFilePath}" target="_blank" class="view-link">View</a></td>
      <td>
        <button class="btn btn-sm btn-edit" onclick="editWarranty('${w.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-delete" onclick="deleteWarranty('${w.id}')">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  filesGrid.appendChild(table);
}


// ===============================
// DELETE WARRANTY
// ===============================
async function deleteWarranty(id) {
  if (!confirm("Are you sure you want to delete this warranty?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/vault/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete warranty");

    showNotification("✅ Warranty deleted successfully", "success");
    loadWarranties(); // Refresh list
  } catch (err) {
    console.error("Error deleting warranty:", err);
    showNotification("❌ Failed to delete warranty", "error");
  }
}


async function editWarranty(id) {
  try {
    // ✅ Correct endpoint
    const res = await fetch(`${BASE_URL}/api/vault/${id}`);
    if (!res.ok) throw new Error("Failed to fetch warranty details");

    const w = await res.json();

    // Populate modal fields
    document.getElementById("editId").value = w.id;
    document.getElementById("editProductName").value = w.productName || "";
    document.getElementById("editBrand").value = w.brand || "";
    document.getElementById("editPurchaseDate").value = w.purchaseDate
      ? w.purchaseDate.split("T")[0]
      : "";
    document.getElementById("editExpiryDate").value = w.warrantyExpiry
      ? w.warrantyExpiry.split("T")[0]
      : "";

const modal = document.getElementById("editModal");
modal.style.display = "flex"; // enable flex layout for centering

  } catch (err) {
    console.error("Error loading warranty:", err);
    showNotification("❌ Failed to load warranty for editing", "error");
  }
}


// Save edited warranty
async function saveEditedWarranty() {
  const id = document.getElementById("editId").value;
  const productName = document.getElementById("editProductName").value;
  const brand = document.getElementById("editBrand").value;
  const purchaseDate = document.getElementById("editPurchaseDate").value;
  const warrantyExpiry = document.getElementById("editExpiryDate").value;

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("brand", brand);
    formData.append("purchaseDate", purchaseDate);
    formData.append("warrantyExpiry", warrantyExpiry);
    formData.append("category", "Electronics");

  try {
    const res = await fetch(`${BASE_URL}/api/vault/edit/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update warranty");

    showNotification("✅ Warranty updated successfully", "success");
    document.getElementById("editModal").style.display = "none";
    loadWarranties();
  } catch (err) {
    console.error("Error updating warranty:", err);
    showNotification("❌ Failed to update warranty", "error");
  }
}

// Close modal
function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}



function logout() {
  // Clear all possible client storage
  localStorage.clear();
  sessionStorage.clear();

  // Also clear any cookies (if you ever use them)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  showNotification("Logging out...", "success");

  // Use replace to prevent going back to dashboard
  setTimeout(() => {
    window.location.replace("login.html");
     window.location.reload(true);
  }, 1000);
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
    const res = await fetch(`${BASE_URL}/api/reminders/expiring/${email}`);
    if (!res.ok) throw new Error("Failed to fetch reminders");

    const warranties = await res.json();
    const remindersGrid = document.getElementById("remindersGrid");

    remindersGrid.innerHTML = "";

    if (warranties.length === 0) {
      remindersGrid.innerHTML = `<div class="empty-reminders">✅ No upcoming warranty expiries.</div>`;
      return;
    }

    warranties.forEach((w) => {
      const expiry = new Date(w.warrantyExpiry);
      const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

      const div = document.createElement("div");
      div.classList.add("reminder-card", "warning");

      div.innerHTML = `
        <div class="reminder-content">
          <span class="reminder-icon">⏰</span>
          <div class="reminder-text">
            <span class="reminder-product">${w.productName}</span> warranty expires in
            <span class="reminder-days">${daysLeft} day(s)</span> on
            <span class="reminder-date">${expiry.toLocaleDateString()}.</span>
          </div>
        </div>
      `;

      remindersGrid.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching reminders:", err);
    remindersGrid.innerHTML = `<div class="empty-reminders error">⚠️ Could not load reminders.</div>`;
  }
}


// ===============================
// FETCH USER PLAN DETAILS
// ===============================
async function loadUserPlan(email) {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/user/${email}`);

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


async function showExpiryNotifications(email) {
  if (!email) return;

  try {
    const res = await fetch(`${BASE_URL}/api/reminders/expiring/${email}`);
    if (!res.ok) throw new Error("Failed to fetch reminders");

    const warranties = await res.json();

    if (warranties.length > 0) {
  warranties.forEach((w) => {
    const expiry = new Date(w.warrantyExpiry);
    const today = new Date();

    // Normalize both to midnight (avoid timezone shift)
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let message = "";
    if (daysLeft > 0) {
      message = `expires in <span class="reminder-days">${daysLeft} day(s)</span>`;
    } else if (daysLeft === 0) {
      message = `<span class="reminder-days">expires today!</span>`;
    } else {
      message = `<span class="reminder-days expired">expired ${Math.abs(daysLeft)} day(s) ago</span>`;
    }

    const div = document.createElement("div");
    div.classList.add("reminder-card", "warning");

    div.innerHTML = `
      <div class="reminder-content">
        <span class="reminder-icon">⏰</span>
        <div class="reminder-text">
          <span class="reminder-product">${w.productName}</span> ${message}
          (on <span class="reminder-date">${expiry.toLocaleDateString()}</span>)
        </div>
      </div>
    `;

    remindersGrid.appendChild(div);
  });


    } else {
      console.log("No upcoming expiries.");
    }

    // ✅ Also check plan expiry
    const planType = localStorage.getItem("planType");
    const planExpiryDate = localStorage.getItem("planExpiryDate");
    if (planType !== "Premium" && planExpiryDate) {
      const expiry = new Date(planExpiryDate);
      const today = new Date();
      const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 5 && daysLeft > 0) {
        showNotification(
          `⚠️ Your ${planType} plan expires in ${daysLeft} day(s). Renew soon!`,
          "warning"
        );
      } else if (daysLeft <= 0) {
        showNotification("❌ Your plan has expired. Please upgrade to continue.", "error");
      }
    }
  } catch (err) {
    console.error("Error showing expiry notifications:", err);
  }
}



// ===============================
// FETCH WARRANTIES
// ===============================
async function loadWarranties() {
  try {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      showNotification("User not logged in !","error");


      window.location.href = "login.html";

        return;

      }




    const response = await fetch(`${BASE_URL}/api/dashboard/vaults/${email}`);
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
