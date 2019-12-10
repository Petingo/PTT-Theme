let jsonToCSS = async function (themeConfig) {
    let css = await fetch(chrome.extension.getURL(`theme/template`)).then((response) => { return response.text() })
    let keyList = []
    for (let key in themeConfig.base) {
        keyList.push(key)
    }
    keyList.sort((a, b) => { return b.length - a.length })
    for (let key of keyList) {
        css = css.replace(new RegExp(`\\${key}`, "g"), themeConfig.base[key])
    }
    for (let key in themeConfig.specialCase) {
        let attributes=""
        for (let attributeKey in themeConfig.specialCase[key]){
            attributes += `\n    ${attributeKey}: ${themeConfig.specialCase[key][attributeKey]};\n`
        }
        css = css + `\n${key} { ${attributes} }\n`
    }
    return css
}

let jsonToConfig = async function (themeJSONFile) {
    return JSON.parse(await fetch(chrome.extension.getURL(`theme/${themeJSONFile}`)).then((response) => { return response.text() }))
}

let changeImgPosition = () => {
    chrome.storage.sync.get(["imgPositionOption"], function (result) {
        let imgPositionOption = result["imgPositionOption"]
        
        console.log("imgPositionOption", imgPositionOption)

        if (imgPositionOption == undefined) {
            // none, makeCenterVertically, makeTopInside
            chrome.storage.sync.set({ "imgPositionOption": "makeCenterVertically" })
            imgPositionOption = "makeCenterVertically"
        }

        // image position
        let mainContainer
        let getMainContainerIntervalId = setInterval(() => {
            
            mainContainer = document.querySelector("#mainContainer")
            console.log(mainContainer)
            if (!(mainContainer == null)) {
                clearInterval(getMainContainerIntervalId)
                if (mainContainer) {
                    let makeTopInside = function (element) {
                        if (Number(element.style["top"].replace("px", "")) < 20) {
                            console.log(element.style["top"])
                            element.style["top"] = "20px"
                        }
                    }

                    let makeCenterVertically = function (element) {
                        console.log(element.style["top"])
                        element.style["top"] = "0"
                        element.style["bottom"] = "1em"
                        element.style["margin"] = "auto"
                    }

                    let adjust = function (element) {
                        console.log("adjust!!!")
                        console.log(imgPositionOption)
                        if (imgPositionOption == "makeCenterVertically") {
                            console.log("center")
                            makeCenterVertically(element)
                        } else if (imgPositionOption == "makeTopInside") {
                            console.log("top")
                            makeTopInside(element)
                        }
                    }

                    mainContainer.arrive("img", function () {
                        let t = this
                        let styleObserver = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutationRecord) {
                                adjust(t)
                            })
                        })

                        adjust(this)
                        styleObserver.observe(this, { attributes: true, attributeFilter: ['style'] })
                    })
                }
            }
        }, 50)
    })
}

let customThemeIdCounter = 0;
let refreshTheme = async (themeConfig) => {
    let oldThemeCSS = document.getElementById(`customTheme${customThemeIdCounter}`)
    let head = document.getElementsByTagName("head")[0]

    let css = await jsonToCSS(themeConfig)

    let themeCSS = document.createElement("style")
    themeCSS.setAttribute("id", `customTheme${++customThemeIdCounter}`)
    themeCSS.textContent = css

    head.appendChild(themeCSS)

    if (oldThemeCSS != null) {
        head.removeChild(oldThemeCSS)
    }
}

chrome.storage.onChanged.addListener(async function (changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key]

        // console.log('Storage key "%s" in namespace "%s" changed. ' +
        //     'Old value was "%s", new value is "%s".',
        //     key,
        //     namespace,
        //     storageChange.oldValue,
        //     storageChange.newValue)

        if (key == "themeJSONFile") {
            jsonToConfig(storageChange.newValue)
                .then((result) => {
                    chrome.storage.sync.set({ "themeConfig": JSON.stringify(result) })
                })
        }
        if (key == "themeConfig") {
            // console.log("refresh theme")
            refreshTheme(JSON.parse(storageChange.newValue))
        }
    }
})

chrome.storage.sync.get(["themeConfig"], function (result) {
    let themeConfigJSON = result["themeConfig"]
    if (themeConfigJSON == undefined) {
        chrome.storage.sync.set({ "themeJSONFile": "PTT.json" })
    } else {
        refreshTheme(JSON.parse(themeConfigJSON))
    }
})

changeImgPosition()