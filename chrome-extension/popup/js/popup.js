function createPickrObject(el, defaultColor) {
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
    }).on('change', instance => {
        console.log('clear', instance);
    })

    return pickr
}

let elements = [{
    el: ".pickr-foreground",
    defaultColor: "silver"
}, {
    el: ".pickr-background",
    defaultColor: "black"
}, {
    el: ".pickr-black",
    defaultColor: "black"
}, {
    el: ".pickr-black-light",
    defaultColor: "gray"
}, {
    el: ".pickr-red",
    defaultColor: "maroon"
}, {
    el: ".pickr-red-light",
    defaultColor: "red"
}
]

let pickrObject = []
elements.forEach((e) => {
    console.log(e)
    pickrObject.push(createPickrObject(e.el, e.defaultColor))
})

document.querySelectorAll(".img-position-selection-dropdown-item").forEach((element) => {
    element.onclick = () => {
        let imgPositionOption = element.getAttribute("img-position-option")
        chrome.storage.sync.set({ "imgPositionOption": imgPositionOption });
    }
})

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
        if(key == currentThemeName){
            item.classList.add("active")
            activeThemeItem = item
        }

        item.innerText = key

        item.onclick = () => {
            chrome.storage.sync.set({ "themeName": key })
            chrome.storage.sync.set({ "themeJSONFile": themeJSONFileMap[key] })
            themeSelectionDropdown.innerText = key

            activeThemeItem.classList.remove("active")
            activeThemeItem = item
            activeThemeItem.classList.add("active")
        }

        themeSelectionDropdownItemContainer.appendChild(item)
    }
})