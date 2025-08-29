// Application data
const appData = {
    lessons: [
        {
            id: 1,
            title: "기본 비교급 (-er)",
            description: "한 글자나 두 글자 형용사에 -er를 붙여요",
            progress: 75,
            completed: false,
            examples: [
                {"word": "tall", "comparative": "taller", "example": "John is taller than Mike."},
                {"word": "fast", "comparative": "faster", "example": "Cars are faster than bikes."},
                {"word": "big", "comparative": "bigger", "example": "Elephants are bigger than cats."},
                {"word": "small", "comparative": "smaller", "example": "Mice are smaller than dogs."},
                {"word": "old", "comparative": "older", "example": "My dad is older than my mom."}
            ]
        },
        {
            id: 2, 
            title: "More + 형용사",
            description: "긴 형용사 앞에 more를 붙여요",
            progress: 40,
            completed: false,
            examples: [
                {"word": "beautiful", "comparative": "more beautiful", "example": "Roses are more beautiful than weeds."},
                {"word": "interesting", "comparative": "more interesting", "example": "Books are more interesting than homework."},
                {"word": "expensive", "comparative": "more expensive", "example": "Cars are more expensive than toys."},
                {"word": "comfortable", "comparative": "more comfortable", "example": "Beds are more comfortable than chairs."}
            ]
        },
        {
            id: 3,
            title: "불규칙 비교급", 
            description: "특별한 형태로 변하는 형용사들이에요",
            progress: 20,
            completed: false,
            examples: [
                {"word": "good", "comparative": "better", "example": "Pizza is better than vegetables."},
                {"word": "bad", "comparative": "worse", "example": "Rain is worse than sunshine."},
                {"word": "far", "comparative": "farther", "example": "School is farther than the park."},
                {"word": "many", "comparative": "more", "example": "Dogs have more legs than birds."}
            ]
        }
    ],
    student: {
        name: "학습자",
        level: 3,
        currentXP: 850,
        nextLevelXP: 1000,
        totalPoints: 2340,
        badges: ["First Steps", "Word Master", "Quiz Champion"],
        streak: 5,
        completedLessons: 2,
        totalLessons: 3
    },
    badges: [
        {"name": "First Steps", "description": "첫 번째 레슨 완료", "icon": "🎯", "earned": true},
        {"name": "Word Master", "description": "50개 단어 학습", "icon": "📚", "earned": true}, 
        {"name": "Quiz Champion", "description": "퀴즈 5개 연속 정답", "icon": "🏆", "earned": true},
        {"name": "Streak Hero", "description": "7일 연속 학습", "icon": "🔥", "earned": false},
        {"name": "Grammar Guru", "description": "모든 레슨 완료", "icon": "⭐", "earned": false}
    ],
    quizQuestions: [
        {
            question: "다음 중 올바른 비교급은?",
            options: ["more tall", "taller", "tallest", "tall-er"],
            correct: 1,
            word: "tall"
        },
        {
            question: "'beautiful'의 비교급은?",
            options: ["beautifuler", "more beautiful", "most beautiful", "beautifler"], 
            correct: 1,
            word: "beautiful"
        },
        {
            question: "'good'의 비교급은?",
            options: ["gooder", "more good", "better", "goodest"],
            correct: 2,
            word: "good"
        },
        {
            question: "빈칸에 들어갈 말은? 'Cats are ____ than dogs.'",
            options: ["smaller", "more small", "smallest", "small"],
            correct: 0,
            word: "small"
        },
        {
            question: "'expensive'의 비교급은?",
            options: ["expensiver", "more expensive", "most expensive", "expensive-er"],
            correct: 1,
            word: "expensive"
        }
    ]
};

// Application state
let gameState = {
    currentQuiz: 0,
    quizScore: 0,
    quizStarted: false,
    matchingGame: {
        selectedItems: [],
        matches: [],
        score: 0
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    renderLessons();
    renderBadges();
    initializeEventListeners();
});

