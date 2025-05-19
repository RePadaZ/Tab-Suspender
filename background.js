// Загружаем таймер из хранилища при старте
chrome.runtime.onStartup.addListener(setupTimerFromStorage);
chrome.runtime.onInstalled.addListener(setupTimerFromStorage);

// Слушаем alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "autoDiscard") {
        getNotActiveTabs();
    }
});

// Устанавливаем таймер из хранилища
function setupTimerFromStorage() {
    chrome.storage.local.get(["myKey"], (result) => {
        if (result.myKey && !isNaN(result.myKey)) {
            const delayInMinutes = result.myKey / 60000;
            chrome.alarms.create("autoDiscard", {
                periodInMinutes: delayInMinutes
            });
        }
    });
}

// Получить и выгрузить неактивные вкладки
async function getNotActiveTabs() {
    const tabs = await chrome.tabs.query({
        active: false,
        currentWindow: true,
        discarded: false,
        frozen: false
    });

    const activeTab = await chrome.tabs.query({
        active: true,
        currentWindow: true,
        frozen: false,
        discarded: false
    });

    const activeTabId = activeTab[0]?.id;

    for (const tab of tabs) {
        if (tab.id === activeTabId) continue;
        chrome.tabs.discard(tab.id);
    }
}

// При получении нового интервала из popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "setInterval" && message.timeMs > 0) {
        const delayInMinutes = message.timeMs / 60000;

        chrome.storage.local.set({ myKey: message.timeMs });

        chrome.alarms.clear("autoDiscard", () => {
            chrome.alarms.create("autoDiscard", {
                periodInMinutes: delayInMinutes
            });
        });

        sendResponse({ success: true });
    }
});
