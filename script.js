 // الأسئلة المضمنة في الكود
 const questions = [
    {
        question: "ما هي عاصمة المملكة العربية السعودية؟",
        answers: ["الرياض", "جدة", "مكة المكرمة", "الدمام"],
        correct: 0
    },
    {
        question: "كم عدد أيام الأسبوع؟",
        answers: ["5 أيام", "6 أيام", "7 أيام", "8 أيام"],
        correct: 2
    },
    {
        question: "ما هو الكوكب الأحمر في نظامنا الشمسي؟",
        answers: ["الزهرة", "المريخ", "المشتري", "زحل"],
        correct: 1
    },
    {
        question: "ما هي لغة البرمجة المستخدمة في هذه اللعبة؟",
        answers: ["بايثون", "جافا", "جافا سكريبت", "سي++"],
        correct: 2
    },
    {
        question: "ما هو أصغر عدد أولي؟",
        answers: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        question: "ما هي عاصمة مصر؟",
        answers: ["الإسكندرية", "القاهرة", "الجيزة", "بورسعيد"],
        correct: 1
    },
    {
        question: "كم عدد أحرف اللغة العربية؟",
        answers: ["26", "28", "30", "32"],
        correct: 1
    },
    {
        question: "ما هو الحيوان الذي يسمى سفينة الصحراء؟",
        answers: ["الحصان", "الجمل", "الفيل", "الزرافة"],
        correct: 1
    },
    {
        question: "ما هو أطول نهر في العالم؟",
        answers: ["النيل", "الأمازون", "الميسيسيبي", "الدانوب"],
        correct: 1
    },
    {
        question: "ما هي العملة الرسمية لليابان؟",
        answers: ["الدولار", "اليورو", "الين", "الجنيه"],
        correct: 2
    }
];

// كلمة المرور للحذف
const DELETE_PASSWORD = "00000";

// حالة اللعبة
const gameState = {
    currentScreen: 'main-menu',
    score: 0,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    streak: 0,
    gameQuestions: [],
    leaderboard: JSON.parse(localStorage.getItem('leaderboard')) || [],
    playerName: localStorage.getItem('playerName') || 'لاعب',
    soundEnabled: true,
    selectedTheme: localStorage.getItem('theme') || 'default'
};

// عناصر الواجهة
const elements = {
    screens: {
        'main-menu': document.getElementById('main-menu'),
        'settings-screen': document.getElementById('settings-screen'),
        'quiz-screen': document.getElementById('quiz-screen'),
        'results-screen': document.getElementById('results-screen'),
        'leaderboard-screen': document.getElementById('leaderboard-screen')
    },
    buttons: {
        startGame: document.getElementById('start-game'),
        settings: document.getElementById('settings-btn'),
        leaderboard: document.getElementById('leaderboard-btn'),
        next: document.getElementById('next-btn'),
        quit: document.getElementById('quit-btn'),
        saveScore: document.getElementById('save-score-btn'),
        playAgain: document.getElementById('play-again-btn'),
        settingsBack: document.getElementById('settings-back-btn'),
        resultsBack: document.getElementById('results-back-btn'),
        leaderboardBack: document.getElementById('leaderboard-back-btn'),
        deleteScore: document.getElementById('delete-score-btn'),
        confirmDelete: document.getElementById('confirm-delete-btn'),
        cancelDelete: document.getElementById('cancel-delete-btn')
    },
    quizElements: {
        questionText: document.getElementById('question-text'),
        answersContainer: document.getElementById('answers-container'),
        resultMessage: document.getElementById('result-message'),
        score: document.getElementById('score'),
        questionCount: document.getElementById('question-count'),
        streak: document.getElementById('streak'),
        progressBar: document.getElementById('progress-bar')
    },
    resultsElements: {
        finalScore: document.getElementById('final-score'),
        correctAnswers: document.getElementById('correct-answers'),
        finalProgress: document.getElementById('final-progress'),
        performanceComment: document.getElementById('performance-comment')
    },
    leaderboardElements: {
        leaderboardList: document.getElementById('leaderboard-list'),
        deleteSection: document.getElementById('delete-section'),
        deletePassword: document.getElementById('delete-password')
    },
    audio: {
        correct: document.getElementById('correct-sound'),
        wrong: document.getElementById('wrong-sound'),
        background: document.getElementById('background-music')
    },
    soundToggle: document.getElementById('sound-toggle'),
    themeOptions: document.querySelectorAll('.theme-option')
};