// Initialize circular progress
function initializeProgress() {
    const circle = document.getElementById('progress-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const completedLessons = appData.student.completedLessons;
    const totalLessons = appData.student.totalLessons;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // Animate progress
    setTimeout(() => {
        const offset = circumference - (progressPercent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }, 500);
}

// Render lessons
function renderLessons() {
    const lessonsGrid = document.getElementById('lessons-grid');
    lessonsGrid.innerHTML = '';
    
    appData.lessons.forEach((lesson, index) => {
        const bgClass = `bg-${(index % 3) + 1}`;
        const lessonCard = document.createElement('div');
        lessonCard.className = `card lesson-card ${bgClass}`;
        lessonCard.setAttribute('data-lesson-id', lesson.id);
        
        lessonCard.innerHTML = `
            <div class="lesson-header">
                <h3 class="lesson-title">${lesson.title}</h3>
                <div class="lesson-status">
                    ${lesson.completed ? '✅' : '📖'} 
                    ${lesson.progress}%
                </div>
            </div>
            <p class="lesson-description">${lesson.description}</p>
            <div class="lesson-progress">
                <div class="progress-label-text">${lesson.progress}% 완료</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${lesson.progress}%"></div>
                </div>
            </div>
            <div class="lesson-examples">
                <div class="example-count">${lesson.examples.length}개 예시</div>
            </div>
        `;
        
        lessonsGrid.appendChild(lessonCard);
    });
}

// Render badges
function renderBadges() {
    const badgesGrid = document.getElementById('badges-grid');
    badgesGrid.innerHTML = '';
    
    appData.badges.forEach(badge => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${badge.earned ? 'earned' : 'not-earned'}`;
        
        badgeCard.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
        `;
        
        badgesGrid.appendChild(badgeCard);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Lesson clicks
    document.getElementById('lessons-grid').addEventListener('click', function(e) {
        const lessonCard = e.target.closest('.lesson-card');
        if (lessonCard) {
            const lessonId = parseInt(lessonCard.getAttribute('data-lesson-id'));
            openLessonModal(lessonId);
        }
    });
    
    // Game clicks
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            openGameModal(gameType);
        });
    });
    
    // Quiz functionality
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    
    // Modal close buttons
    document.getElementById('close-game').addEventListener('click', closeGameModal);
    document.getElementById('close-lesson').addEventListener('click', closeLessonModal);
    
    // Close modals when clicking outside
    document.getElementById('game-modal').addEventListener('click', function(e) {
        if (e.target === this) closeGameModal();
    });
    document.getElementById('lesson-modal').addEventListener('click', function(e) {
        if (e.target === this) closeLessonModal();
    });
}

// Quiz functions
function startQuiz() {
    gameState.currentQuiz = 0;
    gameState.quizScore = 0;
    gameState.quizStarted = true;
    
    document.getElementById('start-quiz').classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    if (gameState.currentQuiz >= appData.quizQuestions.length) {
        endQuiz();
        return;
    }
    
    const question = appData.quizQuestions[gameState.currentQuiz];
    document.getElementById('current-question').textContent = gameState.currentQuiz + 1;
    document.getElementById('total-questions').textContent = appData.quizQuestions.length;
    document.getElementById('quiz-score').textContent = gameState.quizScore;
    document.getElementById('quiz-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('next-question').classList.add('hidden');
}

function selectOption(selectedIndex) {
    const question = appData.quizQuestions[gameState.currentQuiz];
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show correct/incorrect feedback
    options[selectedIndex].classList.add(selectedIndex === question.correct ? 'correct' : 'incorrect');
    options[question.correct].classList.add('correct');
    
    if (selectedIndex === question.correct) {
        gameState.quizScore += 20;
        showFeedback('정답입니다! 🎉', 'success');
        addPoints(20);
    } else {
        showFeedback('아쉬워요. 다시 한 번 생각해보세요! 🤔', 'error');
    }
    
    document.getElementById('quiz-score').textContent = gameState.quizScore;
    document.getElementById('next-question').classList.remove('hidden');
}

function nextQuestion() {
    gameState.currentQuiz++;
    showQuestion();
}

function endQuiz() {
    const percentage = (gameState.quizScore / (appData.quizQuestions.length * 20)) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = `완벽해요! ${gameState.quizScore}점 획득! 🏆`;
        addPoints(50); // Bonus points
    } else if (percentage >= 60) {
        message = `잘했어요! ${gameState.quizScore}점 획득! 👏`;
    } else {
        message = `조금 더 공부하면 더 잘할 수 있을 거예요! ${gameState.quizScore}점 📚`;
    }
    
    document.getElementById('quiz-question').textContent = message;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('next-question').classList.add('hidden');
    document.getElementById('start-quiz').classList.remove('hidden');
    document.getElementById('start-quiz').textContent = '다시 도전하기';
    
    gameState.quizStarted = false;
}

