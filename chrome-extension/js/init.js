const themeJSONFileMap = {
    "PTT": "PTT.json",
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

const colors = [
    "--white",
    "--white-light",
    "--black",
    "--black-light",
    "--red",
    "--red-light",
    "--green",
    "--green-light",
    "--yellow",
    "--yellow-light",
    "--blue",
    "--blue-light",
    "--magenta",
    "--magenta-light",
    "--cyan",
    "--cyan-light"
]

const BASE_THEME = "BASE_THEME"
const SP_COLOR_LIST = "SP_COLOR_LIST"
const SP_COLOR_KEY = "SP_COLOR_KEY"
const SP_BG_COLOR_KEY = "SP_BG_COLOR_KEY"

let loadJSONConfig = async function(theme, refresh = false) {
    console.log("meow")
    let themeJSONFile = themeJSONFileMap[theme]
    let config = await JSON.parse(await fetch(chrome.extension.getURL(`/theme/${themeJSONFile}`)).then((response) => {
        return response.text()
    }))

    // update BASE_THEME_JSON
    chrome.storage.local.set({
        [BASE_THEME]: theme
    })

    // update base colors
    for (let color in config["base"]) {
        chrome.storage.local.set({
            [color]: config["base"][color]
        })
    }

    // TODO: update special colors
    // remove old
    chrome.storage.local.get([SP_COLOR_LIST], r => {
        if (r[SP_COLOR_LIST] != undefined) {
            for (let sc of r[SP_COLOR_LIST]) {
                chrome.storage.local.remove(sc)
            }
        }
    })
    let spColorList = []
    let spColorKey = []
    let spBgColorKey = []
    for (let color of config["specialCase"]) {
        if (color.hasOwnProperty("color")) {
            let varName = `--q${color.q}b${color.b}-color`
            chrome.storage.local.set({
                [varName]: color["color"]
            })
            console.log({
                [varName]: color["color"]
            })
            spColorList.push(varName)
            spColorKey.push(`.q${color.q}.b${color.b}`)
        }
        if (color.hasOwnProperty("bg-color")) {
            let varName = `--q${color.q}b${color.b}-bg-color`
            chrome.storage.local.set({
                [varName]: color["bg-color"]
            })
            console.log({
                [varName]: color["bg-color"]
            })
            spColorList.push(varName)
            spBgColorKey.push(`.q${color.q}.b${color.b}`)
        }
    }
    chrome.storage.local.set({
        [SP_COLOR_LIST]: spColorList,
        [SP_COLOR_KEY]: spColorKey,
        [SP_BG_COLOR_KEY]: spBgColorKey
    }, () => {
        if (refresh) {
            location.reload();
        }
    })
}

let setColor = () => {
    // special color
    // add CSS style sheet interface
    let specialStyle = document.createElement("style")
    specialStyle.type = "text/css"
    document.head.appendChild(specialStyle)

    chrome.storage.local.get([SP_COLOR_KEY, SP_BG_COLOR_KEY], r => {
        let counter = 0
        for (let k of r[SP_COLOR_KEY]) {
            let t = k.split('.')
            let cssRule = `
                ${k}{
                    color: var(--${t[1]}${t[2]}-color);
                }`
            specialStyle.sheet.insertRule(cssRule, counter++)
        }
        for (let k of r[SP_BG_COLOR_KEY]) {
            let t = k.split('.')
            let cssRule = `
                ${k}{
                    background-color: var(--${t[1]}${t[2]}-bg-color);
                }`
            specialStyle.sheet.insertRule(cssRule, counter++)
        }
    })

    // set color
    chrome.storage.local.get([SP_COLOR_LIST], r => {
        for (let sc of r[SP_COLOR_LIST]) {
            chrome.storage.local.get([sc], r => {
                document.documentElement.style.setProperty(sc, r[sc]);
            })
        }
    })

    // base color
    chrome.storage.local.get(colors, r => {
        for (let color of colors) {
            document.documentElement.style.setProperty(color, r[color]);
        }
    })
}

// ensure it works in the first time
let init = async function() {
    chrome.storage.local.get([BASE_THEME], r => {
        if (r[BASE_THEME] === undefined) {
            loadJSONConfig("PTT")
            setColor()
        } else {
            setColor()
        }
    })
}

init()