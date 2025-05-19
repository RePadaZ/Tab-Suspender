document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["myKey"], (result) => {
        if (result.myKey) {
            document.getElementById("minutes").value = result.myKey / 60000;
        }
    });

    document.getElementById("apply").addEventListener("click", () => {
        const value = Number(document.getElementById("minutes").value);

        if (isNaN(value) || value <= 0) {
            alert("Введите корректное число минут.");
            return;
        }

        const timeMs = value * 60000;

        chrome.runtime.sendMessage({ type: "setInterval", timeMs }, (response) => {
            if (response.success) {
                alert("Интервал обновлён!");
            }
        });
    });
});
