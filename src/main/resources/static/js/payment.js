// ============================================
// PAYMENT FORM HANDLING
// ============================================

const paymentForm = document.getElementById("paymentForm")

// Declare showNotification function
function showNotification(message, type) {
  console.log(`[${type}] ${message}`)
}

if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const cardholderName = document.getElementById("cardholderName").value
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "")
    const expiryDate = document.getElementById("expiryDate").value
    const cvv = document.getElementById("cvv").value
    const termsCheckbox = document.getElementById("termsCheckbox").checked

    // Validation
    if (!cardholderName.trim()) {
      showNotification("Please enter cardholder name", "error")
      return
    }

    if (cardNumber.length !== 16) {
      showNotification("Please enter a valid 16-digit card number", "error")
      return
    }

    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      showNotification("Please enter expiry date in MM/YY format", "error")
      return
    }

    if (cvv.length < 3 || cvv.length > 4) {
      showNotification("Please enter a valid CVV", "error")
      return
    }

    if (!termsCheckbox) {
      showNotification("Please agree to the terms and conditions", "error")
      return
    }

    // Validate expiry date
    const [month, year] = expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      showNotification("Card has expired", "error")
      return
    }

    // Simulate payment processing
    const submitBtn = paymentForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = "Processing..."

    setTimeout(() => {
      showNotification("Payment successful! Your plan is now active.", "success")

      // Reset form
      paymentForm.reset()
      submitBtn.disabled = false
      submitBtn.textContent = originalText

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    }, 2000)
  })
}

console.log("[v0] Payment form initialized")
