// Section Names Mapping
const sectionNames = {
    1: "კარდიოლოგია",
    2: "სისხილძარღვთა დაავადებები",
    3: "პულმონოლოგია",
    4: "გასტროენტეროლოგია",
    5: "ნეფროლოგია",
    6: "ჰემატოლოგია",
    7: "ენდოკრინოლოგია",
    8: "რევმატოლოგია",
    9: "ინფექციური",
    10: "ნეონატოლოგია",
    11: "გინეკოლოგია"
};

// Section 4 Subsection Names
const subsectionNames = {
    1: "პანკრეასი",
    2: "ნივთიერებათა ცვლა",
    3: "საყლაპავი",
    4: "ნაღვლის ბუშტი",
    5: "ღვიწლი",
    6: "თორმეტგოჯა",
    7: "კუჭი",
    8: "ნაწილავები"
};

// File name mapping for sections
const sectionFileNames = {
    1: "კარდიოლოგია.js",
    2: "სისხილძარღვთა დაავადებები.js",
    3: "პულმონოლოგია.js",
    5: "ნეფროლოგია.js",
    6: "ჰემატოლოგია.js",
    7: "ენდოკრინოლოგია.js",
    8: "რევმატოლოგია.js",
    9: "ინფექციური.js",
    10: "ნეონატოლოგია.js",
    11: "გინეკოლოგია.js"
};

// File name mapping for section 4 subsections
const subsectionFileNames = {
    1: "პანკრეასი.js",
    2: "ნივთიერებათა ცვლა.js",
    3: "საყლაპავი.js",
    4: "ნაღვლის ბუშტი.js",
    5: "ღვიწლი.js",
    6: "თორმეტგოჯა.js",
    7: "კუჭი.js",
    8: "ნაწილავები.js"
};

// Application State
const state = {
    selectedSections: new Set(),
    selectedSubsections: new Set(),
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    darkMode: false
};

// DOM Elements
const selectionScreen = document.getElementById('selectionScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');
const sectionButtons = document.getElementById('sectionButtons');
const subsectionButtons = document.getElementById('subsectionButtons');
const selectAllBtn = document.getElementById('selectAllBtn');
const startBtn = document.getElementById('startBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const questionContainer = document.getElementById('questionContainer');
const questionCounter = document.getElementById('questionCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const correctCount = document.getElementById('correctCount');
const incorrectCount = document.getElementById('incorrectCount');
const restartBtn = document.getElementById('restartBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSections();
    setupEventListeners();
    loadDarkMode();
});

// Initialize section buttons
function initializeSections() {
    // Create buttons for sections 1-3, 5-11
    const sections = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11];
    
    sections.forEach(sectionNum => {
        const btn = document.createElement('button');
        btn.className = 'section-btn';
        btn.textContent = sectionNames[sectionNum];
        btn.dataset.section = sectionNum;
        btn.addEventListener('click', () => toggleSection(sectionNum));
        sectionButtons.appendChild(btn);
    });
    
    // Create 8 subsection buttons for section 4
    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('button');
        btn.className = 'subsection-btn';
        btn.textContent = subsectionNames[i];
        btn.dataset.subsection = i;
        btn.addEventListener('click', () => toggleSubsection(i));
        subsectionButtons.appendChild(btn);
    }
}

// Setup event listeners
function setupEventListeners() {
    selectAllBtn.addEventListener('click', selectAllSections);
    startBtn.addEventListener('click', startTest);
    darkModeBtn.addEventListener('click', toggleDarkMode);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    finishBtn.addEventListener('click', finishTest);
    restartBtn.addEventListener('click', restart);
}

// Toggle section selection
function toggleSection(sectionNum) {
    if (state.selectedSections.has(sectionNum)) {
        state.selectedSections.delete(sectionNum);
    } else {
        state.selectedSections.add(sectionNum);
    }
    updateSectionButton(sectionNum);
    updateStartButton();
}

// Toggle subsection selection
function toggleSubsection(subsectionNum) {
    if (state.selectedSubsections.has(subsectionNum)) {
        state.selectedSubsections.delete(subsectionNum);
    } else {
        state.selectedSubsections.add(subsectionNum);
    }
    updateSubsectionButton(subsectionNum);
    updateStartButton();
}

