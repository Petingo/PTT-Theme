let createPickrObject = (target, elementPath, defaultColor) => {
    let pickr = Pickr.create({
        el: elementPath,
        theme: 'nano',

        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

        default: defaultColor,

        components: {

            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                input: true,
                cancel: true,
                save: true,
            }
        }
    });

    let update = (color) => {
        try {
            chrome.storage.local.set({
                [target]: color.toRGBA().toString()
            })
        } catch (err) {
            chrome.storage.local.set({
                [target]: color
            })
        }

    }

    let lastUpdateTime = 0;

    pickr.on('save', (newColor, instance) => {
        // console.log('save', color, instance);
    }).on('change', (newColor, instance) => {
        // in case it update toooo fast, it would crash
        let now = Date.now()
        if (now - lastUpdateTime > 50) {
            lastUpdateTime = now
            update(newColor)
        }
    }).on('cancel', instance => {
        update(defaultColor)
    })

    return pickr
}

let refreshColorPickr = () => {
    colors.forEach((color) => {
        chrome.storage.local.get([color], function(result) {
            createPickrObject(color, `.pickr-${color.substring(2)}`, result[color])
        })
    })
}

let initThemeSelectionDropdown = () => {
    let themeSelectionDropdown = document.getElementById("theme-selection-dropdown")
    let themeSelectionDropdownItemContainer = document.getElementById("theme-selection-dropdown-item-container")

    chrome.storage.local.get([BASE_THEME], function(result) {
        let currentTheme = result[BASE_THEME]
        themeSelectionDropdown.innerText = currentTheme;

        for (let key in themeJSONFileMap) {
            let item = document.createElement("a")
            item.setAttribute("class", "dropdown-item theme-selection-dropdown-item")
            item.setAttribute("theme-json-file", themeJSONFileMap[key])
            item.setAttribute("href", "#")
            if (key == currentTheme) {
                item.classList.add("active")
            }

            item.innerText = key
            item.onclick = async() => {
                await loadJSONConfig(key)
                location.reload();
            }

            themeSelectionDropdownItemContainer.appendChild(item)
        }
    })
}

(async() => {
    initThemeSelectionDropdown()
    refreshColorPickr()
})()