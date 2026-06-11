// Service Worker para la extensión

// Instalación de la extensión
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Barra Lateral de Productividad instalada');
    
    // Configurar el comportamiento del panel lateral
    try {
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } catch (error) {
        console.error('Error configurando panel lateral:', error);
    }
});

// Click en el icono de la extensión
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Abrir el panel lateral
        await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
        console.error('Error abriendo panel lateral:', error);
    }
});

// Manejar mensajes desde otros contextos
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'openSidePanel') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]) {
                try {
                    await chrome.sidePanel.open({ windowId: tabs[0].windowId });
                } catch (error) {
                    console.error('Error abriendo panel lateral:', error);
                }
            }
        });
    }
});