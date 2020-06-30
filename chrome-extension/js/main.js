chrome.storage.onChanged.addListener(async function(changes, namespace) {
    for (let key in changes) {
        let colorKeyRE = /--.*/
        if (colorKeyRE.test(key)) {
            document.documentElement.style.setProperty(key, changes[key].newValue);
        }
    }
})