// تهيئة اللعبة
function initGame() {
    loadSettings();
    setupEventListeners();
    updateLeaderboard();
    playBackgroundMusic();
    console.log('تم تهيئة اللعبة بنجاح');
}

// تحميل الإعدادات
function loadSettings() {
    if (localStorage.getItem('soundEnabled') !== null) {
        gameState.soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    }
    updateSoundButton();

    if (localStorage.getItem('theme')) {
        changeTheme(localStorage.getItem('theme'));
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // التنقل بين الشاشات
    elements.buttons.startGame.addEventListener('click', startGame);
    elements.buttons.settings.addEventListener('click', () => showScreen('settings-screen'));
    elements.buttons.leaderboard.addEventListener('click', () => showScreen('leaderboard-screen'));
    elements.buttons.next.addEventListener('click', nextQuestion);
    
    // أزرار الرجوع والخروج
    elements.buttons.quit.addEventListener('click', () => showScreen('main-menu'));
    elements.buttons.settingsBack.addEventListener('click', () => showScreen('main-menu'));
    elements.buttons.resultsBack.addEventListener('click', () => showScreen('main-menu'));
    elements.buttons.leaderboardBack.addEventListener('click', () => showScreen('main-menu'));
    
    // أحداث أخرى
    elements.buttons.saveScore.addEventListener('click', saveScore);
    elements.buttons.playAgain.addEventListener('click', restartGame);
    
    // أحداث الحذف
    elements.buttons.deleteScore.addEventListener('click', showDeleteSection);
    elements.buttons.confirmDelete.addEventListener('click', confirmDeleteScore);
    elements.buttons.cancelDelete.addEventListener('click', hideDeleteSection);
    
    // تغيير المظهر
    elements.themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            changeTheme(theme);
        });
    });
    
    // التحكم في الصوت
    elements.soundToggle.addEventListener('click', toggleSound);
    
    console.log('تم إعداد مستمعي الأحداث بنجاح');
}

// عرض قسم الحذف
function showDeleteSection() {
    if (gameState.leaderboard.length === 0) {
        alert('لا توجد نتائج مسجلة للحذف');
        return;
    }
    elements.leaderboardElements.deleteSection.style.display = 'block';
}

// إخفاء قسم الحذف
function hideDeleteSection() {
    elements.leaderboardElements.deleteSection.style.display = 'none';
    elements.leaderboardElements.deletePassword.value = '';
}

// تأكيد حذف النتيجة
function confirmDeleteScore() {
    const password = elements.leaderboardElements.deletePassword.value;
    if (password !== DELETE_PASSWORD) {
        alert('كلمة المرور غير صحيحية ');
        return;
    }

    const playerName = prompt('أدخل اسم اللاعب الذي تريد حذف نتيجته:');
    if (playerName && playerName.trim() !== '') {
        const index = gameState.leaderboard.findIndex(item => 
            item.name.toLowerCase() === playerName.toLowerCase());
        
        if (index !== -1) {
            deleteScore(index);
        } else {
            alert('لا توجد نتيجة مسجلة لهذا اللاعب');
        }
    }
    hideDeleteSection();
}

// حذف النتيجة من القائمة
function deleteScore(index) {
    if (confirm(`هل أنت متأكد من حذف نتيجة ${gameState.leaderboard[index].name}؟`)) {
        gameState.leaderboard.splice(index, 1);
        localStorage.setItem('leaderboard', JSON.stringify(gameState.leaderboard));
        updateLeaderboard();
        alert('تم حذف النتيجة بنجاح');
    }
}

