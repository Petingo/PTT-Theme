const colorCode2Key = {
    7: "--white",
    15: "--white-light",
    0: "--black",
    8: "--black-light",
    1: "--red",
    9: "--red-light",
    2: "--green",
    10: "--green-light",
    3: "--yellow",
    11: "--yellow-light",
    4: "--blue",
    12: "--blue-light",
    5: "--magenta",
    13: "--magenta-light",
    6: "--cyan",
    14: "--cyan-light"
}

let createPickrObject = (target, elementPath, defaultColor, themeDefaultColor, hasDefault = false) => {
    console.log(target, elementPath, defaultColor, themeDefaultColor, hasDefault)
    let pickr = Pickr.create({
        el: elementPath,
        theme: 'nano',

        default: defaultColor,

        components: {

            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                input: true,
                cancel: true,
                save: true,
                clear: true
            }
        }
    });

    let update = (color, callback) => {
        console.log("KK")
        // console.log("update", color)
        try {
            console.log("try", target, color.toRGBA().toString())
            chrome.storage.local.set({
                [target]: color.toRGBA().toString()
            }, callback)
        } catch (err) {
            console.log("err", color)
            chrome.storage.local.set({
                [target]: color
            }, callback)
        }
    }

    let lastUpdateTime = 0;
    let cancelFlag
    let colorOnShow = undefined

    pickr.on('change', (newColor, instance) => {
        let now = Date.now()
        if (now - lastUpdateTime > 50) {
            lastUpdateTime = now
            update(newColor, () => { console.log("color updated") })
        }
    }).on('save', (newColor, instance) => {
        cancelFlag = "save"
        pickr.hide()
    }).on('cancel', instance => {
        cancelFlag = "cancel"
        pickr.hide()
    }).on('clear', instance => {
        cancelFlag = "clear"
        pickr.hide()
    }).on('show', instance => {
        colorOnShow = instance._color.toRGBA().toString()
    }).on('hide', instance => {
        // console.log('hide')
        switch (cancelFlag) {
            case "cancel":
                update(colorOnShow)
                break;
            case "clear":
                update(themeDefaultColor)
                if (hasDefault) {
                    // set key-color to default
                    console.log("")
                    let themeDefKey = target + "-theme-def"
                    chrome.storage.local.get([themeDefKey], (r) => {
                        chrome.storage.local.set({
                            [target]: r[themeDefKey]
                        })
                    })
                } else {
                    // remove key
                    chrome.storage.local.remove(target)
                }

                break;
        }
    })

    return pickr
}

// for global color setting
function refreshColorPickr() {
    console.log("refreshColorPickr")
    colors.forEach((color) => {
        chrome.storage.local.get([color], function (result) {
            console.log("aaaa")
            createPickrObject(color, `.pickr-${color.substring(2)}`, result[color], result[color])
        })
    })
}

function initThemeSelectionDropdown() {
    let themeSelectionDropdown = document.getElementById("theme-selection-dropdown")
    let themeSelectionDropdownItemContainer = document.getElementById("theme-selection-dropdown-item-container")

    chrome.storage.local.get([BASE_THEME], function (result) {
        let currentTheme = result[BASE_THEME]
        themeSelectionDropdown.innerText = currentTheme;

        for (let key in themeJSONFileMap) {
            let item = document.createElement("a")
            item.setAttribute("class", "dropdown-item theme-selection-dropdown-item")
            item.setAttribute("theme-json-file", themeJSONFileMap[key])
            item.setAttribute("href", "#")
            if (key == currentTheme) {
                item.classList.add("active")
            }

            item.innerText = key
            item.onclick = async () => {
                loadJSONConfig(key, true)
            }

            themeSelectionDropdownItemContainer.appendChild(item)
        }
    })
}


function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function exportJson() {
    let themeConfig = {
        "base": {},
        "specialCase": []
    }
    chrome.storage.local.get([...colors, BASE_THEME, SP_COLOR_LIST, SP_COLOR_CSS_KEY, SP_BG_COLOR_CSS_KEY], r => {
        for (let c of colors) {
            themeConfig.base[c] = r[c]
        }
        filename = `${r[BASE_THEME]}.custom.json`
        spColorList = r[SP_COLOR_LIST]
        console.log("aaaa", spColorList)
        chrome.storage.local.get(spColorList, r => {
            console.log(r)
            for (let spColor of spColorList) {
                console.log(spColor)
                let t = spColor.match(/[0-9]+/g)
                let q = t[0]
                let b = t[1]
                let spColorConfig = {
                    "q": q,
                    "b": b
                }
                if (spColor.includes("bg")) {
                    spColorConfig["bg-color"] = r[spColor]
                } else {
                    spColorConfig["color"] = r[spColor]
                }
                themeConfig.specialCase.push(spColorConfig)
            }
            download(filename, JSON.stringify(themeConfig))
        })
    })
}

function initExportButton() {
    let exportButton = document.getElementById("export-button")
    exportButton.addEventListener("click", exportJson)
}