// Update section button appearance
function updateSectionButton(sectionNum) {
    const btn = document.querySelector(`[data-section="${sectionNum}"]`);
    if (btn) {
        if (state.selectedSections.has(sectionNum)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    }
}

// Update subsection button appearance
function updateSubsectionButton(subsectionNum) {
    const btn = document.querySelector(`[data-subsection="${subsectionNum}"]`);
    if (btn) {
        if (state.selectedSubsections.has(subsectionNum)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    }
}

// Select all sections
function selectAllSections() {
    // Select all regular sections (1-3, 5-11)
    const sections = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11];
    sections.forEach(sectionNum => {
        state.selectedSections.add(sectionNum);
        updateSectionButton(sectionNum);
    });
    
    // Select all subsections of section 4
    for (let i = 1; i <= 8; i++) {
        state.selectedSubsections.add(i);
        updateSubsectionButton(i);
    }
    
    updateStartButton();
}

// Update start button state
function updateStartButton() {
    const hasSelection = state.selectedSections.size > 0 || state.selectedSubsections.size > 0;
    startBtn.disabled = !hasSelection;
}

// Start test
async function startTest() {
    try {
        // Load questions from selected sections
        state.questions = [];
        
        // Load questions from regular sections
        for (const sectionNum of state.selectedSections) {
            const filename = sectionFileNames[sectionNum];
            if (filename) {
                const questions = await loadQuestions(filename);
                state.questions.push(...questions);
            }
        }
        
        // Load questions from section 4 subsections
        for (const subsectionNum of state.selectedSubsections) {
            const filename = subsectionFileNames[subsectionNum];
            if (filename) {
                const questions = await loadQuestions(filename);
                state.questions.push(...questions);
            }
        }
        
        // Shuffle questions
        shuffleArray(state.questions);
        
        // Initialize answers object
        state.answers = {};
        state.currentQuestionIndex = 0;
        
        // Show test screen
        selectionScreen.classList.remove('active');
        testScreen.classList.add('active');
        
        // Display first question
        displayQuestion();
    } catch (error) {
        console.error('Error starting test:', error);
        alert('შეცდომა ტესტის დაწყებისას. გთხოვთ, შეამოწმოთ ფაილები.');
    }
}

// Load questions from JS/JSON file
async function loadQuestions(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        const text = await response.text();
        
        // Parse JSON - .js files contain JSON arrays directly
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // If direct parsing fails, try to extract JSON array from the text
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                data = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Could not parse JSON from file');
            }
        }
        
        // Handle both array and object with questions property
        if (Array.isArray(data)) {
            return data;
        } else if (data.questions && Array.isArray(data.questions)) {
            return data.questions;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Display current question
function displayQuestion() {
    if (state.questions.length === 0) {
        finishTest();
        return;
    }
    
    const question = state.questions[state.currentQuestionIndex];
    const questionNum = state.currentQuestionIndex + 1;
    const totalQuestions = state.questions.length;
    
    // Update counter
    questionCounter.textContent = `კითხვა ${questionNum} / ${totalQuestions}`;
    
    // Display question
    questionContainer.innerHTML = `
        <div class="question-text">${question.question}</div>
        <div class="options-container" id="optionsContainer"></div>
    `;
    
    const optionsContainer = document.getElementById('optionsContainer');
    const userAnswer = state.answers[state.currentQuestionIndex];
    const isAnswered = userAnswer !== undefined;
    
    // Display options
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.dataset.option = option;
        
        if (isAnswered) {
            btn.classList.add('answered');
            if (option === question.correct_answer) {
                btn.classList.add('correct');
            } else if (option === userAnswer && option !== question.correct_answer) {
                btn.classList.add('incorrect');
            }
        } else {
            btn.addEventListener('click', () => selectAnswer(option));
        }
        
        optionsContainer.appendChild(btn);
    });
    
    // Update navigation buttons
    prevBtn.disabled = state.currentQuestionIndex === 0;
    nextBtn.disabled = state.currentQuestionIndex === state.questions.length - 1;
}

// Select answer
function selectAnswer(selectedOption) {
    state.answers[state.currentQuestionIndex] = selectedOption;
    displayQuestion(); // Refresh to show correct/incorrect colors
}

// Show previous question
function showPreviousQuestion() {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        displayQuestion();
    }
}

// Show next question
function showNextQuestion() {
    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        displayQuestion();
    }
}

// Finish test
function finishTest() {
    // Calculate results
    let correct = 0;
    let incorrect = 0;
    
    state.questions.forEach((question, index) => {
        const userAnswer = state.answers[index];
        if (userAnswer === question.correct_answer) {
            correct++;
        } else if (userAnswer !== undefined) {
            incorrect++;
        }
    });
    
    // Show results
    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    
    // Switch to results screen
    testScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

// Restart
function restart() {
    // Reset state
    state.selectedSections.clear();
    state.selectedSubsections.clear();
    state.questions = [];
    state.currentQuestionIndex = 0;
    state.answers = {};
    
    // Reset UI
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('.subsection-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    updateStartButton();
    
    // Switch to selection screen
    resultsScreen.classList.remove('active');
    selectionScreen.classList.add('active');
}

// Dark mode functions
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeBtn.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        darkModeBtn.textContent = '🌙';
    }
    localStorage.setItem('darkMode', state.darkMode);
}

function loadDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        state.darkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeBtn.textContent = '☀️';
    }
}
