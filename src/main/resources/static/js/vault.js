document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = localStorage.getItem("userEmail");
  if (!email) {
    alert("User email missing - please login again!");
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
  const res = await fetch(`http://localhost:8080/api/vault/list/${email}`);

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
    const response = await fetch("http://localhost:8080/api/vault/upload", {
      method: "POST",
      body: formData,
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

    document.getElementById("uploadForm").reset();

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {
    console.error("Error during upload:", error);
    alert("Error occurred while uploading!");
  }
});
