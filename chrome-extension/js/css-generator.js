let themeConfig = JSON.parse(`
{
    "base": {
        "$foreground": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%);",
        "$foreground-light": "hsl(180, 6.930693069306934%, 60.3921568627451%);",
        "$background": "hsl(192.22222222222223, 100%, 10.588235294117647%);",
        "$background-light": "hsl(192.20338983050848, 80.82191780821917%, 14.31372549019608%);",
        "$cursor-text": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%);",
        "$cursor": "hsl(186.3157894736842, 8.296943231441055%, 55.09803921568628%);",
        "$black": "hsl(192.22222222222223, 100%, 10.588235294117647%);",
        "$black-light": "hsl(192.20338983050848, 80.82191780821917%, 14.31372549019608%);",
        "$red": "hsl(1.0404624277456633, 71.19341563786008%, 40.27149321266969%);",
        "$red-light": "hsl(1.0404624277456633, 71.19341563786008%, 52.352941176470594%);",
        "$green": "hsl(67.84313725490196, 100%, 30%);",
        "$green-light": "hsl(67.84313725490196, 100%, 39%);",
        "$yellow": "hsl(45.414364640883974, 100%, 35.490196078431374%);",
        "$yellow-light": "hsl(45.414364640883974, 100%, 46.13725490196079%);",
        "$blue": "hsl(204.7674418604651, 69.35483870967741%, 37.40573152337858%);",
        "$blue-light": "hsl(204.7674418604651, 69.35483870967741%, 48.627450980392155%);",
        "$magenta": "hsl(330.95541401273886, 64.08163265306122%, 39.96983408748114%);",
        "$magenta-light": "hsl(330.95541401273886, 64.08163265306122%, 51.96078431372548%);",
        "$cyan": "hsl(175.46218487394958, 58.62068965517242%, 30.6184012066365%);",
        "$cyan-light": "hsl(175.46218487394958, 58.62068965517242%, 39.80392156862745%);",
        "$white": "hsl(45.59999999999999, 42.37288135593221%, 88.4313725490196%);",
        "$white-light": "hsl(43.846153846153854, 86.66666666666671%, 94.11764705882352%);"
    },
    "specialCase": {
        ".q7.b4": "color: #eee8d5;",
        ".q4.b7": "background-color: #eee8d5;",
        ".q8": "color: #495456;",
        ".q4.b6": "color: #073642;",
        ".q2.b7": "color: #adc700;"
    }
}
`)

let jsonToCSS = async function (themeConfig) {
    let css = await fetch(chrome.extension.getURL(`theme/template`)).then((response) => { return response.text() })
    for (let key in themeConfig.base) {
        css = css.replace(new RegExp(key, "g"), themeConfig.base[key])
    }
    for (let key in themeConfig.specialCase){
        css = css + `\n${key} {\n    ${themeConfig.specialCase[key]}\n}\n`
    }
    return css
}

jsonToCSS(themeConfig).then(res => {console.log(res)});