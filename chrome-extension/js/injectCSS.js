function injectCSS() {
    let themeCSS = document.createElement("link")
    themeCSS.setAttribute("id", "customTheme")
    themeCSS.setAttribute("rel", "stylesheet")
    themeCSS.setAttribute("type", "text/css")
    themeCSS.setAttribute("href", chrome.extension.getURL(`/css/template.css`))

    let head = document.getElementsByTagName("body")[0]
    head.append(themeCSS)

    console.log("injectCSS")
}

injectCSS()