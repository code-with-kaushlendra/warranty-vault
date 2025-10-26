// ============================================
// FAQ PAGE - JAVASCRIPT
// ============================================

// FAQ Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    if (question) {
      question.addEventListener("click", () => {
        // Close all other FAQs
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active")
          }
        })

        // Toggle current FAQ
        item.classList.toggle("active")
      })
    }
  })

  // Search functionality
  const helpSearch = document.getElementById("helpSearch")
  if (helpSearch) {
    helpSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const faqItems = document.querySelectorAll(".faq-item")

      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question span:first-child")
        const answer = item.querySelector(".faq-answer p")

        if (question && answer) {
          const questionText = question.textContent.toLowerCase()
          const answerText = answer.textContent.toLowerCase()

          if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        }
      })
    })
  }

  console.log("[v0] FAQ page loaded successfully")
})
