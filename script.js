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
    darkMode: false,
    unansweredMode: false, // Mode for cycling through unanswered questions only
    questionLimit: 100 // Default limit
};

// DOM Elements
const selectionScreen = document.getElementById('selectionScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');
const sectionButtons = document.getElementById('sectionButtons');
const subsectionButtons = document.getElementById('subsectionButtons');
const selectAllBtn = document.getElementById('selectAllBtn');
const startBtn = document.getElementById('startBtn');
const darkModeBtn = document.getElementById('darkModeBtn'); // Test screen btn
const selectionDarkModeBtn = document.getElementById('selectionDarkModeBtn'); // Selection screen btn
const questionContainer = document.getElementById('questionContainer');
const questionCounter = document.getElementById('questionCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const correctCount = document.getElementById('correctCount');
const incorrectCount = document.getElementById('incorrectCount');
const restartBtn = document.getElementById('restartBtn');
const limitToggleContainer = document.getElementById('limitToggleContainer');
const limitQuestionsToggle = document.getElementById('limitQuestionsToggle');
const limitQuestions200Toggle = document.getElementById('limitQuestions200Toggle');
const limitQuestions500Toggle = document.getElementById('limitQuestions500Toggle');
const decreaseLimitBtn = document.getElementById('decreaseLimitBtn');
const increaseLimitBtn = document.getElementById('increaseLimitBtn');
const currentLimitDisplay = document.getElementById('currentLimitDisplay');

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
    startBtn.addEventListener('click', handleStartClick);
    darkModeBtn.addEventListener('click', toggleDarkMode);
    selectionDarkModeBtn.addEventListener('click', toggleDarkMode);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    finishBtn.addEventListener('click', finishTest);
    restartBtn.addEventListener('click', restart);
    setupLimitControls();
}

function setupLimitControls() {
    // Toggles
    limitQuestionsToggle.addEventListener('change', (e) => setLimit(100, e.target.checked));
    limitQuestions200Toggle.addEventListener('change', (e) => setLimit(200, e.target.checked));
    limitQuestions500Toggle.addEventListener('change', (e) => setLimit(500, e.target.checked));

    // Buttons
    decreaseLimitBtn.addEventListener('click', () => adjustLimit(-50));
    increaseLimitBtn.addEventListener('click', () => adjustLimit(50));
}

function setLimit(value, isChecked) {
    if (isChecked) {
        state.questionLimit = value;
    } else {
        // If unchecking the currently active limit, go to unlimited
        if (state.questionLimit === value) {
            state.questionLimit = null;
        }
    }
    updateLimitUI();
}

function adjustLimit(delta) {
    // If currently unlimited, start from base
    const current = state.questionLimit || 100;
    const newLimit = current + delta;

    if (newLimit >= 50) { // Minimum limit 50
        state.questionLimit = newLimit;
        updateLimitUI();
    }
}

function updateLimitUI() {
    // Update display
    if (state.questionLimit === null) {
        currentLimitDisplay.textContent = "Hamsı";
    } else {
        currentLimitDisplay.textContent = state.questionLimit;
    }

    // Update toggles - uncheck all if null, or check matching
    limitQuestionsToggle.checked = state.questionLimit === 100;
    limitQuestions200Toggle.checked = state.questionLimit === 200;
    limitQuestions500Toggle.checked = state.questionLimit === 500;
}

// Toggle section selection
async function toggleSection(sectionNum) {
    if (state.selectedSections.has(sectionNum)) {
        state.selectedSections.delete(sectionNum);
    } else {
        state.selectedSections.add(sectionNum);
    }
    updateSectionButton(sectionNum);
    updateStartButton();
    await checkQuestionCount(); // Check if we need to show toggle
}

// Toggle subsection selection
async function toggleSubsection(subsectionNum) {
    if (state.selectedSubsections.has(subsectionNum)) {
        state.selectedSubsections.delete(subsectionNum);
    } else {
        state.selectedSubsections.add(subsectionNum);
    }
    updateSubsectionButton(subsectionNum);
    updateStartButton();
    await checkQuestionCount(); // Check if we need to show toggle
}

// Helper: Check total questions to show/hide toggle
async function checkQuestionCount() {
    // Only check if we have selections
    if (state.selectedSections.size === 0 && state.selectedSubsections.size === 0) {
        limitToggleContainer.style.display = 'none';
        return;
    }

    try {
        const allQuestions = await collectQuestions();
        if (allQuestions.length > 100) {
            limitToggleContainer.style.display = 'block';
        } else {
            limitToggleContainer.style.display = 'none';
        }
    } catch (e) {
        console.error("Error checking question count", e);
    }
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

// Select/Deselect all sections
async function selectAllSections() {
    // Check if everything is already selected
    const allRegularSections = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11];
    const allSubsections = [1, 2, 3, 4, 5, 6, 7, 8];

    const allSelected = allRegularSections.every(id => state.selectedSections.has(id)) &&
        allSubsections.every(id => state.selectedSubsections.has(id));

    if (allSelected) {
        // Deselect all
        state.selectedSections.clear();
        state.selectedSubsections.clear();
    } else {
        // Select all
        allRegularSections.forEach(id => state.selectedSections.add(id));
        allSubsections.forEach(id => state.selectedSubsections.add(id));
    }

    // Update UI
    allRegularSections.forEach(id => updateSectionButton(id));
    allSubsections.forEach(id => updateSubsectionButton(id));

    updateStartButton();
    await checkQuestionCount();
}

// Update start button state
function updateStartButton() {
    const hasSelection = state.selectedSections.size > 0 || state.selectedSubsections.size > 0;
    startBtn.disabled = !hasSelection;
}

