document.addEventListener('DOMContentLoaded', function () {
  const chatBubble = document.getElementById('chatBubble');
  const chatContainer = document.getElementById('chatContainer');
  const minimizeChat = document.getElementById('minimizeChat');
  const closeChat = document.getElementById('closeChat');
  const chatHeader = document.getElementById('chatHeader');
  const chatInput = document.getElementById('chatInput');
  const sendMessage = document.getElementById('sendMessage');
  const chatBody = document.getElementById('chatBody');

  // Open chat
  chatBubble.addEventListener('click', function () {
    chatBubble.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    chatContainer.classList.remove('minimized');
    chatInput.focus();
  });

  // Minimize chat
  minimizeChat.addEventListener('click', function () {
    chatContainer.classList.toggle('minimized');
  });

  // Close chat
  closeChat.addEventListener('click', function () {
    chatContainer.classList.add('hidden');
    chatBubble.classList.remove('hidden');
  });

  // Toggle chat with header
  chatHeader.addEventListener('click', function (e) {
    if (!e.target.closest('#minimizeChat') && !e.target.closest('#closeChat')) {
      chatContainer.classList.toggle('minimized');
    }
  });

  // Send with button click
  sendMessage.addEventListener('click', sendUserMessage);

  // Send with Enter key
  chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendUserMessage();
    }
  });

  function playAudio() {
    const audio = document.getElementById('audio');
    audio.play();
  }
  // Send message function
  function sendUserMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      addMessage(message, 'user');
      chatInput.value = '';

      // Show typing indicator
      showTypingIndicator();

      // Process with AI
      processWithAI(message);
    }
  }
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.textContent = text;
    hideTypingIndicator();
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      indicator.appendChild(dot);
    }

    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Process message with AI
  async function processWithAI(message) {
    try {
      const response = await fetch('https://intwell-backend.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'message',
          data: {
            messages: [
              {
                role: 'user',
                content: message
              }
            ]
          }
        })
      });

      const data = await response.text();
      addMessage(data, 'bot');
      playAudio();
    } catch (error) {
      addMessage('Oops! Something went wrong.', 'bot');
    }
  }
});
