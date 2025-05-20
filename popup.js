document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["myKey"], (result) => {
        if (result.myKey) {
            document.getElementById("minutes").value = result.myKey / 60000;
        }
    });

    document.getElementById("apply").addEventListener("click", () => {
        setTimeTabDiscard()
    });

    document.getElementById("discard").addEventListener("click", () => {
        ButtonDiscardTab()
    });
});

function setTimeTabDiscard() {
    const value = Number(document.getElementById("minutes").value);

    if (isNaN(value) || value <= 0) {
        alert("Введите корректное число минут.");
        return;
    }

    const timeMs = value * 60000;

    chrome.runtime.sendMessage({type: "setInterval", timeMs}, (response) => {
        if (response.success) {
            alert("Интервал обновлён!");
        }
    });
}

async function ButtonDiscardTab() {
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