// Collect questions from selected sections
async function collectQuestions() {
    const collected = [];

    // Load questions from regular sections
    for (const sectionNum of state.selectedSections) {
        const filename = sectionFileNames[sectionNum];
        if (filename) {
            const questions = await loadQuestions(filename);
            collected.push(...questions);
        }
    }

    // Load questions from section 4 subsections
    for (const subsectionNum of state.selectedSubsections) {
        const filename = subsectionFileNames[subsectionNum];
        if (filename) {
            const questions = await loadQuestions(filename);
            collected.push(...questions);
        }
    }

    return collected;
}

// Handle Start Click
async function handleStartClick() {
    try {
        let allQuestions = await collectQuestions();

        if (allQuestions.length === 0) {
            alert('suallar tapilmadi');
            return;
        }

        // Apply limit if toggle container is visible (checking simply if any sections selected logic handles this mostly)
        // But specifically, we use state.questionLimit now. 
        // We only limit if the count > limit? Or just always limit if user wants?
        // Original logic was "if checked". Now we have multiple inputs.
        // Let's say we always limit to state.questionLimit if container is visible.

        if (limitToggleContainer && limitToggleContainer.style.display !== 'none') {
            // Shuffle first
            shuffleArray(allQuestions);

            // Apply limit if set
            if (state.questionLimit !== null) {
                allQuestions = allQuestions.slice(0, state.questionLimit);
            }
        }

        startTest(allQuestions);

    } catch (error) {
        console.error('Error preparing test:', error);
        alert('error-Astana xeber et');
    }
}

// Start test with specific set of questions
function startTest(questionsToUse) {
    // Clone and shuffle
    state.questions = [...questionsToUse];
    shuffleArray(state.questions);

    // Initialize answers object
    state.answers = {};
    state.currentQuestionIndex = 0;
    state.unansweredMode = false; // Reset unanswered mode for new test

    // Show test screen
    selectionScreen.classList.remove('active');
    testScreen.classList.add('active');

    // Display first question
    displayQuestion();
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
    questionCounter.textContent = `Sual ${questionNum} / ${totalQuestions}`;

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

    // Feature 2: Next button behavior update
    // If it's the last question and there are unanswered questions, enable it to loop back.
    // If it's the last question and all answered, it stays disabled (or could lead to finish).
    // Original logic: nextBtn.disabled = state.currentQuestionIndex === state.questions.length - 1;

    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
    if (isLastQuestion) {
        // Check if there are any skipped questions
        const hasSkipped = hasSkippedQuestions();
        if (hasSkipped) {
            nextBtn.disabled = false;
            nextBtn.textContent = 'Cavabsız'; // Shows unanswered questions
        } else {
            nextBtn.disabled = true;
            nextBtn.textContent = 'Sonrakı';
        }
    } else {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Sonrakı';
    }
}

// Helper: Check for skipped questions
function hasSkippedQuestions() {
    for (let i = 0; i < state.questions.length; i++) {
        if (state.answers[i] === undefined) {
            return true;
        }
    }
    return false;
}

// Select answer
function selectAnswer(selectedOption) {
    state.answers[state.currentQuestionIndex] = selectedOption;
    displayQuestion(); // Refresh to show correct/incorrect colors

    // Auto-finish test when all questions are answered
    if (!hasSkippedQuestions()) {
        setTimeout(() => finishTest(), 500); // Small delay so user sees their answer
    }
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
    if (state.unansweredMode) {
        // In unanswered mode - find next unanswered after current
        const nextUnanswered = findNextUnansweredIndex(state.currentQuestionIndex + 1);
        if (nextUnanswered !== -1) {
            state.currentQuestionIndex = nextUnanswered;
            displayQuestion();
        } else {
            // No more unanswered after current, loop back to first unanswered
            const firstUnanswered = findNextUnansweredIndex(0);
            if (firstUnanswered !== -1) {
                state.currentQuestionIndex = firstUnanswered;
                displayQuestion();
            }
        }
    } else if (state.currentQuestionIndex < state.questions.length - 1) {
        // Normal next behavior
        state.currentQuestionIndex++;
        displayQuestion();
    } else {
        // Last question - enter unanswered mode
        const firstUnanswered = findNextUnansweredIndex(0);
        if (firstUnanswered !== -1) {
            state.currentQuestionIndex = firstUnanswered;
            state.unansweredMode = true;
            displayQuestion();
        }
    }
}

// Find next unanswered question starting from a given index
function findNextUnansweredIndex(startFrom) {
    for (let i = startFrom; i < state.questions.length; i++) {
        if (state.answers[i] === undefined) {
            return i;
        }
    }
    return -1;
}

function findFirstSkippedIndex() {
    return findNextUnansweredIndex(0);
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
    state.unansweredMode = false; // Reset unanswered mode

    // Reset UI
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('.subsection-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Hide toggle
    if (limitToggleContainer) limitToggleContainer.style.display = 'none';

    updateStartButton();

    // Switch to selection screen
    resultsScreen.classList.remove('active');
    selectionScreen.classList.add('active');
}

// Dark mode functions
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    updateDarkModeUI();
    localStorage.setItem('darkMode', state.darkMode);
}

function updateDarkModeUI() {
    const icon = state.darkMode ? '☀️' : '🌙';
    if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (darkModeBtn) darkModeBtn.textContent = icon;
    if (selectionDarkModeBtn) selectionDarkModeBtn.textContent = icon;
}

function loadDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        state.darkMode = true;
    } else {
        state.darkMode = false;
    }
    updateDarkModeUI();
}