function initImportButton() {
    let importButton = document.getElementById("import-button")
    importButton.onclick = () => {
        chrome.tabs.create({url: "popup/import.html"});
        return false;
    }
}


function initSpClickEvent() {
    let buttons = [...document.getElementsByClassName("sp-color-demo-button")]
    buttons.forEach(button => {
        let innerHTMLTmp = undefined
        $(button).on('shown.bs.popover', function () {
            let b = button.getAttribute("b")
            let q = button.getAttribute("q")

            let popoverContent = document.getElementById(`popover-content-q${q}b${b}`)
            let popover = document.getElementById(`popover-q${q}b${b}`)

            if (innerHTMLTmp === undefined) {
                innerHTMLTmp = popoverContent.innerHTML
                popoverContent.innerHTML = ""
            }
            popover.innerHTML = innerHTMLTmp

            if (document.getElementsByClassName(`pickr-q${q}b${b}-b`).length != 0) {
                let query = [
                    `--q${q}b${b}-color`,
                    `--q${q}b${b}-color-theme-def`,
                    `--q${q}b${b}-bg-color`,
                    `--q${q}b${b}-bg-color-theme-def`,
                    colorCode2Key[q],
                    colorCode2Key[b]
                ]
                chrome.storage.local.get(query, (r) => {
                    console.log(r)
                    let defaultColor, defaultBgColor, themeDefaultColor, themeDefaultBgColor
                    let colorHasDefault = false, bgColorHasDefault = false
                    // default color
                    if (r[`--q${q}b${b}-color`] != undefined) {
                        defaultColor = r[`--q${q}b${b}-color`]
                    } else {
                        defaultColor = r[colorCode2Key[q]]
                    }

                    // default bg color
                    if (r[`--q${q}b${b}-bg-color`] != undefined) {
                        defaultBgColor = r[`--q${q}b${b}-bg-color`]
                    } else {
                        defaultBgColor = r[colorCode2Key[b]]
                    }

                    // theme default color
                    if (r[`--q${q}b${b}-color-theme-def`] != undefined) {
                        colorHasDefault = true
                        themeDefaultColor = r[`--q${q}b${b}-color-theme-def`]
                    } else {
                        themeDefaultColor = r[colorCode2Key[q]]
                    }

                    // theme default bg color
                    if (r[`--q${q}b${b}-bg-color-theme-def`] != undefined) {
                        bgColorHasDefault = true
                        themeDefaultBgColor = r[`--q${q}b${b}-bg-color-theme-def`]
                    } else {
                        themeDefaultBgColor = r[colorCode2Key[b]]
                    }

                    // console.log(`--q${q}b${b}`, defaultColor, defaultBgColor, themeDefaultColor, themeDefaultBgColor)
                    console.log("meow")
                    createPickrObject(`--q${q}b${b}-color`, `.pickr-q${q}b${b}-b`, defaultColor, themeDefaultColor, colorHasDefault)
                    createPickrObject(`--q${q}b${b}-bg-color`, `.pickr-q${q}b${b}-q`, defaultBgColor, themeDefaultBgColor, bgColorHasDefault)

                })

            }

        })
    })
}

function initSpPopup() {
    for (let i = 0; i <= 15; i++) {
        for (let k = 0; k <= 7; k++) {
            // Popover Menu initialize
            $(`.sp-color-demo-button.q${i}.b${k}`).popover({
                placement: 'left',
                trigger: 'click',
                html: true,
                content: function () {
                    console.log(document.querySelector(`.pickr-q${i}.b${k}-q`).parentNode);
                    return $(this).parent().find(".sp-popover-panel").html();
                }
            }).on('show.bs.popover', function (e) {
                if (window.activePopover) {
                    $(window.activePopover).popover('hide');
                }
                window.activePopover = this;
                currentPopover = e.target;

            }).on('hide.bs.popover', function () {
                window.activePopover = null;
            });
        }
    }

    // Close popover when clicking anywhere on the screen
    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            var target = $(e.target);
            if (!target.is('.popover') && !target.is('.popover *') && !target.is('.sp-color-demo-button') || target.is('.btn-popover-close')) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });

    // Anchor popover to opening element
    $(window).resize(function () {
        // console.log(currentPopover);

        if (currentPopover.data('bs.popover').tip().hasClass('in') == true) {
            currentPopover.popover('hide');
            currentPopover.popover('show');
        }
    });
}

(async () => {
    initThemeSelectionDropdown()
    initExportButton()
    initImportButton()
    refreshColorPickr()
    initSpClickEvent()

    $('[data-toggle="popover"]').popover()

    // Close popover when clicking anywhere on the screen
    $(document).on('click', function (e) {
        let target = $(e.target);
        $('[data-toggle="popover"]').each(function () {
            if (!target.is('.sp-color-demo-button') &&
                !target.is('.pcr-type.active') &&
                !target.is('.pcr-button')
            ) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });
})()