injectTheme()

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);

        console.log("refresh")
        refreshTheme();
    }
});