// Game modal functions
function openGameModal(gameType) {
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('game-title');
    const content = document.getElementById('game-content');
    
    switch(gameType) {
        case 'matching':
            title.textContent = '🎯 매칭 게임';
            content.innerHTML = createMatchingGame();
            break;
        case 'fill-blank':
            title.textContent = '✏️ 문장 완성 게임';
            content.innerHTML = createFillBlankGame();
            break;
        case 'picture-compare':
            title.textContent = '🖼️ 그림 비교 게임';
            content.innerHTML = createPictureCompareGame();
            break;
    }
    
    modal.classList.remove('hidden');
}

function closeGameModal() {
    document.getElementById('game-modal').classList.add('hidden');
    resetGameState();
}

function openLessonModal(lessonId) {
    const lesson = appData.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const modal = document.getElementById('lesson-modal');
    const title = document.getElementById('lesson-title');
    const content = document.getElementById('lesson-content');
    
    title.textContent = lesson.title;
    content.innerHTML = createLessonContent(lesson);
    
    modal.classList.remove('hidden');
}

function closeLessonModal() {
    document.getElementById('lesson-modal').classList.add('hidden');
}

// Create game content
function createMatchingGame() {
    const words = ['tall', 'beautiful', 'good', 'fast', 'big'];
    const comparatives = ['taller', 'more beautiful', 'better', 'faster', 'bigger'];
    
    // Shuffle the comparatives for difficulty
    const shuffledComparatives = [...comparatives].sort(() => Math.random() - 0.5);
    
    let html = `
        <div class="matching-game">
            <div class="matching-column">
                <h4>형용사</h4>
                ${words.map((word, index) => 
                    `<div class="matching-item" data-type="word" data-value="${word}" data-index="${index}">${word}</div>`
                ).join('')}
            </div>
            <div class="matching-column">
                <h4>비교급</h4>
                ${shuffledComparatives.map((comp, index) => 
                    `<div class="matching-item" data-type="comparative" data-value="${comp}">${comp}</div>`
                ).join('')}
            </div>
        </div>
        <div id="matching-feedback" class="feedback-message"></div>
    `;
    
    setTimeout(() => {
        initMatchingGame();
    }, 100);
    
    return html;
}

