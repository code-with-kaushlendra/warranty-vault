document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email=localStorage.getItem("userEmail")
  if(!email){
  alert("User email missing - please login again!");
  return;
  }

  // Collect inputs
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

  // ✅ Create FormData
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
    // ✅ Send to backend API
    const response = await fetch("http://localhost:8080/api/vault/upload", {
      method: "POST",
      body: formData, // multipart/form-data auto handled
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      alert("Upload failed: " + errorText);
      return;
    }

    const result = await response.json();
    console.log("Upload success:", result);
    alert("Warranty uploaded successfully!");

    // Reset form
    document.getElementById("uploadForm").reset();

    setTimeout(()=>{
    window.location.href="dashboard.html"
    },1500)

  } catch (error) {
    console.error("Error during upload:", error);
    alert("Error occurred while uploading!");
  }
});
