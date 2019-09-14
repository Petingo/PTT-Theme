let jsonToCSS = async function (themeConfig) {
    let css = await fetch(chrome.extension.getURL(`theme/template`)).then((response) => { return response.text() })
    let keyList = []
    for (let key in themeConfig.base) {
        keyList.push(key)
    }
    keyList.sort((a, b) => { return b.length - a.length})
    for (let key of keyList) {
        css = css.replace(new RegExp(`\\${key}`, "g"), themeConfig.base[key])
    }
    for (let key in themeConfig.specialCase) {
        css = css + `\n${key} {\n    ${themeConfig.specialCase[key]}\n}\n`
    }
    return css
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
    console.log("refreshTheme")
    let oldThemeCSS = document.getElementById("customTheme")
    console.log(oldThemeCSS)
    let head = document.getElementsByTagName("head")[0]

    if (oldThemeCSS != null) {    
        head.removeChild(oldThemeCSS)
    }

    let css = await jsonToCSS(themeConfig)
    console.log(css)

    let themeCSS = document.createElement("style")
    themeCSS.setAttribute("id", "customTheme")
    themeCSS.textContent = css

    head.appendChild(themeCSS)
    console.log("append CSS succeed")
}

let themeConfig = `
{
    "base": {
        "$foreground": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%)",
        "$foregroundLight": "hsl(180, 6.930693069306934%, 60.3921568627451%)",
        "$background": "hsl(192.22222222222223, 100%, 10.588235294117647%)",
        "$backgroundLight": "hsl(192.20338983050848, 80.82191780821917%, 14.31372549019608%)",
        "$cursorText": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%)",
        "$cursor": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%)",
        "$black": "hsl(192.22222222222223, 100%, 10.588235294117647%)",
        "$blackLight": "hsl(192.20338983050848, 80.82191780821917%, 14.31372549019608%)",
        "$red": "hsl(1.0404624277456633, 71.19341563786008%, 40.27149321266969%)",
        "$redLight": "hsl(1.0404624277456633, 71.19341563786008%, 52.352941176470594%)",
        "$green": "hsl(67.84313725490196, 100%, 30%)",
        "$greenLight": "hsl(67.84313725490196, 100%, 39%)",
        "$yellow": "hsl(45.414364640883974, 100%, 35.490196078431374%)",
        "$yellowLight": "hsl(45.414364640883974, 100%, 46.13725490196079%)",
        "$blue": "hsl(204.7674418604651, 69.35483870967741%, 37.40573152337858%)",
        "$blueLight": "hsl(204.7674418604651, 69.35483870967741%, 48.627450980392155%)",
        "$magenta": "hsl(330.95541401273886, 64.08163265306122%, 39.96983408748114%)",
        "$magentaLight": "hsl(330.95541401273886, 64.08163265306122%, 51.96078431372548%)",
        "$cyan": "hsl(175.46218487394958, 58.62068965517242%, 30.6184012066365%)",
        "$cyanLight": "hsl(175.46218487394958, 58.62068965517242%, 39.80392156862745%)",
        "$white": "hsl(45.59999999999999, 42.37288135593221%, 88.4313725490196%)",
        "$whiteLight": "hsl(43.846153846153854, 86.66666666666671%, 94.11764705882352%)"
    },
    "specialCase": {
        ".q7.b4": "color: #eee8d5",
        ".q4.b7": "background-color: #eee8d5",
        ".q8": "color: #495456",
        ".q4.b6": "color: #073642",
        ".q2.b7": "color: #adc700"
    }
}
`

refreshTheme(JSON.parse(themeConfig))

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key]
        if (key == "themeConfig") {
            refreshTheme(storageChange)
        }
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue)

        console.log("refresh")
        //refreshTheme()
    }
})