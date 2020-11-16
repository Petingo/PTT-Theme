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
const SP_COLOR_LIST = "SP_COLOR_LIST"   // ["--q2b3-color", "--q2b3-bg-color"...]
const SP_COLOR_CSS_KEY = "SP_COLOR_CSS_KEY"      // [".q2.b3", ...]
const SP_BG_COLOR_CSS_KEY = "SP_BG_COLOR_CSS_KEY"// [".q2.b3", ...]

function makeVisible(id) {
    let el = document.getElementById(id)
    if (el != null)
        el.style.visibility = "visible"
}

function makeHidden(id) {
    let el = document.getElementById(id)
    if (el != null)
        el.style.visibility = "hidden"
}

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

    let spColorList = []    // ["--q2b3-color", "--q2b3-bg-color"...]
    let spColorKey = []     // [".q2.b3", ...]
    let spBgColorKey = []   // [".q2.b3", ...]
    for (let color of config["specialCase"]) {
        if (color.hasOwnProperty("color")) {
            let varName = `--q${color.q}b${color.b}-color`
            console.log("meow", varName)
            chrome.storage.local.set({
                [varName]: color["color"], 
                [varName + "-theme-def"]: color["color"]
            })
            spColorList.push(varName)
            spColorKey.push(`.q${color.q}.b${color.b}`)
        }
        if (color.hasOwnProperty("bg-color")) {
            let varName = `--q${color.q}b${color.b}-bg-color`
            console.log("wooof", varName)
            chrome.storage.local.set({
                [varName]: color["bg-color"],
                [varName + "-theme-def"]: color["color"]
            })
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
        console.log('changed!!', specialStyle)
        for (let key in changes) {
            console.log("changed key:", key, "val", changes[key])
            console.log("listener:", key, changes[key].newValue)

            let colorKeyRE = /--.*/
            let spColorKeyRE = /--q[0-9]*b[0-9]*-color/
            let spBgColorKeyRE = /--q[0-9]*b[0-9]*-bg-color/
            
            if (spBgColorKeyRE.test(key)) {
                let t = key.match(/[0-9]+/g)
                let q = t[0]
                let b = t[1] 
                console.log("special background key:", q, b)
                makeVisible(`dot-q${q}b${b}`)
                document.documentElement.style.setProperty(key, changes[key].newValue);

                let cssKey = `.q${q}.b${b}`
                if (changes[key].newValue != undefined) {
                    chrome.storage.local.get([SP_COLOR_LIST, SP_BG_COLOR_CSS_KEY], r => {
                        let spColorList = r[SP_COLOR_LIST]
                        if(spColorList.indexOf(key) == -1){
                            spColorList.push(key)

                            insertBgColorRule(cssKey, cssRuleCounter++, specialStyle)

                            let spBgColorCSSKey = r[SP_BG_COLOR_CSS_KEY]
                            spBgColorCSSKey.push(cssKey)
    
                            chrome.storage.local.set({
                                [SP_COLOR_LIST]: spColorList,
                                [SP_BG_COLOR_CSS_KEY]: spBgColorCSSKey
                            })
                        }
                    })
                } else {
                    removeBgColorRule(cssKey, specialStyle)
                    chrome.storage.local.get([SP_COLOR_LIST, SP_BG_COLOR_CSS_KEY], r => {
                        let spColorList = r[SP_COLOR_LIST]
                        spColorList.splice(spColorList.indexOf(key), 1);
                        if(spColorList.indexOf(`--q${q}b${b}-color`) == -1){
                            makeHidden(`dot-q${q}b${b}`)
                        }

                        let spBgColorCSSKey = r[SP_BG_COLOR_CSS_KEY]
                        spBgColorCSSKey.splice(spBgColorCSSKey.indexOf(cssKey), 1);

                        chrome.storage.local.set({
                            [SP_COLOR_LIST]: spColorList,
                            [SP_BG_COLOR_CSS_KEY]: spBgColorCSSKey
                        })
                    })
                }
            } else if (spColorKeyRE.test(key)) {
                let t = key.match(/[0-9]+/g)
                let q = t[0]
                let b = t[1]
                document.documentElement.style.setProperty(key, changes[key].newValue);
                console.log("special background key:", q, b)
                
                let cssKey = `.q${q}.b${b}`
                if (changes[key].newValue != undefined) {
                    makeVisible(`dot-q${q}b${b}`)
                    chrome.storage.local.get([SP_COLOR_LIST, SP_COLOR_CSS_KEY], r => {
                        let spColorList = r[SP_COLOR_LIST]
                        if(spColorList.indexOf(key) == -1){
                            insertColorRule(cssKey, cssRuleCounter++, specialStyle)
    
                            spColorList.push(key)
    
                            let spColorCSSKey = r[SP_COLOR_CSS_KEY]
                            spColorCSSKey.push(cssKey)
    
                            chrome.storage.local.set({
                                [SP_COLOR_LIST]: spColorList,
                                [SP_COLOR_CSS_KEY]: spColorCSSKey
                            })
                        }
                    })
                } else {
                    removeColorRule(cssKey, specialStyle)
                    chrome.storage.local.get([SP_COLOR_LIST, SP_COLOR_CSS_KEY], r => {
                        
                        let spColorList = r[SP_COLOR_LIST]
                        spColorList.splice(spColorList.indexOf(key), 1);
                        if(spColorList.indexOf(`--q${q}b${b}-bg-color`) == -1){
                            makeHidden(`dot-q${q}b${b}`)
                        }

                        let spColorCSSKey = r[SP_COLOR_CSS_KEY]
                        spColorCSSKey.splice(spColorCSSKey.indexOf(cssKey), 1);
                        
                        chrome.storage.local.set({
                            [SP_COLOR_LIST]: spColorList,
                            [SP_COLOR_CSS_KEY]: spColorCSSKey
                        })
                    })
                }

            } else if (colorKeyRE.test(key)) {
                if (changes[key].newValue != undefined) {
                    document.documentElement.style.setProperty(key, changes[key].newValue);
                    console.log(key, changes[key].newValue)
                }
            }
        }

    })
}

