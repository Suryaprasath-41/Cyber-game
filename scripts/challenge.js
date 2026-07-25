document.addEventListener('DOMContentLoaded', () => {
  let sectionId = document.getElementById('levelNum').textContent;
  let currentTimer = null;
  let timeLeft = 60;
  
  const questionContainer = document.getElementById('container');
  const loadingContainer = document.getElementById('loading');
  const lostMessage = document.getElementById('lostMessage');
  const hintContainer = document.getElementById('hint-container');
  const timerDisplay = document.getElementById('timer');
  const scoreDisplay = document.getElementById('score');
  const accuracyDisplay = document.getElementById('accuracy');
  const progressBarFull = document.getElementById('progressBarFull');
  const progressText = document.getElementById('progressText');
  const questionEl = document.getElementById('question');
  const choices = Array.from(document.getElementsByClassName('choice-text'));
  
  let acceptingAnswers = false;
  let currentScore = 0;
  let correctAnswers = 0;
  let totalAnswered = 0;

  function fetchNextQuestion() {
    fetch('/game/api/next-question')
      .then(res => res.json())
      .then(data => {
        if (data.completed) {
          finishSection();
        } else {
          displayQuestion(data);
        }
      })
      .catch(err => console.error(err));
  }

  function displayQuestion(data) {
    loadingContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    hintContainer.style.display = 'none';
    
    progressText.innerText = `Section ${sectionId} - Question ${data.questionNumber}/20`;
    progressBarFull.style.width = `${(data.questionNumber / 20) * 100}%`;
    questionEl.innerText = data.question;
    
    choices.forEach((choice, index) => {
      choice.innerText = data.options[index];
      choice.parentElement.classList.remove('correct', 'incorrect');
    });

    acceptingAnswers = true;
    startTimer();
  }

  function startTimer() {
    clearInterval(currentTimer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    
    currentTimer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(currentTimer);
        if (acceptingAnswers) {
          submitAnswer(null, null); // time expired
        }
      }
    }, 1000);
  }

  choices.forEach((choice) => {
    choice.parentElement.addEventListener('click', (e) => {
      if (!acceptingAnswers) return;
      acceptingAnswers = false;
      const selectedChoice = choice;
      const answer = selectedChoice.innerText;
      submitAnswer(answer, selectedChoice.parentElement);
    });
  });

  function submitAnswer(answer, choiceElement) {
    clearInterval(currentTimer);
    totalAnswered++;

    fetch('/game/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        finishSection();
        return;
      }
      
      if (data.isCorrect) {
        correctAnswers++;
        currentScore += 5; 
        if (choiceElement) choiceElement.classList.add('correct');
        if (window.gameAnimator) window.gameAnimator.pass(180, 120);
      } else {
        if (choiceElement) choiceElement.classList.add('incorrect');
        if (data.hint) {
          hintContainer.innerText = "Hint: " + data.hint;
          hintContainer.style.display = 'block';
        }
        if (window.gameAnimator) window.gameAnimator.fail();
      }

      // Update local HUD
      scoreDisplay.innerText = currentScore;
      accuracyDisplay.innerText = Math.round((correctAnswers / totalAnswered) * 100) + '%';

      setTimeout(() => {
        fetchNextQuestion();
      }, data.isCorrect ? 1000 : 4000); // Wait longer if incorrect to read hint
    })
    .catch(err => console.error(err));
  }

  function finishSection() {
    questionContainer.style.display = 'none';
    loadingContainer.style.display = 'flex';
    loadingContainer.innerHTML = '<h2>Analyzing Operator Performance...</h2>';
    
    fetch('/game/api/section-complete', {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      loadingContainer.style.display = 'none';
      lostMessage.style.display = 'flex'; // The 3D overlay for end of module
      
      document.getElementById('postScore').innerText = `Score: ${data.finalScore} | Accuracy: ${data.percentage.toFixed(0)}%`;
      const msgEl = document.getElementById('message');
      const nextBtn = document.getElementById('nextButton');
      
      if (data.passed) {
        msgEl.innerText = "PHASE COMPLETE";
        msgEl.style.color = "#35ff9e";
        nextBtn.style.display = 'block';
        nextBtn.innerText = sectionId == 4 ? "VIEW MISSION LOG" : "PROCEED TO NEXT PHASE";
        
        nextBtn.onclick = () => {
          if (sectionId == 4) {
            window.location.href = '/game/mission-complete';
          } else {
            // Initiate cinematic transition to next section
            transitionToNextSection(parseInt(sectionId) + 1);
          }
        };
      } else {
        msgEl.innerText = "PHASE FAILED";
        msgEl.style.color = "#ff4d4d";
        document.getElementById('restartButton').style.display = 'block';
        document.getElementById('restartButton').onclick = () => {
          window.location.reload();
        };
      }
    })
    .catch(err => console.error(err));
  }

  function transitionToNextSection(nextId) {
    lostMessage.style.display = 'none';
    loadingContainer.style.display = 'flex';
    loadingContainer.innerHTML = `<h2>Initializing Phase ${nextId}...</h2>`;
    
    // Instead of a full page reload, we fetch the next section page which sets session 
    // and then we reload silently or just reload. Since 3D environment should not blink,
    // actually doing window.location.href will reload the page.
    // To truly avoid reload, we need an API to init the session and then fetch the first question.
    fetch(`/game/api/start-section/${nextId}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
           sectionId = nextId;
           document.getElementById('levelNum').textContent = nextId;
           currentScore = 0;
           correctAnswers = 0;
           totalAnswered = 0;
           scoreDisplay.innerText = 0;
           accuracyDisplay.innerText = "100%";
           fetchNextQuestion();
        } else {
           window.location.href = `/game/section/${nextId}`; // fallback
        }
      });
  }

  // Start
  fetchNextQuestion();
});
