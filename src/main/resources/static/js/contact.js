// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById("contactForm")

// Declare showNotification function
function showNotification(message, type) {
  alert(message) // Simple alert for demonstration purposes
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    // Validation
    if (!name.trim()) {
      showNotification("Please enter your name", "error")
      return
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification("Please enter a valid email address", "error")
      return
    }

    if (!subject) {
      showNotification("Please select a subject", "error")
      return
    }

    if (!message.trim() || message.trim().length < 10) {
      showNotification("Please enter a message (at least 10 characters)", "error")
      return
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = "Sending..."

    setTimeout(() => {
      showNotification("Message sent successfully! We will get back to you soon.", "success")

      // Reset form
      contactForm.reset()
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    }, 1500)
  })
}

console.log("[v0] Contact form initialized")
