
BASE_URL="https://warranty-vault-4v38.onrender.com";

const chatIcon = document.getElementById("chatbot-icon");
    const chatBox = document.getElementById("chatbot-box");
    const chatBody = document.getElementById("chat-body");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // Toggle Chat Window
        chatIcon.addEventListener("click", () => {
            chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
        });

        // Send message
        sendBtn.addEventListener("click", sendMessage);
        input.addEventListener("keypress", function(e){
            if(e.key === "Enter") sendMessage();
        });

        function sendMessage() {
            let message = input.value.trim();
            if(message === "") return;

            // Show user message
            chatBody.innerHTML += `<p><b>You:</b> ${message}</p>`;
            chatBody.scrollTop = chatBody.scrollHeight;

            input.value = "";

            // Call backend API
            fetch(`${BASE_URL}/api/chat`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: message})
            })
            .then(res => res.text())
            .then(reply => {
                chatBody.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            })
            .catch(err => {
                chatBody.innerHTML += `<p><b>AI:</b> Error connecting to server.</p>`;
            });
        }