BASE_URL="https://warranty-vault-4v38.onrender.com";


// =================== File Preview Section ===================
const fileInput = document.getElementById("warrantyFile");
const filePreview = document.getElementById("filePreview");
const fileNameEl = document.getElementById("fileName");
const fileSizeEl = document.getElementById("fileSize");
const removeFileBtn = document.getElementById("removeFile");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;
    filePreview.style.display = "block";
  } else {
    filePreview.style.display = "none";
  }
});

removeFileBtn.addEventListener("click", () => {
  fileInput.value = "";
  filePreview.style.display = "none";
});
// =============================================================





document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = localStorage.getItem("userEmail");
  if (!email) {

    showNotification("User email missing - please login again!","error");
    return;
  }

  // 🧩 STEP 1 — Define plan limits
  const PLAN_LIMITS = {
    FREE: 2,
    BASIC: 10,
    PREMIUM: 50
  };

  // 🧩 STEP 2 — Get user's plan
  const planType = localStorage.getItem("planType") || "FREE";

  // 🧩 STEP 3 — Check how many warranties are already uploaded
  try {
  const res = await fetch(`${BASE_URL}/api/vault/list/${email}`);

    if (!res.ok) throw new Error("Failed to fetch warranties");
    const warranties = await res.json();
    console.log("Fetched warranties:", warranties);


    const currentCount = warranties.length;
    const allowedLimit = PLAN_LIMITS[planType.toUpperCase()] || 2;

    // 🛑 STEP 4 — Stop if user exceeded limit
    if (currentCount >= allowedLimit) {
     showNotification(`You reached your ${planType} plan limit (${allowedLimit} warranties). Upgrade to add more!`, "warning");
     setTimeout(() => {
       window.location.href = "dashboard.html";
     }, 5000);

      return;
    }
  } catch (err) {
    console.error("Error checking plan limit:", err);
  }

  // ✅ STEP 5 — Continue with normal upload
  const productName = document.getElementById("productName").value;
  const category = document.getElementById("category").value;
  const brand = document.getElementById("brand").value;
  const purchaseDate = document.getElementById("purchaseDate").value;
  const warrantyExpiry = document.getElementById("warrantyExpiry").value;
  const serialNumber = document.getElementById("serialNumber").value;
  const purchasePrice = document.getElementById("purchasePrice").value;
  const notes = document.getElementById("notes").value;
  const warrantyFile = document.getElementById("warrantyFile").files[0];
  const additionalFiles = document.getElementById("additionalFiles").files;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("productName", productName);
  formData.append("category", category);
  formData.append("brand", brand);
  formData.append("purchaseDate", purchaseDate);
  formData.append("warrantyExpiry", warrantyExpiry);
  formData.append("serialNumber", serialNumber);
  formData.append("purchasePrice", purchasePrice);
  formData.append("notes", notes);

  if (warrantyFile) {
    formData.append("warrantyFile", warrantyFile);
  }

  if (additionalFiles.length > 0) {
    for (let i = 0; i < additionalFiles.length; i++) {
      formData.append("additionalFiles", additionalFiles[i]);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/api/vault/upload`, {
      method: "POST",
      body: formData,
       credentials: "include"
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      alert("Upload failed: " + errorText);
      return;
    }

    const result = await response.json();
    console.log("Upload success:", result);
showNotification("Warranty uploaded successfully!", "success");

// ✅ Show uploaded file confirmation
if (warrantyFile) {
  filePreview.style.display = "block";
  fileNameEl.textContent = warrantyFile.name;
  fileSizeEl.textContent = `${(warrantyFile.size / 1024).toFixed(1)} KB`;
}

// ✅ Reset other form fields (except file)
document.getElementById("uploadForm").reset();


    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    console.error("Error during upload:", error);

    showNotification("Error occurred while uploading!");
  }
});