// تغيير الشاشة المعروضة
function showScreen(screenId) {
    console.log('محاولة عرض الشاشة:', screenId);
    
    // إخفاء جميع الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // إظهار الشاشة المطلوبة
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
        console.log('تم عرض الشاشة بنجاح:', screenId);
        
        // إيقاف الموسيقى إذا عدنا للقائمة الرئيسية
        if (screenId === 'main-menu') {
            stopBackgroundMusic();
        }
        
        // تحديث قائمة المتصدرين عند عرضها
        if (screenId === 'leaderboard-screen') {
            updateLeaderboard();
        }
    } else {
        console.error('لم يتم العثور على الشاشة:', screenId);
    }
}

// بدء اللعبة
function startGame() {
    gameState.score = 0;
    gameState.currentQuestionIndex = 0;
    gameState.correctAnswers = 0;
    gameState.streak = 0;
    
    gameState.gameQuestions = [...questions];
    shuffleArray(gameState.gameQuestions);
    
    showScreen('quiz-screen');
    showQuestion();
}

// عرض السؤال الحالي
function showQuestion() {
    if (gameState.currentQuestionIndex >= gameState.gameQuestions.length) {
        endGame();
        return;
    }
    
    const question = gameState.gameQuestions[gameState.currentQuestionIndex];
    elements.quizElements.questionText.textContent = question.question;
    elements.quizElements.answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('div');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = answer;
        answerBtn.dataset.correct = index === question.correct;
        answerBtn.addEventListener('click', () => selectAnswer(answerBtn));
        elements.quizElements.answersContainer.appendChild(answerBtn);
    });
    
    elements.quizElements.questionCount.textContent = `${gameState.currentQuestionIndex + 1}/${gameState.gameQuestions.length}`;
    elements.quizElements.progressBar.style.width = `${(gameState.currentQuestionIndex / gameState.gameQuestions.length) * 100}%`;
    elements.quizElements.score.textContent = gameState.score;
    elements.quizElements.streak.textContent = gameState.streak;
    elements.quizElements.resultMessage.textContent = '';
    elements.buttons.next.disabled = true;
}

// اختيار إجابة
function selectAnswer(selectedBtn) {
    if (selectedBtn.classList.contains('selected')) return;
    selectedBtn.classList.add('selected');
    
    const isCorrect = selectedBtn.dataset.correct === 'true';
    const answerBtns = elements.quizElements.answersContainer.querySelectorAll('.answer-btn');
    
    answerBtns.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        } else if (btn === selectedBtn && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    if (gameState.soundEnabled) {
        if (isCorrect) {
            elements.audio.correct.currentTime = 0;
            elements.audio.correct.play().catch(e => console.log("Error playing sound:", e));
        } else {
            elements.audio.wrong.currentTime = 0;
            elements.audio.wrong.play().catch(e => console.log("Error playing sound:", e));
        }
    }
    
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.streak++;
        const points = 10 * Math.min(gameState.streak, 5);
        gameState.score += points;
        elements.quizElements.resultMessage.textContent = `إجابة صحيحة! +${points} نقطة`;
        elements.quizElements.resultMessage.style.color = '#4CAF50';
    } else {
        gameState.streak = 0;
        elements.quizElements.resultMessage.textContent = 'إجابة خاطئة!';
        elements.quizElements.resultMessage.style.color = '#f44336';
    }
    
    elements.quizElements.score.textContent = gameState.score;
    elements.quizElements.streak.textContent = gameState.streak;
    elements.buttons.next.disabled = false;
}

// الانتقال إلى السؤال التالي
function nextQuestion() {
    gameState.currentQuestionIndex++;
    showQuestion();
}

