// Configuración de herramientas
const TOOLS_CONFIG = [
    {
        id: 'calculator',
        nameKey: 'calculator',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
        defaultExpanded: true
    },
    {
        id: 'todo',
        nameKey: 'todoList',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        defaultExpanded: true
    },
    {
        id: 'translator',
        nameKey: 'translator',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`,
        defaultExpanded: true
    },
    {
        id: 'notes',
        nameKey: 'quickNotes',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        defaultExpanded: false
    },
    {
        id: 'timer',
        nameKey: 'timer',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        defaultExpanded: false
    },
    {
        id: 'shortcuts',
        nameKey: 'shortcuts',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        defaultExpanded: false
    }
];

// Función para obtener mensajes localizados
function getMessage(key, substitutions = []) {
    return chrome.i18n.getMessage(key, substitutions);
}

// Función para aplicar traducciones a elementos con data-i18n
function applyTranslations() {
    // Traducir elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getMessage(key);
    });

    // Traducir elementos con data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.setAttribute('title', getMessage(key));
    });

    // Traducir opciones de select
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        option.textContent = getMessage(key);
    });

    // Actualizar el título del documento
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const key = titleElement.getAttribute('data-i18n');
        document.title = getMessage(key);
    }
}

// Estado global
let toolsState = [];
let preferences = {
    theme: 'system',
    width: 400
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    applyTranslations();
    await loadState();
    applyTheme();
    renderTools();
    setupDragAndDrop();
    setupSettingsButton();
    setupMessageListener();
    setupSystemThemeListener();
});

// Escuchar cambios en el tema del sistema
function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
        if (preferences.theme === 'system') {
            applyTheme();
        }
    });
}

// Escuchar mensajes del popup
function setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'preferencesUpdated') {
            loadState().then(() => {
                applyTheme();
                renderTools();
            });
        }
    });
}

// Cargar estado desde chrome.storage.local
async function loadState() {
    try {
        const result = await chrome.storage.local.get(['tools', 'preferences', 'todoItems', 'notes', 'shortcuts']);
        
        if (result.tools) {
            toolsState = result.tools;
        } else {
            toolsState = TOOLS_CONFIG.map((tool, index) => ({
                ...tool,
                order: index,
                visible: true,
                expanded: tool.defaultExpanded
            }));
        }
        
        if (result.preferences) {
            preferences = { ...preferences, ...result.preferences };
        }
        
        // Cargar datos específicos de cada herramienta
        if (result.todoItems) window.todoItems = result.todoItems;
        if (result.notes) window.notes = result.notes;
        if (result.shortcuts) window.shortcuts = result.shortcuts;
        
    } catch (error) {
        console.error('Error loading state:', error);
        toolsState = TOOLS_CONFIG.map((tool, index) => ({
            ...tool,
            order: index,
            visible: true,
            expanded: tool.defaultExpanded
        }));
    }
}

// Guardar estado en chrome.storage.local
async function saveState() {
    try {
        await chrome.storage.local.set({
            tools: toolsState,
            preferences: preferences
        });
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// Detectar tema del sistema
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Aplicar tema
function applyTheme() {
    let effectiveTheme = preferences.theme;
    
    // Si el tema es 'system', usar el tema del sistema
    if (preferences.theme === 'system') {
        effectiveTheme = getSystemTheme();
    }
    
    if (effectiveTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Renderizar herramientas
function renderTools() {
    const container = document.getElementById('tools-container');
    container.innerHTML = '';
    
    const sortedTools = [...toolsState].sort((a, b) => a.order - b.order);
    
    sortedTools.forEach(tool => {
        if (!tool.visible) return;
        
        const toolCard = createToolCard(tool);
        container.appendChild(toolCard);
    });
    
    // Inicializar cada herramienta
    initializeCalculator();
    initializeTodo();
    initializeTranslator();
    initializeNotes();
    initializeTimer();
    initializeShortcuts();
}

// Crear tarjeta de herramienta
function createToolCard(tool) {
    const toolConfig = TOOLS_CONFIG.find(t => t.id === tool.id);
    const card = document.createElement('div');
    card.className = `tool-card ${tool.expanded ? 'expanded' : ''}`;
    card.dataset.toolId = tool.id;
    card.draggable = true;
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-title">
                <div class="tool-icon">${toolConfig.icon}</div>
                <span>${getMessage(toolConfig.nameKey)}</span>
            </div>
            <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
        <div class="tool-content" id="${tool.id}-content"></div>
    `;
    
    // Toggle expand/collapse
    const header = card.querySelector('.tool-header');
    header.addEventListener('click', () => {
        tool.expanded = !tool.expanded;
        card.classList.toggle('expanded', tool.expanded);
        saveState();
    });
    
    return card;
}

// Configurar drag and drop
function setupDragAndDrop() {
    const container = document.getElementById('tools-container');
    
    container.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.tool-card');
        if (!card) return;
        
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.dataset.toolId);
    });
    
    container.addEventListener('dragend', (e) => {
        const card = e.target.closest('.tool-card');
        if (!card) return;
        
        card.classList.remove('dragging');
    });
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const card = e.target.closest('.tool-card');
        if (!card) return;
        
        const draggingCard = container.querySelector('.dragging');
        if (draggingCard === card) return;
        
        const cards = [...container.querySelectorAll('.tool-card:not(.dragging)')];
        const nextCard = cards.find(c => {
            const rect = c.getBoundingClientRect();
            return e.clientY < rect.top + rect.height / 2;
        });
        
        if (nextCard) {
            container.insertBefore(draggingCard, nextCard);
        } else {
            container.appendChild(draggingCard);
        }
    });
    
    container.addEventListener('drop', async (e) => {
        e.preventDefault();
        const cards = [...container.querySelectorAll('.tool-card')];
        
        cards.forEach((card, index) => {
            const toolId = card.dataset.toolId;
            const tool = toolsState.find(t => t.id === toolId);
            if (tool) {
                tool.order = index;
            }
        });
        
        await saveState();
    });
}

