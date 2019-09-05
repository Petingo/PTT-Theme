const imgPositionOption = {
    "none": "none",
    "makeCenterVertically": "makeCenterVertically",
    "makeTopInside": "makeTopInside"
}
const config = {
    "imgPositionSetting": imgPositionOption.makeCenterVertically
}

function init(themeFilename) {
    // clear original font setting
    // let mainDiv;
    // let getMainDivIntervalId = setInterval(() => {
    //     mainDiv = document.getElementsByClassName("main")[0]
    //     if (!(mainDiv === undefined)) {
    //         clearInterval(getMainDivIntervalId)

    //         mainDiv.style["font-family"] = ""
    //     }
    // }, 50)

    // let cursorDiv;
    // let getCursorDivIntervalId = setInterval(() => {
    //     cursorDiv = document.getElementById("cursor")
    //     if (!(cursorDiv === undefined)) {
    //         clearInterval(getCursorDivIntervalId)

    //         mainDiv.style["color"] = ""
    //     }
    // }, 50)

    // inject CSS
    let themeCSS = document.createElement("link");
    themeCSS.setAttribute("id", "customTheme")
    themeCSS.setAttribute("rel", "stylesheet")
    themeCSS.setAttribute("type", "text/css")
    themeCSS.setAttribute("href", chrome.extension.getURL(`theme/${themeFilename}`))

    let otherCSS = document.createElement("link");
    otherCSS.setAttribute("id", "customOther")
    otherCSS.setAttribute("rel", "stylesheet")
    otherCSS.setAttribute("type", "text/css")
    otherCSS.setAttribute("href", chrome.extension.getURL('theme/other.css'))

    let head = document.getElementsByTagName("body")[0]
    head.append(themeCSS)
    head.append(otherCSS)

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
                    console.log("adjust", config.imgPositionSetting)
                    if (config.imgPositionSetting == imgPositionOption.makeCenterVertically) {
                        makeCenterVertically(element)
                    } else if (config.imgPositionSetting == imgPositionOption.makeTopInside) {
                        makeTopInside(element)
                    }
                }

                mainContainer.arrive("img", function () {
                    let t = this
                    let styleObserver = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutationRecord) {
                            adjust(t)
                        });
                    });

                    adjust(this)
                    styleObserver.observe(this, { attributes: true, attributeFilter: ['style'] });
                })
            }
        }
    }, 50)
}

function refresh(themeFilename){
    let oldThemeCSS = getElementById("customTheme")
    let oldOtherCSS = getElementById("customOther")
    head.removeChild(oldThemeCSS)
    head.removeChild(oldOtherCSS)

    init(themeFilename)
}

init("Solarized-Dark-Custom.css")