let cssIdMap = {
    color: {},
    bgColor: {}
}

function insertColorRule(cssKey, id, cssStyle) {
    let t = cssKey.match(/[0-9]+/g)
    let cssRule = `
        ${cssKey}{
            color: var(--q${t[0]}b${t[1]}-color);
        }`
    if(cssIdMap.color[cssKey] === undefined){
        cssIdMap.color[cssKey] = []
    }
    id = cssStyle.sheet.cssRules.length
    cssStyle.sheet.insertRule(cssRule, id)
    cssIdMap.color[cssKey].push(id)
    console.log("add new style:", cssRule, id)
}

function insertBgColorRule(cssKey, id, cssStyle) {
    let t = cssKey.match(/[0-9]+/g)
    let cssRule = `
        ${cssKey}{
            background-color: var(--q${t[0]}b${t[1]}-bg-color);
        }`
    if(cssIdMap.bgColor[cssKey] === undefined){
        cssIdMap.bgColor[cssKey] = []
    }
    id = cssStyle.sheet.cssRules.length
    cssIdMap.bgColor[cssKey].push(id)
    cssStyle.sheet.insertRule(cssRule, id)
    console.log("add new style:", cssRule, id)
}

function removeBgColorRule(cssKey, cssStyle){
    console.log('remove css', cssKey, cssIdMap.bgColor[cssKey])
    console.log(cssStyle.sheet)
    let idList = cssIdMap.bgColor[cssKey].sort((a, b) => { return b-a })
    for(let id of idList){
        cssStyle.sheet.deleteRule(id)
    }
    console.log(cssStyle.sheet)
}

function removeColorRule(cssKey, cssStyle){
    console.log('remove css', cssKey, cssIdMap.color[cssKey])
    console.log(cssStyle.sheet)
    let idList = cssIdMap.color[cssKey].sort((a, b) => { return b-a })
    for(let id of idList){
        cssStyle.sheet.deleteRule(id)
    }
    console.log(cssStyle.sheet)
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

    // set sp color
    chrome.storage.local.get([SP_COLOR_LIST], r => {
        console.log(r[SP_COLOR_LIST])
        for (let spColorKey of r[SP_COLOR_LIST]) {
            let t = spColorKey.match(/[0-9]+/g)
            makeVisible(`dot-q${t[0]}b${t[1]}`)
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