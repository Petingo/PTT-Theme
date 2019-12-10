// let jsonToCSS = async function (themeConfig) {
//     let css = await fetch(chrome.extension.getURL(`theme/template`)).then((response) => { return response.text() })
//     let keyList = []
//     for (let key in themeConfig.base) {
//         keyList.push(key)
//     }
//     keyList.sort((a, b) => { return b.length - a.length })
//     for (let key of keyList) {
//         css = css.replace(new RegExp(`\\${key}`, "g"), themeConfig.base[key])
//     }
//     for (let key in themeConfig.specialCase) {
//         console.log(themeConfig.specialCase[key])
//         css = css + `\n${key} {\n    ${themeConfig.specialCase[key]}\n}\n`
//     }
//     return css
// }

// jsonToCSS(themeConfig).then(res => {console.log(res)});