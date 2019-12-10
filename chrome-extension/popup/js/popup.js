let lastUpdateTime = 0;
function createPickrObject(target, el, defaultColor) {
    let pickr = Pickr.create({
        el: el,
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

    pickr.on('save', (color, instance) => {
        console.log('save', color, instance);
    }).on('change', (color, instance) => {
        let now = Date.now()
        if (now - lastUpdateTime > 200) {
            lastUpdateTime = now
            console.log(color.toRGBA().toString())
            chrome.storage.sync.get(["themeConfig"], function (result) {
                let themeConfig = JSON.parse(result["themeConfig"])
                themeConfig.base[`$${target}`] = color.toRGBA().toString()
                chrome.storage.sync.set({ "themeConfig": JSON.stringify(themeConfig) })
            })
        }
    }).on('cancel', instance => {
        chrome.storage.sync.get(["themeConfig"], function (result) {
            let themeConfig = JSON.parse(result["themeConfig"])
            themeConfig.base[`$${target}`] = instance.options.default
            chrome.storage.sync.set({ "themeConfig": JSON.stringify(themeConfig) })
        })
    })

    return pickr
}

let refreshColorPickr = () => {
    chrome.storage.sync.get(["themeConfig"], function (result) {
        let themeConfig = JSON.parse(result["themeConfig"])
        let elements = [
            "foreground",
            "background",
            // "cursor-text",
            // "cursor",
            "black",
            "black-light",
            "red",
            "red-light",
            "green",
            "green-light",
            "yellow",
            "yellow-light",
            "blue",
            "blue-light",
            "magenta",
            "magenta-light",
            "cyan",
            "cyan-light",
            "white",
            "white-light"
        ]

        let pickrObject = []
        elements.forEach((e) => {
            console.log(e, `.pickr-${e}`, themeConfig.base[`$${e}`])
            pickrObject.push(createPickrObject(e, `.pickr-${e}`, themeConfig.base[`$${e}`]))
        })


        for (let key in themeConfig.specialCase) {
            for (let attributeKey in themeConfig.specialCase[key]) {
                let id = 'S' + btoa(key) + '-' + attributeKey
                console.log(id)
                console.log(`.pickr-${id}`)
                console.log(themeConfig.specialCase[key][attributeKey])
                let html = `<div class="col-7" style="white-space:nowrap;">
                                ${key}-${attributeKey}
                            </div>
                            <div class="col-5 text-right">
                                <div class="pickr-${id}"></div>
                            </div>`
                let newColorRow = document.createElement('div')
                newColorRow.className = "row mt-2 d-flex align-items-center"
                newColorRow.innerHTML = html
                document.querySelector("#special-color-picker").appendChild(newColorRow)
                pickrObject.push(createPickrObject(id, `.pickr-${id}`, themeConfig.specialCase[key][attributeKey]))
            }
        }
    })
}

let themeJSONFileMap = {
    "無": "PTT.json",
    "Solarized Dark PTT 優化版": "Solarized Dark PTT.json",
    "Apple Terminal": "Apple Terminal.json",
    "Argonaut": "Argonaut.json",
    "Birds Of Paradise": "Birds Of Paradise.json",
    "Blazer": "Blazer.json",
    "Chalkboard": "Chalkboard.json",
    "Ciapre": "Ciapre.json",
    "Dark Pastel": "Dark Pastel.json",
    "Desert": "Desert.json",
    "Espresso": "Espresso.json",
    "Fish Of Paradise": "Fish Of Paradise.json",
    "Fish Tank": "Fish Tank.json",
    "Grass": "Grass.json",
    "Highway": "Highway.json",
    "Homebrew": "Homebrew.json",
    "Hurtado": "Hurtado.json",
    "Ic Green Ppl": "Ic Green Ppl.json",
    "Idletoes": "Idletoes.json",
    "Igvita Desert": "Igvita Desert.json",
    "Igvita Light": "Igvita Light.json",
    "Invisibone": "Invisibone.json",
    "Kibble": "Kibble.json",
    "Liquid Carbon Transparent Inverse": "Liquid Carbon Transparent Inverse.json",
    "Liquid Carbon Transparent": "Liquid Carbon Transparent.json",
    "Liquid Carbon": "Liquid Carbon.json",
    "Man Page": "Man Page.json",
    "Mariana": "Mariana.json",
    "Monokai Dimmed": "Monokai Dimmed.json",
    "Monokai Soda": "Monokai Soda.json",
    "Monokai Stevelosh": "Monokai Stevelosh.json",
    "Neopolitan": "Neopolitan.json",
    "Novel": "Novel.json",
    "Ocean": "Ocean.json",
    "Papirus Dark": "Papirus Dark.json",
    "Pro": "Pro.json",
    "Red Sands": "Red Sands.json",
    "Seafoam Pastel": "Seafoam Pastel.json",
    "Solarized Darcula": "Solarized Darcula.json",
    "Solarized Dark": "Solarized Dark.json",
    "Solarized Light": "Solarized Light.json",
    "Sundried": "Sundried.json",
    "Sympfonic": "Sympfonic.json",
    "Teerb": "Teerb.json",
    "Terminal Basic": "Terminal Basic.json",
    "Thayer": "Thayer.json",
    "Tomorrow Night": "Tomorrow Night.json",
    "Tomorrow": "Tomorrow.json",
    "Twilight": "Twilight.json",
    "Vaughn": "Vaughn.json",
    "X Dotshare": "X Dotshare.json",
    "Zenburn": "Zenburn.json",
    "github": "github.json"
}

refreshColorPickr()
let activeThemeItem
let themeSelectionDropdown = document.getElementById("theme-selection-dropdown")
chrome.storage.sync.get(["themeName"], function (result) {
    let currentThemeName = result["themeName"]
    if (currentThemeName === undefined) {
        themeSelectionDropdown.innerText = "無";
    } else {
        themeSelectionDropdown.innerText = currentThemeName;
    }

    let themeSelectionDropdownItemContainer = document.getElementById("theme-selection-dropdown-item-container")
    for (let key in themeJSONFileMap) {
        let item = document.createElement("a")
        item.setAttribute("class", "dropdown-item theme-selection-dropdown-item")
        item.setAttribute("theme-json-file", themeJSONFileMap[key])
        item.setAttribute("href", "#")
        if (key == currentThemeName) {
            item.classList.add("active")
            activeThemeItem = item
        }

        item.innerText = key

        item.onclick = () => {
            chrome.storage.sync.set({ "themeName": key })
            chrome.storage.sync.set({ "themeJSONFile": themeJSONFileMap[key] })

            location.reload();
        }

        themeSelectionDropdownItemContainer.appendChild(item)
    }
})