function createFillBlankGame() {
    const sentences = [
        { 
            sentence: "Cars are _____ than bikes.", 
            word: "fast", 
            answer: "faster",
            wrong1: "more fast",
            wrong2: "fastest"
        },
        { 
            sentence: "Roses are _____ than weeds.", 
            word: "beautiful", 
            answer: "more beautiful",
            wrong1: "beautifuler",
            wrong2: "most beautiful"
        },
        { 
            sentence: "Pizza is _____ than vegetables.", 
            word: "good", 
            answer: "better",
            wrong1: "gooder",
            wrong2: "more good"
        }
    ];
    
    let html = '<div class="fill-blank-game">';
    sentences.forEach((item, index) => {
        // Randomize the order of options
        const options = [
            { text: item.answer, correct: true },
            { text: item.wrong1, correct: false },
            { text: item.wrong2, correct: false }
        ].sort(() => Math.random() - 0.5);
        
        html += `
            <div class="fill-blank-item mb-16">
                <p class="font-bold">${item.sentence}</p>
                <div class="quiz-options">
                    ${options.map(option => 
                        `<div class="quiz-option" onclick="checkFillBlank(this, '${item.answer}', ${option.correct})">${option.text}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

function createPictureCompareGame() {
    return `
        <div class="picture-compare-game text-center">
            <p class="mb-16">그림을 보고 올바른 비교 문장을 선택하세요!</p>
            <div class="picture-scenario mb-16">
                <p class="font-bold">🐘 vs 🐱</p>
                <p>코끼리와 고양이를 비교해보세요!</p>
            </div>
            <div class="quiz-options">
                <div class="quiz-option" onclick="checkPictureAnswer(this, true)">Elephants are bigger than cats.</div>
                <div class="quiz-option" onclick="checkPictureAnswer(this, false)">Elephants are more big than cats.</div>
                <div class="quiz-option" onclick="checkPictureAnswer(this, false)">Elephants are smaller than cats.</div>
            </div>
            <div id="picture-feedback" class="feedback-message"></div>
        </div>
    `;
}

function createLessonContent(lesson) {
    let html = `
        <div class="lesson-content">
            <p class="mb-16">${lesson.description}</p>
            <h4>예시들:</h4>
    `;
    
    lesson.examples.forEach(example => {
        html += `
            <div class="example-item">
                <div>
                    <span class="example-word">${example.word}</span>
                    <span>→</span>
                    <span class="example-comparative">${example.comparative}</span>
                </div>
                <div class="example-sentence">${example.example}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Game logic
function initMatchingGame() {
    gameState.matchingGame.selectedItems = [];
    gameState.matchingGame.matches = [];
    gameState.matchingGame.score = 0;
    
    const matchingItems = document.querySelectorAll('.matching-item');
    matchingItems.forEach(item => {
        item.addEventListener('click', function() {
            selectMatchingItem(this);
        });
    });
}

function selectMatchingItem(item) {
    if (item.classList.contains('matched')) return;
    
    // Deselect previously selected items of the same type
    const type = item.getAttribute('data-type');
    document.querySelectorAll(`.matching-item[data-type="${type}"].selected`).forEach(el => {
        el.classList.remove('selected');
    });
    
    item.classList.add('selected');
    
    // Check if we have both types selected
    const selectedWord = document.querySelector('.matching-item[data-type="word"].selected');
    const selectedComparative = document.querySelector('.matching-item[data-type="comparative"].selected');
    
    if (selectedWord && selectedComparative) {
        checkMatch(selectedWord, selectedComparative);
    }
}

function checkMatch(wordItem, comparativeItem) {
    const word = wordItem.getAttribute('data-value');
    const comparative = comparativeItem.getAttribute('data-value');
    
    // Define correct matches
    const matches = {
        'tall': 'taller',
        'beautiful': 'more beautiful',
        'good': 'better',
        'fast': 'faster',
        'big': 'bigger'
    };
    
    if (matches[word] === comparative) {
        // Correct match
        wordItem.classList.remove('selected');
        comparativeItem.classList.remove('selected');
        wordItem.classList.add('matched');
        comparativeItem.classList.add('matched');
        
        gameState.matchingGame.score += 20;
        showMatchingFeedback('정답입니다! 🎉', 'success');
        addPoints(20);
        
        // Check if game is complete
        const totalMatches = document.querySelectorAll('.matching-item[data-type="word"]').length;
        const completedMatches = document.querySelectorAll('.matching-item.matched[data-type="word"]').length;
        
        if (completedMatches === totalMatches) {
            setTimeout(() => {
                showMatchingFeedback('모든 매칭을 완료했습니다! 축하합니다! 🏆', 'success');
                addPoints(50); // Bonus points
            }, 1000);
        }
    } else {
        // Incorrect match
        setTimeout(() => {
            wordItem.classList.remove('selected');
            comparativeItem.classList.remove('selected');
        }, 1000);
        showMatchingFeedback('다시 한 번 생각해보세요! 🤔', 'error');
    }
}

// Helper functions
function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type} show`;
    feedback.textContent = message;
    
    const quizContent = document.getElementById('quiz-content');
    const existingFeedback = quizContent.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    quizContent.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

function showMatchingFeedback(message, type) {
    const feedback = document.getElementById('matching-feedback');
    feedback.className = `feedback-message ${type} show`;
    feedback.textContent = message;
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

function checkFillBlank(option, answer, isCorrect) {
    const options = option.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (isCorrect) {
        option.classList.add('correct');
        addPoints(15);
    } else {
        option.classList.add('incorrect');
        // Show correct answer
        const correctOption = Array.from(options).find(opt => opt.textContent.includes(answer));
        if (correctOption) correctOption.classList.add('correct');
    }
}

function checkPictureAnswer(option, isCorrect) {
    const options = option.parentNode.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    const feedback = document.getElementById('picture-feedback');
    
    if (isCorrect) {
        option.classList.add('correct');
        feedback.className = 'feedback-message success show';
        feedback.textContent = '정답입니다! 🎉';
        addPoints(25);
    } else {
        option.classList.add('incorrect');
        feedback.className = 'feedback-message error show';
        feedback.textContent = '다시 한 번 생각해보세요! 🤔';
        
        // Show correct answer
        const correctOption = Array.from(options).find(opt => opt.textContent.includes('bigger'));
        if (correctOption) correctOption.classList.add('correct');
    }
}

function addPoints(points) {
    appData.student.totalPoints += points;
    document.querySelector('.points').textContent = `⭐ ${appData.student.totalPoints.toLocaleString()}점`;
    
    // Add visual feedback
    const pointsElement = document.querySelector('.points');
    pointsElement.classList.add('pulse');
    setTimeout(() => pointsElement.classList.remove('pulse'), 500);
}

function resetGameState() {
    gameState.matchingGame = {
        selectedItems: [],
        matches: [],
        score: 0
    };
}