// انتهاء اللعبة
function endGame() {
    showScreen('results-screen');
    
    elements.resultsElements.finalScore.textContent = gameState.score;
    elements.resultsElements.correctAnswers.textContent = `${gameState.correctAnswers}/${gameState.gameQuestions.length}`;
    
    const percentage = (gameState.correctAnswers / gameState.gameQuestions.length) * 100;
    elements.resultsElements.finalProgress.style.width = `${percentage}%`;
    
    let comment = '';
    if (percentage >= 90) comment = 'أداء رائع! أنت خبير في هذا المجال!';
    else if (percentage >= 70) comment = 'عمل جيد! لديك معرفة قوية.';
    else if (percentage >= 50) comment = 'ليس سيئاً! يمكنك التحسن بالممارسة.';
    else comment = 'حاول مرة أخرى! الممارسة تصنع الفرق.';
    
    elements.resultsElements.performanceComment.textContent = comment;
}

// إعادة اللعبة
function restartGame() {
    startGame();
}

// حفظ النتيجة
function saveScore() {
    const playerName = prompt('أدخل اسمك لحفظ النتيجة:', gameState.playerName);
    
    if (playerName && playerName.trim() !== '') {
        gameState.playerName = playerName.trim();
        localStorage.setItem('playerName', gameState.playerName);
        
        const scoreEntry = {
            name: gameState.playerName,
            score: gameState.score,
            correct: gameState.correctAnswers,
            total: gameState.gameQuestions.length,
            date: new Date().toLocaleDateString()
        };
        
        gameState.leaderboard.push(scoreEntry);
        gameState.leaderboard.sort((a, b) => b.score - a.score);
        gameState.leaderboard = gameState.leaderboard.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(gameState.leaderboard));
        
        alert('تم حفظ نتيجتك بنجاح!');
        updateLeaderboard();
        showScreen('leaderboard-screen');
    }
}

// تحديث قائمة المتصدرين
function updateLeaderboard() {
    elements.leaderboardElements.leaderboardList.innerHTML = '';
    
    if (gameState.leaderboard.length === 0) {
        elements.leaderboardElements.leaderboardList.innerHTML = '<p>لا توجد نتائج مسجلة بعد</p>';
        return;
    }
    
    gameState.leaderboard.forEach((entry, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'leaderboard-item';
        scoreItem.dataset.index = index;
        scoreItem.style.padding = '10px';
        scoreItem.style.borderBottom = '1px solid #444';
        scoreItem.style.position = 'relative';
        
        if (entry.name === gameState.playerName) {
            scoreItem.style.fontWeight = 'bold';
            scoreItem.style.color = 'var(--primary-color)';
        }
        
        scoreItem.innerHTML = `
            <strong>${index + 1}. ${entry.name}</strong>
            <div>النقاط: ${entry.score} (${entry.correct}/${entry.total})</div>
            <small>${entry.date}</small>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
        
        elements.leaderboardElements.leaderboardList.appendChild(scoreItem);
    });
    
    // إضافة مستمعي الأحداث لأزرار الحذف
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const password = prompt('أدخل كلمة المرور ):');
            if (password === DELETE_PASSWORD) {
                const index = parseInt(this.dataset.index);
                deleteScore(index);
            } else {
                alert('كلمة المرور غير صحيحة');
            }
        });
    });
}

// تغيير المظهر
function changeTheme(theme) {
    gameState.selectedTheme = theme;
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    
    elements.themeOptions.forEach(option => {
        option.classList.toggle('selected', option.dataset.theme === theme);
    });
}

// تبديل الصوت
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    localStorage.setItem('soundEnabled', gameState.soundEnabled);
    updateSoundButton();
    
    if (gameState.soundEnabled) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
}

// تشغيل موسيقى الخلفية
function playBackgroundMusic() {
    if (gameState.soundEnabled) {
        elements.audio.background.volume = 0.3;
        elements.audio.background.play().catch(e => console.log('لا يمكن تشغيل الصوت:', e));
    }
}

// إيقاف موسيقى الخلفية
function stopBackgroundMusic() {
    elements.audio.background.pause();
}

// تحديث زر الصوت
function updateSoundButton() {
    if (gameState.soundEnabled) {
        elements.soundToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        `;
    } else {
        elements.soundToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
        `;
    }
}

// دالة لخلط العناصر في مصفوفة
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initGame, 100);
});
