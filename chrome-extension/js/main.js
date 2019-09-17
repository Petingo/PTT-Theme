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
        css = css + `\n${key} {\n    ${themeConfig.specialCase[key]}\n}\n`
    }
    return css
}

let jsonToConfig = async function (themeJSONFile) {
    return JSON.parse(await fetch(chrome.extension.getURL(`theme/${themeJSONFile}`)).then((response) => { return response.text() }))
}

let changeImgPosition = () => {
    chrome.storage.sync.get(["imgPositionOption"], function (result) {
        let imgPositionOption = result["imgPositionOption"]
        if (imgPositionOption === undefined) {
            // none, makeCenterVertically, makeTopInside
            chrome.storage.sync.set({ "imgPositionOption": "makeCenterVertically" })
            imgPositionOption = "makeCenterVertically"
        }

        // image position
        let mainContainer
        let getMainContainerIntervalId = setInterval(() => {
            mainContainer = document.getElementById('mainContainer')
            if (!(mainContainer === undefined)) {
                clearInterval(getMainContainerIntervalId)
                if (mainContainer) {
                    let makeTopInside = function (element) {
                        if (Number(element.style["top"].replace("px", "")) < 20) {
                            element.style["top"] = "20px"
                        }
                    }

                    let makeCenterVertically = function (element) {
                        element.style["top"] = "0"
                        element.style["bottom"] = "1em"
                        element.style["margin"] = "auto"
                    }

                    let adjust = function (element) {
                        if (imgPositionOption == "makeCenterVertically") {
                            makeCenterVertically(element)
                        } else if (imgPositionOption == "makeTopInside") {
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

let refreshTheme = async (themeConfig) => {
    let oldThemeCSS = document.getElementById("customTheme")
    let head = document.getElementsByTagName("head")[0]

    if (oldThemeCSS != null) {
        head.removeChild(oldThemeCSS)
    }

    let css = await jsonToCSS(themeConfig)

    let themeCSS = document.createElement("style")
    themeCSS.setAttribute("id", "customTheme")
    themeCSS.textContent = css

    head.appendChild(themeCSS)
}

chrome.storage.onChanged.addListener(async function (changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key]

        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue)

        if (key == "themeJSONFile") {
            jsonToConfig(storageChange.newValue).then((result) => { refreshTheme(result) })
        }
    }
})

chrome.storage.sync.get(["themeJSONFile"], function (result) {
    let themeJSONFile = result["themeJSONFile"]
    if (themeJSONFile == undefined) {
        chrome.storage.sync.set({ "themeJSONFile": "PTT.json" })
    } else {
        jsonToConfig(themeJSONFile).then((result) => { refreshTheme(result) })
    }
})