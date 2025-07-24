





// pro1.js
console.log('pro1.js loaded!');

// ——— Audio setup ———
// 1) Background music that loops:
const bgAudio = new Audio('Recording.mp3');
bgAudio.loop   = true;
bgAudio.volume = 0.5;

// 2) One‑shot game‑over SFX:
const gameOverAudio = new Audio('kid.mp3');
gameOverAudio.loop = false;


window.addEventListener('DOMContentLoaded', () => {
  // ————— Start background audio (with key‑press fallback) —————
  bgAudio.play().catch(() => {
    document.addEventListener('keydown', () => bgAudio.play(), { once: true });
  });

  // ——— Grab your game elements ———
  const ninja     = document.querySelector('.ninja');
  const obstacle  = document.querySelector('.obstacle');
  const gameOver  = document.querySelector('.gameover');
  const scoreCont = document.getElementById('scoreCont');
  const finalScore = document.getElementById('finalScore');
  const designer = document.getElementById('designer');
  
  setTimeout(()=> {
    designer.style.visibility = 'hidden';
  },9000);
  

  
  if (!ninja || !obstacle || !gameOver || !scoreCont) {
    console.error('Missing one of: .ninja, .obstacle, .gameover, #scoreCont');
    return;
  }

  // ——— Ensure CSS positioning is explicit ———
  ninja.style.position    ||= 'absolute';
  ninja.style.left        ||= '200px';
  ninja.style.bottom      ||= '100px';
  obstacle.style.position ||= 'absolute';

  // ——— Game state ———
  let score      = 0;
  let cross      = true;
  let isGameOver = false;

  // ——— Movement handler ———
  document.addEventListener('keydown', e => {
    if (isGameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'Up':
        ninja.classList.add('animateninja');
        setTimeout(() => ninja.classList.remove('animateninja'), 600);
        break;
      case 'ArrowRight':
      case 'Right':
        shiftX(+112);
        break;
      case 'ArrowLeft':
      case 'Left':
        shiftX(-112);
        break;
    }
  });

  function shiftX(delta) {
    let x = parseInt(getComputedStyle(ninja).left, 10);
    if (isNaN(x)) x = 0;
    ninja.style.left = (x + delta) + 'px';
  }

  // ——— Collision & scoring loop ———
  const loop = setInterval(() => {
    if (isGameOver) {
      clearInterval(loop);
      return;
    }

    const nB = parseInt(getComputedStyle(ninja).bottom, 10) || 0;
    const nL = parseInt(getComputedStyle(ninja).left,   10) || 0;
    const oB = parseInt(getComputedStyle(obstacle).bottom,10) || 0;
    const oL = parseInt(getComputedStyle(obstacle).left,  10) || 0;

    const dx = Math.abs(nL - oL),
          dy = Math.abs(nB - oB);

    // **GAME OVER**  
    if (dx < 83 && dy < 52) {
      isGameOver = true;
      clearInterval(loop);
      gameOver.style.visibility = 'visible';
      obstacle.classList.remove('obstacleAni');
      ninja.classList.add('fall');
      
      finalScore.textContent = 'Your Final Score : '+score;
      finalScore.style.visibility = 'visible';
      finalScore.style.fontSize = '40px';

      scoreCont.style.visibility = 'hidden';
      designer.style.visibility = 'hidden';
      
      // stop bg music, play game-over SFX once
      bgAudio.pause();
      if(typeof audio !=='undefined') audio.pause();
      
      gameOverAudio.play();
      
      return;
    }

    // **SCORE**  
    if (dx < 145 && cross) {
      score++;
      scoreCont.textContent = 'Your Score : ' + score;
      cross = false;
      setTimeout(() => cross = true, 1000);

      // slightly speed up the obstacle
      setTimeout(() => {
        let dur = parseFloat(getComputedStyle(obstacle).animationDuration) || 4;
        obstacle.style.animationDuration = Math.max(dur - 0.1, 0.3) + 's';
      }, 500);
    }
  }, 100);
});
