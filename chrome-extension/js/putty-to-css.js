let puttyConfigFile = `
    Windows Registry Editor Version 5.00

    [HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\Sessions\Default%20Settings]
    "Colour0"="255,250,244"
    "Colour1"="158,156,154"
    "Colour2"="14,16,25"
    "Colour3"="14,16,25"
    "Colour4"="255,255,255"
    "Colour5"="255,0,24"
    "Colour6"="35,35,35"
    "Colour7"="68,68,68"
    "Colour8"="255,0,15"
    "Colour9"="255,39,64"
    "Colour10"="140,225,11"
    "Colour11"="171,225,91"
    "Colour12"="255,185,0"
    "Colour13"="255,210,66"
    "Colour14"="0,141,248"
    "Colour15"="0,146,255"
    "Colour16"="109,67,166"
    "Colour17"="154,95,235"
    "Colour18"="0,216,235"
    "Colour19"="103,255,240"
    "Colour20"="255,255,255"
    "Colour21"="255,255,255"
`

const fs = require('fs');

function retrieveColorMapFromConfig(puttyConfigFile) {
    let colorMap = {};
    let config = puttyConfigFile.split(`"`)
    for (let i = 0; i < config.length; i++) {
        let element = config[i];
        if (element.startsWith(`Colour`)) {
            let colorId = Number(element.replace(`Colour`, ``))
            let colorCode = config[i + 2].split(`,`).map((e) => Number(e))
            colorMap[colorId] = colorCode;
            i++
        }
    }
    return colorMap;
}

function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, function (err, data) {
            if (err) {
                reject(err)
            }
            if (data === undefined) {
                console.log(filename, "is undefined")
                resolve("");
            } else {
                resolve(data.toString())
            }
        });
    })
}

let idList = [
    `$foreground`,
    `$foreground-light`,
    `$background`,
    `$background-light`,
    `$cursor-text`,
    `$cursor`,
    `$black`,
    `$black-light`,
    `$red`,
    `$red-light`,
    `$green`,
    `$green-light`,
    `$yellow`,
    `$yellow-light`,
    `$blue`,
    `$blue-light`,
    `$magenta`,
    `$magenta-light`,
    `$cyan`,
    `$cyan-light`,
    `$white`,
    `$white-light`
]

async function puttyFileToCSSFile(puttyConfigFilePath, outputFilePath) {
    let puttyConfigFile = await readFile(puttyConfigFilePath)
    let colorMap = retrieveColorMapFromConfig(puttyConfigFile)
    for (let i = idList.length - 1; i >= 0; i--) {
        let color = `rgb(${colorMap[i][0]},${colorMap[i][1]},${colorMap[i][2]})`
        css = css.replace(new RegExp(idList[i], "g"), color)
    }

    fs.writeFileSync(outputFilePath, css, { flag: 'wx' });
}

async function puttyFileToJSONFile(puttyConfigFilePath, outputFilePath) {
    let puttyConfigFile = await readFile(puttyConfigFilePath)
    let colorMap = retrieveColorMapFromConfig(puttyConfigFile)
    let config = {
        "base": {},
        "specialCase": {}
    }
    for (let i = idList.length - 1; i >= 0; i--) {
        let color = `rgb(${colorMap[i][0]},${colorMap[i][1]},${colorMap[i][2]})`
        config.base[idList[i]] = color
    }
    console.log(config)
    fs.writeFileSync(outputFilePath, JSON.stringify(config), { flag: 'wx' });
}

let puttyThemeFilenameList = [
    "01. Apple Terminal.reg",
    "02. Argonaut.reg",
    "03. Birds Of Paradise.reg",
    "04. Blazer.reg",
    "05. Chalkboard.reg",
    "06. Ciapre.reg",
    "07. Dark Pastel.reg",
    "08. Desert.reg",
    "09. Espresso.reg",
    "10. Fish Of Paradise.reg",
    "11. Fish Tank.reg",
    "12. github.reg",
    "13. Grass.reg",
    "14. Highway.reg",
    "15. Homebrew.reg",
    "16. Hurtado.reg",
    "17. Ic Green Ppl.reg",
    "18. Idletoes.reg",
    "19. Igvita Desert.reg",
    "20. Igvita Light.reg",
    "21. Invisibone.reg",
    "22. Kibble.reg",
    "23. Liquid Carbon.reg",
    "24. Liquid Carbon Transparent.reg",
    "25. Liquid Carbon Transparent Inverse.reg",
    "26. Man Page.reg",
    "27. Monokai Soda.reg",
    "28. Monokai Dimmed.reg",
    "29. Monokai Stevelosh.reg",
    "30. Neopolitan.reg",
    "31. Novel.reg",
    "32. Ocean.reg",
    "33. Papirus Dark.reg",
    "34. Pro.reg",
    "35. Red Sands.reg",
    "36. Seafoam Pastel.reg",
    "37. Solarized Dark.reg",
    "38. Solarized Light.reg",
    "39. Solarized Darcula.reg",
    "40. Sundried.reg",
    "41. Sympfonic.reg",
    "42. Teerb.reg",
    "43. Terminal Basic.reg",
    "44. Thayer.reg",
    "45. Tomorrow.reg",
    "46. Tomorrow Night.reg",
    "47. Twilight.reg",
    "48. Vaughn.reg",
    "49. X Dotshare.reg",
    "50. Zenburn.reg",
    "51. Mariana.reg"
]

puttyThemeFilenameList.forEach(filename => {
    puttyFileToJSONFile(`../../putty-color-themes/${filename}`, `../theme/${filename.split(".")[1].substring(1)}.json`)
})

// fs.readdir(`../../putty-color-themes/`, (err, files) => {
//     for (let i = 0; i < files.length; i++) {
//         let file = files[i]
//         if (file != undefined && file.match(/.*reg/)) {
//             puttyFileToCSSFile(`../../putty-color-themes/${file}`, `../putty-theme-css/${file.split(".")[1].substring(1)}.css`)
//         }

//     }
// });

// puttyFileToCSSFile(`../../putty-color-themes/01. Apple Terminal.reg`, `../putty-theme-css/test.css`)