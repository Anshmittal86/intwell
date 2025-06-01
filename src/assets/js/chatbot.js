import '../css/output.css';

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
    // Disconnect SSE
    disconnectSSE();
    chatContainer.classList.add('hidden');
    chatBubble.classList.remove('hidden');
  });

  // Toggle chat with header
  chatHeader.addEventListener('click', function (e) {
    if (!e.target.closest('#minimizeChat') && !e.target.closest('#closeChat')) {
      chatContainer.classList.toggle('minimized');
    }
  });

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

  // Send with button click
  sendMessage.addEventListener('click', sendUserMessage);

  // Send with Enter key
  chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendUserMessage();
    }
  });

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

  let eventSource = null;
  let sseConnected = false;

  function connectSSE() {
    if (eventSource || sseConnected) return; // prevent multiple connections

    if (eventSource) {
      eventSource.close(); // close old connection before starting a new one
      eventSource = null;
    }
    eventSource = new EventSource('http://localhost:3000/sse');

    console.log(eventSource);

    eventSource.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);

      console.log(data);

      if (data.type === 'content_block_delta') {
        const text = data.delta?.text || '';
        addMessage(text, 'bot');
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
      eventSource = null;
      sseConnected = false;
    };

    sseConnected = true;
  }

  function disconnectSSE() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      sseConnected = false;
    }
  }

  // Process message with AI
  // https://intwell-backend.vercel.app/chat
  async function processWithAI(message) {
    try {
      connectSSE();
      // Wait 100ms to ensure SSE connection is established
      await new Promise((resolve) => setTimeout(resolve, 100));

      await fetch('http://localhost:3000/messages', {
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
    } catch (error) {
      console.error('Error communicating with AI backend:', error);
      addMessage('Oops! Something went wrong.', 'bot');
    }
  }
});
