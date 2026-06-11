// Configuración de herramientas
const TOOLS_CONFIG = [
    {
        id: 'calculator',
        nameKey: 'calculator',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`
    },
    {
        id: 'todo',
        nameKey: 'todoList',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    },
    {
        id: 'translator',
        nameKey: 'translator',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`
    },
    {
        id: 'notes',
        nameKey: 'quickNotes',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
    },
    {
        id: 'timer',
        nameKey: 'timer',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    },
    {
        id: 'shortcuts',
        nameKey: 'shortcuts',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
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

// Estado
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
    renderToolsConfig();
    setupEventListeners();
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

// Cargar estado
async function loadState() {
    try {
        const result = await chrome.storage.local.get(['tools', 'preferences']);
        
        if (result.tools) {
            toolsState = result.tools;
        } else {
            toolsState = TOOLS_CONFIG.map((tool, index) => ({
                ...tool,
                order: index,
                visible: true,
                expanded: false
            }));
        }
        
        if (result.preferences) {
            preferences = { ...preferences, ...result.preferences };
        }
    } catch (error) {
        console.error('Error loading state:', error);
        toolsState = TOOLS_CONFIG.map((tool, index) => ({
            ...tool,
            order: index,
            visible: true,
            expanded: false
        }));
    }
}

// Guardar estado
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
    
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = preferences.theme;
    }
}

// Renderizar configuración de herramientas
function renderToolsConfig() {
    const container = document.getElementById('tools-config');
    container.innerHTML = '';
    
    const sortedTools = [...toolsState].sort((a, b) => a.order - b.order);
    
    sortedTools.forEach(tool => {
        const toolConfig = TOOLS_CONFIG.find(t => t.id === tool.id);
        if (!toolConfig) return;
        
        const item = document.createElement('div');
        item.className = 'tool-config-item';
        item.innerHTML = `
            <div class="tool-name">
                <div class="tool-icon">${toolConfig.icon}</div>
                <span>${getMessage(toolConfig.nameKey)}</span>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" ${tool.visible ? 'checked' : ''} data-tool-id="${tool.id}">
                <span class="toggle-slider"></span>
            </label>
        `;
        
        container.appendChild(item);
    });
}

// Configurar event listeners
function setupEventListeners() {
    const themeSelect = document.getElementById('theme-select');
    const saveBtn = document.getElementById('save-btn');
    const clearDataBtn = document.getElementById('clear-data-btn');
    
    // Cambio de tema
    themeSelect.addEventListener('change', (e) => {
        preferences.theme = e.target.value;
        applyTheme();
    });
    
    // Toggle de herramientas
    const toolToggles = document.querySelectorAll('.tool-config-item input[type="checkbox"]');
    toolToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const toolId = e.target.dataset.toolId;
            const tool = toolsState.find(t => t.id === toolId);
            if (tool) {
                tool.visible = e.target.checked;
            }
        });
    });
    
    // Guardar
    saveBtn.addEventListener('click', async () => {
        await saveState();
        
        // Notificar al sidebar que las preferencias han cambiado
        chrome.runtime.sendMessage({ type: 'preferencesUpdated' });
        
        // Mostrar confirmación
        saveBtn.textContent = getMessage('saved');
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.textContent = getMessage('save');
            saveBtn.disabled = false;
        }, 1500);
    });
    
    // Borrar datos
    clearDataBtn.addEventListener('click', async () => {
        if (confirm(getMessage('confirmClearData'))) {
            try {
                await chrome.storage.local.clear();
                
                // Reiniciar estado
                toolsState = TOOLS_CONFIG.map((tool, index) => ({
                    ...tool,
                    order: index,
                    visible: true,
                    expanded: false
                }));
                preferences = {
                    theme: 'light',
                    width: 400
                };
                
                applyTheme();
                renderToolsConfig();
                
                alert(getMessage('dataCleared'));
            } catch (error) {
                console.error('Error clearing data:', error);
                alert(getMessage('errorClearingData'));
            }
        }
    });
}