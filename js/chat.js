// 移除原本的 API_KEY 相關設置
const API_URL = 'https://shy-sea-1363.julianlee091873.workers.dev/';

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const modelSelect = document.getElementById('modelSelect');

    let messageHistory = [];

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        messageHistory.push({
            role: isUser ? "user" : "assistant",
            content: content
        });
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        const selectedModel = modelSelect.value;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: messageHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            const botResponse = data.choices[0].message.content;
            addMessage(botResponse);
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，發生錯誤，請稍後再試。');
            messageHistory.pop();
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});