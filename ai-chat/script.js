document.addEventListener('DOMContentLoaded', () => {
  // Initialize Highlight.js
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }

  // DOM Elements
  const chatForm = document.getElementById('chat-form');
  const promptInput = document.getElementById('prompt-input');
  const chatContainer = document.getElementById('chat-container');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeModal = document.querySelector('.close-modal');
  const saveSettingsBtn = document.getElementById('save-settings');
  const apiKeyInput = document.getElementById('api-key');
  const modelSelect = document.getElementById('model-select');
  const newChatBtn = document.querySelector('.new-chat-btn');
  const chatHistoryItems = document.querySelectorAll('.chat-history li');

  // State
  let apiKey = localStorage.getItem('openai_api_key') || '';
  let selectedModel = localStorage.getItem('selected_model') || 'gpt-3.5-turbo';
  let conversationHistory = [];
  let isProcessing = false;

  // Initialize settings from localStorage
  if (apiKey) {
    apiKeyInput.value = apiKey;
  }
  modelSelect.value = selectedModel;

  // Auto-resize textarea
  promptInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    if(this.value === '') {
      this.style.height = 'auto';
    }
  });

  // Handle Enter key (Shift+Enter for new line)
  promptInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(this.value.trim() !== '' && !isProcessing) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Settings Modal
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('active');
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });
  }

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('active');
    }
  });

  // Save Settings
  saveSettingsBtn.addEventListener('click', () => {
    apiKey = apiKeyInput.value.trim();
    selectedModel = modelSelect.value;
    
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('selected_model', selectedModel);
    
    settingsModal.classList.remove('active');
    
    if (apiKey) {
      showNotification('API Key saved successfully!', 'success');
    }
  });

  // New Chat
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      conversationHistory = [];
      chatContainer.innerHTML = '';
      addWelcomeMessage();
    });
  }

  // Chat History Click
  chatHistoryItems.forEach(item => {
    item.addEventListener('click', () => {
      chatHistoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Chat Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    const message = promptInput.value.trim();
    if (!message) return;

    // Add user message
    appendMessage('user', message);
    
    // Clear input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    
    // Scroll to bottom
    scrollToBottom();

    // Show typing indicator
    const typingId = showTypingIndicator();
    scrollToBottom();

    isProcessing = true;

    try {
      let response;
      
      if (apiKey) {
        // Use OpenAI API
        response = await getAIResponse(message);
      } else {
        // Use simulated responses
        response = await getSimulatedResponse(message);
      }
      
      removeTypingIndicator(typingId);
      appendMessage('ai', response, true);
      scrollToBottom();
      
    } catch (error) {
      removeTypingIndicator(typingId);
      appendMessage('ai', `<p style="color: #ff6b6b;">Error: ${escapeHTML(error.message)}</p>`, true);
      scrollToBottom();
    }

    isProcessing = false;
  });

  // OpenAI API Call
  async function getAIResponse(userMessage) {
    // Add user message to conversation
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // Add AI response to conversation
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    return formatResponse(assistantMessage);
  }

  // Simulated AI Response (when no API key)
  async function getSimulatedResponse(userMessage) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = generateContextualResponse(userMessage);
        resolve(responses);
      }, 1500 + Math.random() * 1000);
    });
  }

  // Generate contextual responses based on user input
  function generateContextualResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Code-related queries
    if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('react')) {
      return `<p>I'd be happy to help you with code! Here's an example based on your query:</p>
<pre><code class="language-javascript">
// Example solution
const solution = (input) => {
  // Your logic here
  return input
    .split('')
    .reverse()
    .join('');
};

console.log(solution("${escapeHTML(message.substring(0, 10))}..."));
</code></pre>
<p>This is a basic implementation. Would you like me to explain any specific part or provide a more advanced solution?</p>`;
    }
    
    // Explanation queries
    if (lowerMessage.includes('what is') || lowerMessage.includes('how does') || lowerMessage.includes('explain')) {
      return `<p>Great question! Let me explain:</p>
<p><strong>${escapeHTML(message)}</strong></p>
<p>This is an important concept in modern development. Here's a breakdown:</p>
<ul>
  <li>First, we need to understand the core principles</li>
  <li>Then apply them to your specific use case</li>
  <li>Finally, test and iterate on the solution</li>
</ul>
<p>Would you like me to dive deeper into any of these points?</p>`;
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('please') || lowerMessage.includes('can you')) {
      return `<p>Absolutely! I'm here to help. To provide you with the best assistance, could you share:</p>
<ol>
  <li>What specific problem you're trying to solve?</li>
  <li>What language or framework you're using?</li>
  <li>Any code snippets you've already tried?</li>
</ol>
<p>This will help me give you a more targeted solution!</p>`;
    }
    
    // Default responses
    const defaultResponses = [
      `<p>That's an interesting query! Here's my thoughts on it:</p>
<p>${escapeHTML(message)} is a fascinating topic. Let me provide some insights...</p>
<pre><code class="language-javascript">
// Related code example
const insights = {
  topic: "${escapeHTML(message.substring(0, 20))}...",
  depth: "intermediate",
  relevance: "high"
};
console.log(insights);
</code></pre>`,
      `<p>Thanks for asking! I can definitely help with that.</p>
<p>Based on your question about <strong>${escapeHTML(message.substring(0, 30))}...</strong>, here's what you need to know:</p>
<p>The key is to break down the problem into smaller, manageable parts and tackle them one at a time.</p>
<p>Would you like a code example or a more conceptual explanation?</p>`,
      `<p>I understand you're asking about <em>${escapeHTML(message.substring(0, 20))}...</em></p>
<p>Here's a comprehensive approach to solve this:</p>
<ol>
  <li>Start with the basics</li>
  <li>Build incrementally</li>
  <li>Test each component</li>
  <li>Refactor for better performance</li>
</ol>
<p>Let me know which step you'd like to explore further!</p>`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Format response with markdown-like styling
  function formatResponse(text) {
    // Convert code blocks
    let formatted = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert line breaks to paragraphs
    formatted = formatted.split('\n\n').map(p => `<p>${p}</p>`).join('');
    
    // Convert single line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  // Append message to chat
  function appendMessage(sender, text, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateY(20px)';
    msgDiv.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="avatar">CC</div>
        <div class="content"><p>${escapeHTML(text)}</p></div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="avatar ai-avatar"><i class="fa-solid fa-brain"></i></div>
        <div class="content">
          ${isHTML ? text : `<p>${escapeHTML(text)}</p>`}
        </div>
        <div class="actions">
          <i class="fa-regular fa-copy" title="Copy"></i>
          <i class="fa-regular fa-thumbs-up" title="Helpful"></i>
          <i class="fa-regular fa-thumbs-down" title="Not helpful"></i>
        </div>
      `;
      
      // Add copy functionality
      const copyBtn = msgDiv.querySelector('.fa-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const textContent = msgDiv.querySelector('.content').innerText;
          navigator.clipboard.writeText(textContent).then(() => {
            copyBtn.classList.remove('fa-regular', 'fa-copy');
            copyBtn.classList.add('fa-solid', 'fa-check');
            setTimeout(() => {
              copyBtn.classList.add('fa-regular', 'fa-copy');
              copyBtn.classList.remove('fa-solid', 'fa-check');
            }, 2000);
          });
        });
      }
    }

    chatContainer.appendChild(msgDiv);
    
    requestAnimationFrame(() => {
      msgDiv.style.opacity = '1';
      msgDiv.style.transform = 'translateY(0)';
    });

    if (typeof hljs !== 'undefined' && sender === 'ai') {
      msgDiv.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }

  // Show typing indicator
  function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.id = id;
    
    msgDiv.innerHTML = `
      <div class="avatar ai-avatar"><i class="fa-solid fa-brain"></i></div>
      <div class="content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    
    chatContainer.appendChild(msgDiv);
    return id;
  }

  // Remove typing indicator
  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Scroll to bottom
  function scrollToBottom() {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Escape HTML
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
      '&': '&amp;',
      '<': '<',
      '>': '>',
      "'": '&#39;',
      '"': '"'
    }[tag]));
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add welcome message for new chats
  function addWelcomeMessage() {
    const welcomeHTML = `
      <div class="message ai-message">
        <div class="avatar ai-avatar"><i class="fa-solid fa-brain"></i></div>
        <div class="content">
          <p>Hello! I'm <strong>Synapse AI</strong>, your intelligent assistant.</p>
          <p>I can help you with:</p>
          <ul>
            <li>Writing and debugging code</li>
            <li>Explaining technical concepts</li>
            <li>Brainstorming ideas</li>
            <li>Answering questions</li>
          </ul>
          <p>${apiKey ? '🔑 <strong>API Connected</strong> - I\'m powered by OpenAI!' : '⚠️ <strong>No API Key</strong> - Using demo mode. Add your OpenAI API key in settings for full functionality.'}</p>
        </div>
        <div class="actions">
          <i class="fa-regular fa-copy"></i>
          <i class="fa-regular fa-thumbs-up"></i>
          <i class="fa-regular fa-thumbs-down"></i>
        </div>
      </div>
    `;
    chatContainer.innerHTML = welcomeHTML;
  }

  // Initialize with welcome message if empty
  if (chatContainer.children.length === 0) {
    addWelcomeMessage();
  }
});
