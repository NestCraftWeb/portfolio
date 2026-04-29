document.addEventListener('DOMContentLoaded', () => {
  // Initialize Highlight.js
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }

  const chatForm = document.getElementById('chat-form');
  const promptInput = document.getElementById('prompt-input');
  const chatContainer = document.getElementById('chat-container');

  // Auto-resize textarea
  promptInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // Reset if empty
    if(this.value === '') {
      this.style.height = 'auto';
    }
  });

  // Handle Enter key (Shift+Enter for new line)
  promptInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(this.value.trim() !== '') {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = promptInput.value.trim();
    if (!message) return;

    // 1. Add User Message
    appendMessage('user', message);
    
    // Clear input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    
    // Scroll to bottom
    scrollToBottom();

    // 2. Show Typing Indicator
    const typingId = showTypingIndicator();
    scrollToBottom();

    // 3. Simulate AI Response after delay
    setTimeout(() => {
      removeTypingIndicator(typingId);
      simulateAIResponse(message);
    }, 1500 + Math.random() * 1000);
  });

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
          <i class="fa-regular fa-copy"></i>
          <i class="fa-regular fa-thumbs-up"></i>
          <i class="fa-regular fa-thumbs-down"></i>
        </div>
      `;
    }

    chatContainer.appendChild(msgDiv);
    
    // Trigger animation
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

  function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ai-message`;
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

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function simulateAIResponse(userMessage) {
    const responses = [
      `<p>That's an interesting question about <strong>${escapeHTML(userMessage)}</strong>.</p><p>Here's a quick example to illustrate the concept:</p>
<pre><code class="language-javascript">
const analyze = (query) => {
  console.log("Processing: " + query);
  return { status: "success", confidence: 0.99 };
};
analyze("${escapeHTML(userMessage.substring(0, 15))}...");
</code></pre>`,
      `<p>Based on my training data, I can confirm that approach works perfectly.</p><p>Would you like me to elaborate on the edge cases?</p>`,
      `<p>I have processed your request. Here is the optimized solution.</p>`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    appendMessage('ai', randomResponse, true);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
  }
});
