// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  
  // Example button handler
  const button = document.getElementById('clickMe');
  if (button) {
    button.addEventListener('click', () => {
      alert('Hello from JavaScript! 🚀');
    });
  }
});

// Example of console.log for development
console.log('Script.js loaded successfully');