// Configurar botón de configuración
function setupSettingsButton() {
    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
}

// ==================== CALCULADORA ====================
function initializeCalculator() {
    const container = document.getElementById('calculator-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="calculator">
            <div class="calculator-display" id="calc-display">0</div>
            <div class="calculator-buttons">
                <button class="calc-btn clear" data-action="clear">C</button>
                <button class="calc-btn operator" data-action="operator" data-value="/">/</button>
                <button class="calc-btn operator" data-action="operator" data-value="*">×</button>
                <button class="calc-btn operator" data-action="backspace">⌫</button>
                
                <button class="calc-btn" data-action="number" data-value="7">7</button>
                <button class="calc-btn" data-action="number" data-value="8">8</button>
                <button class="calc-btn" data-action="number" data-value="9">9</button>
                <button class="calc-btn operator" data-action="operator" data-value="-">-</button>
                
                <button class="calc-btn" data-action="number" data-value="4">4</button>
                <button class="calc-btn" data-action="number" data-value="5">5</button>
                <button class="calc-btn" data-action="number" data-value="6">6</button>
                <button class="calc-btn operator" data-action="operator" data-value="+">+</button>
                
                <button class="calc-btn" data-action="number" data-value="1">1</button>
                <button class="calc-btn" data-action="number" data-value="2">2</button>
                <button class="calc-btn" data-action="number" data-value="3">3</button>
                <button class="calc-btn equals" data-action="equals">=</button>
                
                <button class="calc-btn" data-action="number" data-value="0" style="grid-column: span 2">0</button>
                <button class="calc-btn" data-action="decimal">.</button>
            </div>
        </div>
    `;
    
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetInput = false;
    
    const display = document.getElementById('calc-display');
    
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.calc-btn');
        if (!btn) return;
        
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        
        switch (action) {
            case 'number':
                if (shouldResetInput) {
                    currentInput = value;
                    shouldResetInput = false;
                } else {
                    currentInput = currentInput === '0' ? value : currentInput + value;
                }
                break;
                
            case 'decimal':
                if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                break;
                
            case 'operator':
                if (operator && !shouldResetInput) {
                    calculate();
                }
                previousInput = currentInput;
                operator = value;
                shouldResetInput = true;
                break;
                
            case 'equals':
                if (operator) {
                    calculate();
                    operator = null;
                    shouldResetInput = true;
                }
                break;
                
            case 'clear':
                currentInput = '0';
                previousInput = '';
                operator = null;
                shouldResetInput = false;
                break;
                
            case 'backspace':
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                break;
        }
        
        display.textContent = currentInput;
    });
    
    function calculate() {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        previousInput = '';
    }
}

// ==================== LISTA DE TAREAS ====================
function initializeTodo() {
    const container = document.getElementById('todo-content');
    if (!container) return;
    
    if (!window.todoItems) {
        window.todoItems = [];
    }
    
    container.innerHTML = `
        <div class="todo-list">
            <div class="todo-input-group">
                <input type="text" class="todo-input" id="todo-input" placeholder="${getMessage('newTask')}">
                <button class="add-btn" id="add-todo-btn">${getMessage('add')}</button>
            </div>
            <div class="todo-items" id="todo-items"></div>
        </div>
    `;
    
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const itemsContainer = document.getElementById('todo-items');
    
    renderTodoItems();
    
    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    function addTodo() {
        const text = input.value.trim();
        if (!text) return;
        
        window.todoItems.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        
        input.value = '';
        renderTodoItems();
        saveTodoItems();
    }
    
    function renderTodoItems() {
        itemsContainer.innerHTML = '';
        
        window.todoItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = `todo-item ${item.completed ? 'completed' : ''}`;
            itemEl.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${item.completed ? 'checked' : ''}>
                <span class="todo-text">${item.text}</span>
                <button class="delete-btn" title="${getMessage('delete')}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            const checkbox = itemEl.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => {
                item.completed = checkbox.checked;
                itemEl.classList.toggle('completed', item.completed);
                saveTodoItems();
            });
            
            const deleteBtn = itemEl.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                window.todoItems = window.todoItems.filter(i => i.id !== item.id);
                renderTodoItems();
                saveTodoItems();
            });
            
            itemsContainer.appendChild(itemEl);
        });
    }
    
    async function saveTodoItems() {
        try {
            await chrome.storage.local.set({ todoItems: window.todoItems });
        } catch (error) {
            console.error('Error saving todo items:', error);
        }
    }
}

// ==================== TRADUCTOR ====================
function initializeTranslator() {
    const container = document.getElementById('translator-content');
    if (!container) return;
    
    // Idiomas comunes
    const languages = [
        { code: 'auto', nameKey: 'detectLanguage' },
        { code: 'en', nameKey: 'english' },
        { code: 'es', nameKey: 'spanish' },
        { code: 'fr', nameKey: 'french' },
        { code: 'de', nameKey: 'german' },
        { code: 'it', nameKey: 'italian' },
        { code: 'pt', nameKey: 'portuguese' },
        { code: 'ru', nameKey: 'russian' },
        { code: 'ja', nameKey: 'japanese' },
        { code: 'ko', nameKey: 'korean' },
        { code: 'zh', nameKey: 'chinese' },
        { code: 'ar', nameKey: 'arabic' },
        { code: 'hi', nameKey: 'hindi' },
        { code: 'nl', nameKey: 'dutch' },
        { code: 'pl', nameKey: 'polish' },
        { code: 'tr', nameKey: 'turkish' },
        { code: 'vi', nameKey: 'vietnamese' },
        { code: 'th', nameKey: 'thai' },
        { code: 'id', nameKey: 'indonesian' },
        { code: 'sv', nameKey: 'swedish' },
        { code: 'da', nameKey: 'danish' },
        { code: 'no', nameKey: 'norwegian' },
        { code: 'fi', nameKey: 'finnish' },
        { code: 'el', nameKey: 'greek' },
        { code: 'he', nameKey: 'hebrew' },
        { code: 'uk', nameKey: 'ukrainian' },
        { code: 'cs', nameKey: 'czech' },
        { code: 'ro', nameKey: 'romanian' },
        { code: 'hu', nameKey: 'hungarian' },
        { code: 'sk', nameKey: 'slovak' },
        { code: 'bg', nameKey: 'bulgarian' },
        { code: 'hr', nameKey: 'croatian' },
        { code: 'sr', nameKey: 'serbian' },
        { code: 'ms', nameKey: 'malay' },
        { code: 'bn', nameKey: 'bengali' },
        { code: 'ta', nameKey: 'tamil' },
        { code: 'te', nameKey: 'telugu' },
        { code: 'mr', nameKey: 'marathi' },
        { code: 'ur', nameKey: 'urdu' },
        { code: 'fa', nameKey: 'persian' },
        { code: 'sw', nameKey: 'swahili' },
        { code: 'af', nameKey: 'afrikaans' }
    ];
    
    container.innerHTML = `
        <div class="translator-container">
            <div class="translator-language-selector">
                <select class="translator-select" id="source-language">
                    ${languages.map(lang => `<option value="${lang.code}">${getMessage(lang.nameKey)}</option>`).join('')}
                </select>
                <button class="translator-swap-btn" id="swap-languages" title="${getMessage('swapLanguages')}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l-4-4M17 20l4-4"/>
                    </svg>
                </button>
                <select class="translator-select" id="target-language">
                    ${languages.map(lang => `<option value="${lang.code}" ${lang.code === 'en' ? 'selected' : ''}>${getMessage(lang.nameKey)}</option>`).join('')}
                </select>
            </div>
            <textarea class="translator-textarea" id="source-text" placeholder="${getMessage('enterTextToTranslate')}"></textarea>
            <div class="translator-output-wrapper">
                <div class="translator-output empty" id="translated-text">${getMessage('translationWillAppear')}</div>
                <button class="translator-copy-btn" id="copy-btn" title="${getMessage('copy')}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
            <div class="translator-actions">
                <button class="translator-btn" id="translate-btn">${getMessage('translate')}</button>
                <button class="translator-btn secondary" id="clear-btn">${getMessage('clear')}</button>
            </div>
            <div class="translator-status" id="translator-status"></div>
        </div>
    `;
    
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const swapBtn = document.getElementById('swap-languages');
    const sourceText = document.getElementById('source-text');
    const translatedText = document.getElementById('translated-text');
    const translateBtn = document.getElementById('translate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const status = document.getElementById('translator-status');
    
    let translatorSession = null;
    let debounceTimer = null;
    let isTranslating = false;
    
    // Verificar disponibilidad del API
    async function checkAvailability() {
        if (typeof Translator === 'undefined') {
            status.textContent = getMessage('translatorApiNotAvailable');
            status.className = 'translator-status error';
            translateBtn.disabled = true;
            return false;
        }
        
        try {
            const availability = await Translator.availability({
                sourceLanguage: sourceLanguage.value === 'auto' ? 'en' : sourceLanguage.value,
                targetLanguage: targetLanguage.value
            });
            
            if (availability === 'available') {
                return true;
            } else if (availability === 'downloadable' || availability === 'downloading') {
                status.textContent = getMessage('downloadingModel');
                status.className = 'translator-status loading';
                return true;
            } else {
                status.textContent = getMessage('modelNotAvailable');
                status.className = 'translator-status error';
                return false;
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            status.textContent = getMessage('errorCheckingAvailability');
            status.className = 'translator-status error';
            return false;
        }
    }
    
    // Crear sesión de traductor
    async function createSession() {
        try {
            if (translatorSession) {
                await translatorSession.destroy();
            }
            
            const srcLang = sourceLanguage.value === 'auto' ? 'en' : sourceLanguage.value;
            const tgtLang = targetLanguage.value;
            
            translatorSession = await Translator.create({
                sourceLanguage: srcLang,
                targetLanguage: tgtLang,
                monitor: (m) => {
                    m.addEventListener('downloadprogress', (event) => {
                        if (event.loaded < event.total) {
                            const percentage = Math.round((event.loaded / event.total) * 100);
                            status.textContent = getMessage('downloadingModelProgress', [percentage.toString()]);
                            status.className = 'translator-status loading';
                        } else {
                            status.textContent = '';
                        }
                    });
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error creating translator session:', error);
            status.textContent = getMessage('errorCreatingSession');
            status.className = 'translator-status error';
            return false;
        }
    }
    
    // Traducir texto
    async function translate(showStatus = true) {
        const text = sourceText.value.trim();
        if (!text) {
            if (showStatus) {
                status.textContent = getMessage('enterTextToTranslateError');
                status.className = 'translator-status error';
            }
            translatedText.textContent = getMessage('translationWillAppear');
            translatedText.classList.add('empty');
            return;
        }
        
        if (showStatus) {
            translateBtn.disabled = true;
            translateBtn.textContent = getMessage('translating');
            status.textContent = getMessage('translating');
            status.className = 'translator-status loading';
        }
        
        isTranslating = true;
        
        try {
            const isAvailable = await checkAvailability();
            if (!isAvailable) {
                if (showStatus) {
                    translateBtn.disabled = false;
                    translateBtn.textContent = getMessage('translate');
                }
                isTranslating = false;
                return;
            }
            
            await createSession();
            
            if (!translatorSession) {
                if (showStatus) {
                    translateBtn.disabled = false;
                    translateBtn.textContent = getMessage('translate');
                }
                isTranslating = false;
                return;
            }
            
            const translated = await translatorSession.translate(text);
            
            translatedText.textContent = translated;
            translatedText.classList.remove('empty');
            
            if (showStatus) {
                status.textContent = getMessage('translationCompleted');
                status.className = 'translator-status success';
                
                // Limpiar estado después de 2 segundos
                setTimeout(() => {
                    status.textContent = '';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Error translating:', error);
            if (showStatus) {
                status.textContent = getMessage('errorTranslating', [error.message]);
                status.className = 'translator-status error';
            }
        } finally {
            if (showStatus) {
                translateBtn.disabled = false;
                translateBtn.textContent = getMessage('translate');
            }
            isTranslating = false;
        }
    }
    
    // Traducción con debounce (mientras escribe)
    function translateWithDebounce() {
        clearTimeout(debounceTimer);
        
        // Esperar 500ms después de que el usuario deje de escribir
        debounceTimer = setTimeout(() => {
            if (!isTranslating) {
                translate(false); // false = no mostrar estado de carga
            }
        }, 500);
    }
    
    // Event listeners
    translateBtn.addEventListener('click', () => translate(true));
    
    // Traducción automática mientras escribe
    sourceText.addEventListener('input', translateWithDebounce);
    
    // Traducir automáticamente cuando cambian los idiomas
    sourceLanguage.addEventListener('change', () => {
        if (sourceText.value.trim()) {
            translateWithDebounce();
        }
    });
    
    targetLanguage.addEventListener('change', () => {
        if (sourceText.value.trim()) {
            translateWithDebounce();
        }
    });
    
    sourceText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            translate(true);
        }
    });
    
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        translatedText.textContent = getMessage('translationWillAppear');
        translatedText.classList.add('empty');
        status.textContent = '';
    });
    
    // Copiar traducción
    copyBtn.addEventListener('click', async () => {
        if (translatedText.classList.contains('empty')) {
            return;
        }
        
        try {
            await navigator.clipboard.writeText(translatedText.textContent);
            
            // Feedback visual
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            copyBtn.classList.add('copied');
            copyBtn.title = getMessage('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copied');
                copyBtn.title = getMessage('copy');
            }, 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            status.textContent = getMessage('errorCopying');
            status.className = 'translator-status error';
        }
    });
    
    swapBtn.addEventListener('click', () => {
        const temp = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = temp;
        
        // Si el source es 'auto', cambiar a 'en' temporalmente
        if (sourceLanguage.value === 'auto') {
            sourceLanguage.value = 'en';
        }
        
        // Disparar evento change para activar traducción automática
        sourceLanguage.dispatchEvent(new Event('change'));
        targetLanguage.dispatchEvent(new Event('change'));
        
        // Si hay texto, traducir automáticamente
        if (sourceText.value.trim()) {
            translateWithDebounce();
        }
    });
    
    // Verificar disponibilidad al cargar
    checkAvailability();
}

// ==================== NOTAS ====================
function initializeNotes() {
    const container = document.getElementById('notes-content');
    if (!container) return;
    
    if (!window.notes) {
        window.notes = '';
    }
    
    container.innerHTML = `
        <div class="notes-container">
            <textarea class="notes-textarea" id="notes-textarea" placeholder="${getMessage('writeNotes')}">${window.notes}</textarea>
            <div class="notes-status" id="notes-status"></div>
        </div>
    `;
    
    const textarea = document.getElementById('notes-textarea');
    const status = document.getElementById('notes-status');
    
    let saveTimeout;
    
    textarea.addEventListener('input', () => {
        status.textContent = getMessage('saving');
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            window.notes = textarea.value;
            try {
                await chrome.storage.local.set({ notes: window.notes });
                status.textContent = getMessage('savedStatus');
                setTimeout(() => {
                    status.textContent = '';
                }, 2000);
            } catch (error) {
                console.error('Error saving notes:', error);
                status.textContent = getMessage('errorSaving');
            }
        }, 500);
    });
}

// ==================== TEMPORIZADOR ====================
function initializeTimer() {
    const container = document.getElementById('timer-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="timer-container">
            <div class="timer-display" id="timer-display">00:00:00</div>
            <div class="timer-inputs" id="timer-inputs">
                <input type="number" class="timer-input" id="timer-hours" placeholder="00" min="0" max="23">
                <span class="timer-label">:</span>
                <input type="number" class="timer-input" id="timer-minutes" placeholder="00" min="0" max="59">
                <span class="timer-label">:</span>
                <input type="number" class="timer-input" id="timer-seconds" placeholder="00" min="0" max="59">
            </div>
            <div class="timer-controls">
                <button class="timer-btn primary" id="timer-start">${getMessage('start')}</button>
                <button class="timer-btn" id="timer-pause" disabled>${getMessage('pause')}</button>
                <button class="timer-btn" id="timer-reset">${getMessage('reset')}</button>
            </div>
        </div>
    `;
    
    let timerInterval = null;
    let totalSeconds = 0;
    let isRunning = false;
    
    const display = document.getElementById('timer-display');
    const hoursInput = document.getElementById('timer-hours');
    const minutesInput = document.getElementById('timer-minutes');
    const secondsInput = document.getElementById('timer-seconds');
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    const inputsContainer = document.getElementById('timer-inputs');
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    function startTimer() {
        if (!isRunning) {
            if (totalSeconds === 0) {
                const hours = parseInt(hoursInput.value) || 0;
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                totalSeconds = hours * 3600 + minutes * 60 + seconds;
            }
            
            if (totalSeconds > 0) {
                isRunning = true;
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                inputsContainer.style.display = 'none';
                
                timerInterval = setInterval(() => {
                    totalSeconds--;
                    updateDisplay();
                    
                    if (totalSeconds <= 0) {
                        pauseTimer();
                        alert(getMessage('timeUp'));
                    }
                }, 1000);
            }
        }
    }
    
    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    function resetTimer() {
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        inputsContainer.style.display = 'flex';
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
    }
    
    function updateDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        display.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// ==================== ATAJOS ====================
function initializeShortcuts() {
    const container = document.getElementById('shortcuts-content');
    if (!container) return;
    
    if (!window.shortcuts) {
        window.shortcuts = [
            { id: 1, name: 'Google', url: 'https://www.google.com' },
            { id: 2, name: 'Gmail', url: 'https://mail.google.com' },
            { id: 3, name: 'YouTube', url: 'https://www.youtube.com' }
        ];
    }
    
    container.innerHTML = `
        <div class="shortcuts-container">
            <div class="shortcut-input-group">
                <input type="text" class="shortcut-input" id="shortcut-name" placeholder="${getMessage('name')}">
                <input type="url" class="shortcut-input" id="shortcut-url" placeholder="${getMessage('url')}">
                <button class="add-btn" id="add-shortcut-btn">${getMessage('add')}</button>
            </div>
            <div class="shortcuts-list" id="shortcuts-list"></div>
        </div>
    `;
    
    const nameInput = document.getElementById('shortcut-name');
    const urlInput = document.getElementById('shortcut-url');
    const addBtn = document.getElementById('add-shortcut-btn');
    const listContainer = document.getElementById('shortcuts-list');
    
    renderShortcuts();
    
    addBtn.addEventListener('click', addShortcut);
    
    function addShortcut() {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        
        if (!name || !url) return;
        
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = 'https://' + url;
        }
        
        window.shortcuts.push({
            id: Date.now(),
            name: name,
            url: formattedUrl
        });
        
        nameInput.value = '';
        urlInput.value = '';
        
        renderShortcuts();
        saveShortcuts();
    }
    
    function renderShortcuts() {
        listContainer.innerHTML = '';
        
        window.shortcuts.forEach(shortcut => {
            const item = document.createElement('a');
            item.className = 'shortcut-item';
            item.href = shortcut.url;
            item.target = '_blank';
            
            // Extraer dominio para el favicon
            const domain = new URL(shortcut.url).hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            
            item.innerHTML = `
                <div class="shortcut-icon">
                    <img src="${faviconUrl}" alt="${shortcut.name}" class="shortcut-favicon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                </div>
                <span class="shortcut-name">${shortcut.name}</span>
                <span class="shortcut-url">${shortcut.url}</span>
                <button class="delete-btn" title="${getMessage('delete')}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            const deleteBtn = item.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.shortcuts = window.shortcuts.filter(s => s.id !== shortcut.id);
                renderShortcuts();
                saveShortcuts();
            });
            
            listContainer.appendChild(item);
        });
    }
    
    async function saveShortcuts() {
        try {
            await chrome.storage.local.set({ shortcuts: window.shortcuts });
        } catch (error) {
            console.error('Error saving shortcuts:', error);
        }
    }
}