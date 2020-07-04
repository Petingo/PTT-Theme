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
const SP_COLOR_CSS_KEY = "SP_COLOR_CSS_KEY"
const SP_BG_COLOR_CSS_KEY = "SP_BG_COLOR_CSS_KEY"

let loadJSONConfig = async function(theme, refresh = false) {
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

    let spColorList = [] // ["--q2b3-color", ...]
    let spColorKey = [] // [".q2.b3", ...]
    let spBgColorKey = [] // [".q2.b3", ...]
    for (let color of config["specialCase"]) {
        if (color.hasOwnProperty("color")) {
            let varName = `--q${color.q}b${color.b}-color`
            chrome.storage.local.set({
                    [varName]: color["color"]
                })
                // console.log({
                //     [varName]: color["color"]
                // })
            spColorList.push(varName)
            spColorKey.push(`.q${color.q}.b${color.b}`)
        }
        if (color.hasOwnProperty("bg-color")) {
            let varName = `--q${color.q}b${color.b}-bg-color`
            chrome.storage.local.set({
                    [varName]: color["bg-color"]
                })
                // console.log({
                //     [varName]: color["bg-color"]
                // })
            spColorList.push(varName)
            spBgColorKey.push(`.q${color.q}.b${color.b}`)
        }
    }
    chrome.storage.local.set({
        [SP_COLOR_LIST]: spColorList,
        [SP_COLOR_CSS_KEY]: spColorKey,
        [SP_BG_COLOR_CSS_KEY]: spBgColorKey
    }, () => {
        if (refresh) {
            location.reload();
        }
    })
}

let addOnChangeListener = () => {
    chrome.storage.onChanged.addListener(async function(changes, namespace) {
        let specialStyle = document.getElementById("special-style")
        console.log(specialStyle)
        for (let key in changes) {
            console.log(key, changes[key].newValue)
            console.log(key, changes[key].oldValue)

            let colorKeyRE = /--.*/
            let spColorKeyRE = /--q[0-9]*b[0-9]*-color/
            let spBgColorKeyRE = /--q[0-9]*b[0-9]*-bg-color/

            if (spBgColorKeyRE.test(key)) {
                let t = key.match(/[0-9]+/g)[0]
                let q = t[0]
                let b = t[1]
                document.documentElement.style.setProperty(key, changes[key].newValue);

                if (changes[key].oldValue === undefined) {
                    let cssKey = `.q${q}.b${b}`
                    insertBgColorRule(cssKey, cssRuleCounter++, specialStyle)

                    chrome.storage.local.get([SP_COLOR_LIST, SP_BG_COLOR_CSS_KEY], r => {

                        let spColorList = r[SP_COLOR_LIST]
                        spColorList.push(key)

                        let spBgColorCSSKey = r[SP_BG_COLOR_CSS_KEY]
                        spBgColorCSSKey.push(cssKey)

                        chrome.storage.local.set({
                            [SP_COLOR_LIST]: spColorList,
                            [SP_BG_COLOR_CSS_KEY]: spBgColorCSSKey
                        })
                    })
                }
            } else if (spColorKeyRE.test(key)) {
                let t = key.match(/[0-9]+/g)[0]
                let q = t[0]
                let b = t[1]
                document.documentElement.style.setProperty(key, changes[key].newValue);

                if (changes[key].oldValue === undefined) {
                    let cssKey = `.q${q}.b${b}`
                    insertColorRule(cssKey, cssRuleCounter++, specialStyle)

                    chrome.storage.local.get([SP_COLOR_LIST, SP_COLOR_CSS_KEY], r => {

                        let spColorList = r[SP_COLOR_LIST]
                        spColorList.push(key)

                        let spColorCSSKey = r[SP_COLOR_CSS_KEY]
                        spColorCSSKey.push(cssKey)

                        chrome.storage.local.set({
                            [SP_COLOR_LIST]: spColorList,
                            [SP_COLOR_CSS_KEY]: spColorCSSKey
                        })
                    })
                }

            } else if (colorKeyRE.test(key)) {
                document.documentElement.style.setProperty(key, changes[key].newValue);
                console.log(key, changes[key].newValue)
            }
        }

    })
}

function insertColorRule(cssKey, id, cssStyle) {
    let t = cssKey.match(/[0-9]+/g)
    let cssRule = `
        ${cssKey}{
            color: var(--q${t[0]}b${t[1]}-color); !important
        }`
    cssStyle.sheet.insertRule(cssRule, id)
    console.log("add new style:", cssRule, id)
}

function insertBgColorRule(cssKey, id, cssStyle) {
    let t = cssKey.match(/[0-9]+/g)
    let cssRule = `
        ${cssKey}{
            background-color: var(--q${t[0]}b${t[1]}-bg-color); !important
        }`
    cssStyle.sheet.insertRule(cssRule, id)
    console.log("add new style:", cssRule, id)
}

let cssRuleCounter = 0
let setColor = () => {
    // special color
    // add CSS style sheet interface
    let specialStyle = document.createElement("style")
    specialStyle.type = "text/css"
    specialStyle.id = "special-style"
    document.head.appendChild(specialStyle)

    addOnChangeListener()

    chrome.storage.local.get([SP_COLOR_CSS_KEY, SP_BG_COLOR_CSS_KEY], r => {
        for (let key of r[SP_COLOR_CSS_KEY]) {
            insertColorRule(key, cssRuleCounter++, specialStyle, specialStyle)
        }
        for (let key of r[SP_BG_COLOR_CSS_KEY]) {
            insertBgColorRule(key, cssRuleCounter++, specialStyle, specialStyle)
        }
    })

    // set color
    chrome.storage.local.get([SP_COLOR_LIST], r => {
        for (let spColorKey of r[SP_COLOR_LIST]) {
            chrome.storage.local.get([spColorKey], r => {
                document.documentElement.style.setProperty(spColorKey, r[spColorKey]);
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