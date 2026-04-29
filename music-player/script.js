document.addEventListener('DOMContentLoaded', () => {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = playPauseBtn.querySelector('i');
  const vinyl = document.getElementById('vinyl');
  const ambientBg = document.getElementById('ambientBg');
  
  const progressWrap = document.getElementById('progressWrap');
  const progressBar = document.getElementById('progressBar');
  
  let isPlaying = false;
  
  // Audio Context (Mock visualization)
  let audioContext;
  let analyser;
  
  // Since we don't have a real audio file easily accessible without CORS locally, 
  // we will simulate the audio playing and progress visually.
  let progress = 0;
  let duration = 222; // 3:42 in seconds
  let playingInterval;

  function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
      vinyl.classList.add('playing');
      ambientBg.classList.add('playing');
      
      startProgress();
      
      // Initialize mock Web Audio API visually if context doesn't exist attached to input
      if(!audioContext) {
         try {
           audioContext = new (window.AudioContext || window.webkitAudioContext)();
           // In a real app we would link a media element source here
         } catch(e) { }
      }
      
    } else {
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
      vinyl.classList.remove('playing');
      ambientBg.classList.remove('playing');
      
      clearInterval(playingInterval);
    }
  }

  function startProgress() {
    playingInterval = setInterval(() => {
      progress += 1; // Add 1 sec
      if (progress >= duration) {
        progress = 0;
        togglePlay(); // Stop when done
      }
      updateUI();
      mockVisualizer();
    }, 1000); // Every second update progress
  }

  function updateUI() {
    // Update progress bar
    const percentage = (progress / duration) * 100;
    progressBar.style.width = percentage + '%';
    
    // Update time displays roughly
    const mins = Math.floor(progress / 60);
    const secs = Math.floor(progress % 60);
    document.querySelector('.time-current').textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function mockVisualizer() {
    if(isPlaying) {
      // Simulate frequency data changes affecting the ambient background size / blur
      const randomFreq = Math.random() * 0.4 + 1; // 1 to 1.4 scale modifier
      ambientBg.style.transform = `translate(-50%, -50%) scale(${randomFreq})`;
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);

  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    
    progress = clickRatio * duration;
    updateUI();
  });

  // Mock volume click drag logic
  const volumeWrap = document.querySelector('.volume-bar-wrap');
  const volumeBar = document.querySelector('.volume-bar');
  
  volumeWrap.addEventListener('click', (e) => {
    const rect = volumeWrap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const volRatio = clickX / rect.width;
    volumeBar.style.width = (volRatio * 100) + '%';
  });
});
