// ============================================
// WARRANTY VAULT - MAIN JAVASCRIPT
// ============================================

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })
}

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

setActiveNavLink()

// FAQ Toggle
function toggleFAQ(element) {
  const faqItem = element.parentElement
  const isActive = faqItem.classList.contains("active")

  // Close all other FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Toggle current FAQ
  if (!isActive) {
    faqItem.classList.add("active")
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Add slideOut animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease-out forwards"
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".prop-card, .step-card, .pricing-card, .feature-card, .solution-card").forEach((el) => {
  observer.observe(el)
})

// Add fadeInUp animation
const animationStyle = document.createElement("style")
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`
document.head.appendChild(animationStyle)

// Format card number with spaces
function formatCardNumber(value) {
  return value
    .replace(/\s/g, "")
    .replace(/(\d{4})/g, "$1 ")
    .trim()
}

// Format expiry date
function formatExpiryDate(value) {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
  }
  return cleaned
}

// Card number input formatting
const cardNumberInput = document.getElementById("cardNumber")
if (cardNumberInput) {
  cardNumberInput.addEventListener("input", (e) => {
    e.target.value = formatCardNumber(e.target.value)
  })
}

// Expiry date input formatting
const expiryInput = document.getElementById("expiryDate")
if (expiryInput) {
  expiryInput.addEventListener("input", (e) => {
    e.target.value = formatExpiryDate(e.target.value)
  })
}

// CVV input - numbers only
const cvvInput = document.getElementById("cvv")
if (cvvInput) {
  cvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "")
  })
}

// Get URL parameters
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

// Update payment form based on plan
function updatePaymentForm() {
  const plan = getUrlParameter("plan")
  const planData = {
    free: { name: "Free Plan", price: 0 },
    smart: { name: "Smart Guardian", price: 199 },
    concierge: { name: "Concierge Plus", price: 599 },
  }

  if (plan && planData[plan]) {
    const data = planData[plan]
    const gst = Math.round(data.price * 0.18 * 100) / 100
    const total = data.price + gst

    const planNameEl = document.getElementById("planName")
    const planPriceEl = document.getElementById("planPrice")
    const gstEl = document.getElementById("gstAmount")
    const totalEl = document.getElementById("totalAmount")

    if (planNameEl) planNameEl.textContent = data.name
    if (planPriceEl) planPriceEl.textContent = `₹${data.price}`
    if (gstEl) gstEl.textContent = `₹${gst.toFixed(2)}`
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`
  }
}

updatePaymentForm()

// Payment method selection
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]')
paymentMethods.forEach((method) => {
  method.addEventListener("change", (e) => {
    document.querySelectorAll(".method-option").forEach((option) => {
      option.classList.remove("active")
    })
    e.target.parentElement.classList.add("active")
  })
})

// Set initial active payment method
const initialMethod = document.querySelector('input[name="paymentMethod"]:checked')
if (initialMethod) {
  initialMethod.parentElement.classList.add("active")
}

console.log("[v0] Warranty Vault frontend loaded successfully")
