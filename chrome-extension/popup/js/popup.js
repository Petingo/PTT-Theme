let createPickrObject = (target, elementPath, defaultColor, themeDefaultColor, isSp = false) => {
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
        // console.log("update", color)
        try {
            chrome.storage.local.set({
                [target]: color.toRGBA().toString()
            }, callback)
        } catch (err) {
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
            update(newColor)
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
                console.log("cancel", colorOnShow)
                update(colorOnShow)
                break;
            case "clear":
                console.log("set to default", themeDefaultColor)
                update(themeDefaultColor)
                break;
        }
    })

    return pickr
}

let refreshColorPickr = () => {
    colors.forEach((color) => {
        chrome.storage.local.get([color], function(result) {
            createPickrObject(color, `.pickr-${color.substring(2)}`, result[color], result[color])
        })
    })
}

let initThemeSelectionDropdown = () => {
    let themeSelectionDropdown = document.getElementById("theme-selection-dropdown")
    let themeSelectionDropdownItemContainer = document.getElementById("theme-selection-dropdown-item-container")

    chrome.storage.local.get([BASE_THEME], function(result) {
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
            item.onclick = async() => {
                loadJSONConfig(key, true)
            }

            themeSelectionDropdownItemContainer.appendChild(item)
        }
    })
}

let initSpClickEvent = () => {
    let buttons = [...document.getElementsByClassName("sp-color-demo-button")]
    buttons.forEach(button => {
        let innerHTMLTmp = undefined
        $(button).on('shown.bs.popover', function() {
            let b = button.getAttribute("b")
            let q = button.getAttribute("q")

            let popoverContent = document.getElementById(`popover-content-q${q}b${b}`)
            let popover = document.getElementById(`popover-q${q}b${b}`)

            if (innerHTMLTmp === undefined) {
                innerHTMLTmp = popoverContent.innerHTML
                popoverContent.innerHTML = ""
            }
            popover.innerHTML = innerHTMLTmp

            // console.log(document.getElementsByClassName(`pickr-b${b}q${q}-b`).length)
            // console.log(innerHTMLTmp)
            if (document.getElementsByClassName(`pickr-q${q}b${b}-b`).length != 0) {

                createPickrObject(`--q${q}b${b}-color`, `.pickr-q${q}b${b}-b`, "#000000", "#000000")
                createPickrObject(`--q${q}b${b}-bg-color`, `.pickr-q${q}b${b}-q`, "#000000", "#000000")
            }

            // console.log(popover)
        })


        // button.onclick = async() => {
        //     console.log("click!")
        //     let b = button.getAttribute("b")
        //     let q = button.getAttribute("q")
        //         // createPickrObject("#000000", `.pickr-b${b}q${q}-b`, "#000000", "#000000")
        //     let popover = document.getElementById(`popover-b${b}q${q}`)
        //     console.log(popover)
        // }
    })
}

let initSpPopup = () => {
    for (let i = 0; i <= 15; i++) {
        for (let k = 0; k <= 7; k++) {
            // Popover Menu initialize
            $(`.sp-color-demo-button.q${i}.b${k}`).popover({
                placement: 'left',
                trigger: 'click',
                html: true,
                content: function() {
                    console.log(document.querySelector(`.pickr-q${i}.b${k}-q`).parentNode)

                    // createPickrObject("#000000", `.pickr-b${i}q${k}-q`, "#000000", "#000000")
                    return $(this).parent().find(".sp-popover-panel").html();
                }

            }).on('show.bs.popover', function(e) {
                if (window.activePopover) {
                    $(window.activePopover).popover('hide')
                }
                window.activePopover = this;
                currentPopover = e.target;

            }).on('hide.bs.popover', function() {
                window.activePopover = null;
            })
        }
    }

    // Close popover when clicking anywhere on the screen
    $(document).on('click', function(e) {
        $('[data-toggle="popover"],[data-original-title]').each(function() {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            var target = $(e.target);
            if (!target.is('.popover') && !target.is('.popover *') && !target.is('.sp-color-demo-button') || target.is('.btn-popover-close')) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });

    // Anchor popover to opening element
    $(window).resize(function() {

        // console.log(currentPopover);

        if (currentPopover.data('bs.popover').tip().hasClass('in') == true) {
            currentPopover.popover('hide');
            currentPopover.popover('show');
        }
    });
}

(async() => {
    initThemeSelectionDropdown()
    refreshColorPickr()
    initSpClickEvent()

    $('[data-toggle="popover"]').popover()

    // Close popover when clicking anywhere on the screen
    $(document).on('click', function(e) {
        let target = $(e.target);
        $('[data-toggle="popover"]').each(function() {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup

            if (!target.is('.sp-color-demo-button') &&
                !target.is('.pcr-type.active') &&
                !target.is('.pcr-button')
            ) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });

    // $(document).on('click', function(e) {
    //     $('[data-toggle="popover"],[data-original-title]').each(function() {
    //         //the 'is' for buttons that trigger popups
    //         //the 'has' for icons within a button that triggers a popup
    //         var target = $(e.target);
    //         if (!target.is('.popover') && !target.is('.popover *') && !target.is('.sp-color-demo-button') || target.is('.btn-popover-close')) {
    //             (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
    //         }
    //     });
    // });

    // initClickEvent()
    // initSpPopup()
    // $("[data-toggle=popover]").popover();
})()