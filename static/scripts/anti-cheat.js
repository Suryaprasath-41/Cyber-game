// Browser Protection & Anti-Cheat
if (window.location.pathname.startsWith('/game')) {
  document.addEventListener('keydown', function(e) {
    // Disable F5 and Ctrl+R
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
      e.preventDefault();
    }
    // Disable Alt+Left (Back)
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
    }
    // Disable Backspace navigation (if not in an input field)
    if (e.key === 'Backspace') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
  });

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave the competition? Your progress has been auto-saved.';
  });

  // Disable right click
  document.addEventListener('contextmenu', event => event.preventDefault());
}

// Auto-Save Integration
window.autoSaveProgress = function(currentLevel, questionNumber, correctAnswers, wrongAnswers, percentage, currentScore, remainingTime) {
  fetch('/game/autosave', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentLevel,
      questionNumber,
      correctAnswers,
      wrongAnswers,
      percentage,
      currentScore,
      remainingTime
    })
  }).then(res => res.json()).then(data => {
    console.log("Auto-saved:", data);
  }).catch(err => {
    console.error("Auto-save failed:", err);
  });
};

window.submitFinalScore = function() {
  fetch('/game/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(data => {
    window.location.href = '/game/mission-complete';
  });
};
