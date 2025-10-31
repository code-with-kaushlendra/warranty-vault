// ============================================
// AUTHENTICATION - LOGIN & REGISTER
// ============================================

// ✅ Notification Helper
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// ✅ Password Toggle Helper
function setupPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const input = document.getElementById(inputId);

  if (toggleBtn && input) {
    toggleBtn.addEventListener("click", () => {
      const type = input.type === "password" ? "text" : "password";
      input.type = type;
      toggleBtn.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });
  }
}

// Password toggle setup
setupPasswordToggle("togglePassword", "password");
setupPasswordToggle("toggleRegPassword", "regPassword");
setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

// ✅ Password Strength Checker
const regPasswordInput = document.getElementById("regPassword");
if (regPasswordInput) {
  regPasswordInput.addEventListener("input", (e) => {
    const password = e.target.value;
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const strengthMap = [
      { label: "Weak", color: "#dc3545" },
      { label: "Fair", color: "#ffc107" },
      { label: "Good", color: "#17a2b8" },
      { label: "Strong", color: "#28a745" },
    ];

    const level = Math.min(strength - 1, 3);
    const { label, color } = strengthMap[level] || strengthMap[0];
    strengthBar.style.width = `${(strength / 5) * 100}%`;
    strengthBar.style.background = color;
    strengthText.textContent = `Password strength: ${label}`;
    strengthText.style.color = color;
  });
}

// ✅ Email & Phone Validators
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
}

// ============================================
// ✅ LOGIN FORM SUBMISSION
// ============================================

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => {
      el.classList.remove("show");
    });

    // Validation
    if (!validateEmail(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email";
      document.getElementById("emailError").classList.add("show");
      isValid = false;
    }
    if (password.length < 6) {
      document.getElementById("passwordError").textContent = "Password must be at least 6 characters";
      document.getElementById("passwordError").classList.add("show");
      isValid = false;
    }

    if (!isValid) return;

    const user = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      console.log("Login response:", result);

      if (response.ok) {
        alert("Login Successful");
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed: " + result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during login!", error);
      alert("An error occurred");
    }
  });
}

// ============================================
// ✅ REGISTER FORM SUBMISSION
// ============================================

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("regEmail").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => el.classList.remove("show"));

    if (firstName.trim().length < 2) {
      document.getElementById("firstNameError").textContent = "First name must be at least 2 characters";
      document.getElementById("firstNameError").classList.add("show");
      isValid = false;
    }

    if (lastName.trim().length < 2) {
      document.getElementById("lastNameError").textContent = "Last name must be at least 2 characters";
      document.getElementById("lastNameError").classList.add("show");
      isValid = false;
    }

    if (!validateEmail(email)) {
      document.getElementById("regEmailError").textContent = "Please enter a valid email";
      document.getElementById("regEmailError").classList.add("show");
      isValid = false;
    }

    if (!validatePhone(phone)) {
      document.getElementById("phoneError").textContent = "Please enter a valid 10-digit phone number";
      document.getElementById("phoneError").classList.add("show");
      isValid = false;
    }

    if (password.length < 8) {
      document.getElementById("regPasswordError").textContent = "Password must be at least 8 characters";
      document.getElementById("regPasswordError").classList.add("show");
      isValid = false;
    }

    if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
      document.getElementById("confirmPasswordError").classList.add("show");
      isValid = false;
    }

    if (!terms) {
      document.getElementById("termsError").textContent = "You must agree to the terms";
      document.getElementById("termsError").classList.add("show");
      isValid = false;
    }

    if (!isValid) return;

    const user = { firstName, lastName, email, phone, password };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup Successful! Redirecting to login page...");
        window.location.href = "login.html";
      } else {
        alert("Signup failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error During Signup!", error);
      alert("An error occurred");
    }
  });
}
