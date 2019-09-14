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

// let themeSelectionDropdownItem = $(".theme-selection-dropdown-item")
// for(let i = 0 ; i<themeSelectionDropdownItem.length ; i++){
//     let item = themeSelectionDropdownItem[i]
//     console.log(item)
//     item.onclick = function(){
//         console.log(item)
//     }
// }

// document.querySelectorAll(".theme-selection-dropdown-item").forEach((element) => {
//     element.onclick = () => {

//     }
// })

document.querySelectorAll(".img-position-selection-dropdown-item").forEach((element) => {
    element.onclick = () => {
        let imgPositionOption = element.getAttribute("img-position-option")
        chrome.storage.sync.set({ "imgPositionOption": imgPositionOption });
    }
})

let themeCSSFileMap = {
    "無": "Classic.css",
    "Solarized Dark PTT 優化版": "Solarized Dark PTT.css",
    "Solarized Light PTT 優化版": "Solarized Light PTT.css",
    "Apple Terminal": "Apple Terminal.css",
    "Argonaut": "Argonaut.css",
    "Birds Of Paradise": "Birds Of Paradise.css",
    "Blazer": "Blazer.css",
    "Chalkboard": "Chalkboard.css",
    "Ciapre": "Ciapre.css",
    "Dark Pastel": "Dark Pastel.css",
    "Desert": "Desert.css",
    "Espresso": "Espresso.css",
    "Fish Of Paradise": "Fish Of Paradise.css",
    "Fish Tank": "Fish Tank.css",
    "Grass": "Grass.css",
    "Highway": "Highway.css",
    "Homebrew": "Homebrew.css",
    "Hurtado": "Hurtado.css",
    "Ic Green Ppl": "Ic Green Ppl.css",
    "Idletoes": "Idletoes.css",
    "Igvita Desert": "Igvita Desert.css",
    "Igvita Light": "Igvita Light.css",
    "Invisibone": "Invisibone.css",
    "Kibble": "Kibble.css",
    "Liquid Carbon Transparent Inverse": "Liquid Carbon Transparent Inverse.css",
    "Liquid Carbon Transparent": "Liquid Carbon Transparent.css",
    "Liquid Carbon": "Liquid Carbon.css",
    "Man Page": "Man Page.css",
    "Mariana": "Mariana.css",
    "Monokai Dimmed": "Monokai Dimmed.css",
    "Monokai Soda": "Monokai Soda.css",
    "Monokai Stevelosh": "Monokai Stevelosh.css",
    "Neopolitan": "Neopolitan.css",
    "Novel": "Novel.css",
    "Ocean": "Ocean.css",
    "Papirus Dark": "Papirus Dark.css",
    "Pro": "Pro.css",
    "Red Sands": "Red Sands.css",
    "Seafoam Pastel": "Seafoam Pastel.css",
    "Solarized Darcula": "Solarized Darcula.css",
    "Solarized Dark": "Solarized Dark.css",
    "Solarized Light": "Solarized Light.css",
    "Sundried": "Sundried.css",
    "Sympfonic": "Sympfonic.css",
    "Teerb": "Teerb.css",
    "Terminal Basic": "Terminal Basic.css",
    "Thayer": "Thayer.css",
    "Tomorrow Night": "Tomorrow Night.css",
    "Tomorrow": "Tomorrow.css",
    "Twilight": "Twilight.css",
    "Vaughn": "Vaughn.css",
    "X Dotshare": "X Dotshare.css",
    "Zenburn": "Zenburn.css",
    "github": "github.css"
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
    for (let key in themeCSSFileMap) {
        let item = document.createElement("a")
        item.setAttribute("class", "dropdown-item theme-selection-dropdown-item")
        item.setAttribute("theme-css-file", themeCSSFileMap[key])
        item.setAttribute("href", "#")
        if(key == currentThemeName){
            item.classList.add("active")
            activeThemeItem = item
        }

        item.innerText = key

        item.onclick = () => {
            chrome.storage.sync.set({ "themeName": key })
            chrome.storage.sync.set({ "themeCSSFile": themeCSSFileMap[key] })
            themeSelectionDropdown.innerText = key

            activeThemeItem.classList.remove("active")
            activeThemeItem = item
            activeThemeItem.classList.add("active")
        }

        themeSelectionDropdownItemContainer.appendChild(item)
    }
})




