const API_URL = 'https://shy-sea-1363.julianlee091873.workers.dev/';

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const modelSelect = document.getElementById('modelSelect');

    let messageHistory = [{
        role: "system",
        content: "你是一個AI助手。請始終使用繁體中文回答問題，即使用戶使用其他語言提問。請保持專業、友善且詳細的回答方式。"
    }];
    // 清除對話功能
    function clearChat() {
        // 清除顯示的消息
        chatBox.innerHTML = '';
        
        // 重置消息歷史，只保留系統提示
        messageHistory = [{
            role: "system",
            content: "你是一個AI助手。請始終使用繁體中文回答問題，即使用戶使用其他語言提問。請保持專業、友善且詳細的回答方式。"
        }];

        // 清除輸入框
        userInput.value = '';
        
        // 可以添加一個提示消息
        addMessage("對話已清除，可以開始新的對話了。", false, true);
    }

    // 添加清除按鈕事件監聽器
    clearButton.addEventListener('click', () => {
        // 添加確認提示
        if (confirm('確定要清除所有對話記錄嗎？')) {
            clearChat();
        }
    });

    // 添加使用次數顯示元素
    const usageInfo = document.createElement('div');
    usageInfo.className = 'usage-info';
    chatBox.parentElement.insertBefore(usageInfo, chatBox);

    // 添加調試日誌
    console.log('Usage info element created:', usageInfo);
    console.log('Parent element:', chatBox.parentElement);

    function updateUsageInfo(current, limit) {
        console.log('Updating usage info:', current, limit); // 添加調試日誌
        usageInfo.textContent = `今日已使用 ${current}/${limit} 次`;
        // 如果快達到限制，改變顏色提醒
        if (current > limit * 0.8) {
            usageInfo.style.color = '#d63031';
        }
    }       

    function addMessage(content, isUser = false, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : isError ? 'error-message' : 'bot-message'}`;
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // 只有正常對話才加入歷史記錄
        if (!isError && (isUser || !content.startsWith('抱歉'))) {
            messageHistory.push({
                role: isUser ? "user" : "assistant",
                content: content
            });
        }
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

            const data = await response.json();
            console.log('API Response:', data); // 添加調試日誌
            
            if (data.error) {
                addMessage(data.error, false, true);
                if (data.usage) {
                    updateUsageInfo(data.usage, data.limit);
                }
                messageHistory.pop();
                return;
            }

            // 更新使用次數顯示
            if (data.usage_info) {
                console.log('Usage info received:', data.usage_info); // 添加調試日誌
                updateUsageInfo(
                    data.usage_info.current,
                    data.usage_info.limit
                );
            }

            const botResponse = data.choices[0].message.content;
            addMessage(botResponse);
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，發生錯誤，請稍後再試。', false, true);
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