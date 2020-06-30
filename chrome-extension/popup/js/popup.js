let createPickrObject = (target, elementPath, defaultColor, themeDefaultColor) => {
    let pickr = Pickr.create({
        el: elementPath,
        theme: 'nano',

        // swatches: [
        //     'rgba(244, 67, 54, 1)',
        //     'rgba(233, 30, 99, 0.95)',
        //     'rgba(156, 39, 176, 0.9)',
        //     'rgba(103, 58, 183, 0.85)',
        //     'rgba(63, 81, 181, 0.8)',
        //     'rgba(33, 150, 243, 0.75)',
        //     'rgba(3, 169, 244, 0.7)',
        //     'rgba(0, 188, 212, 0.7)',
        //     'rgba(0, 150, 136, 0.75)',
        //     'rgba(76, 175, 80, 0.8)',
        //     'rgba(139, 195, 74, 0.85)',
        //     'rgba(205, 220, 57, 0.9)',
        //     'rgba(255, 235, 59, 0.95)',
        //     'rgba(255, 193, 7, 1)'
        // ],

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
        console.log("update", color)
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
        console.log('hide')
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
        // for (let i = 0; i <= 7; i++) {
        //     for (let k = 0; k <= 7; k++) {
        //         console.log(`.pickr-b${i}q${k}-b`)
        //         createPickrObject("#000000", `.pickr-b${i}q${k}-b`, "#000000", "#000000")
        //     }
        // }
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
        $(button).on('shown.bs.popover', function() {
            console.log("meow")
            let b = button.getAttribute("b")
            let q = button.getAttribute("q")
            createPickrObject("#000000", `.pickr-b${b}q${q}-b`, "#000000", "#000000")
        })

        // button.onclick = async() => {
        //     console.log("click!")
        //         // let b = button.getAttribute("b")
        //         // let q = button.getAttribute("q")
        //         // createPickrObject("#000000", `.pickr-b${b}q${q}-b`, "#000000", "#000000")
        // }
    })
}

let initSpPopup = () => {
    for (let i = 0; i <= 7; i++) {
        for (let k = 0; k <= 15; k++) {
            // Popover Menu initialize
            $(`.sp-color-demo-button.b${i}.q${k}`).popover({
                placement: 'left',
                trigger: 'click',
                html: true,
                content: function() {
                    console.log(document.querySelector(`.pickr-b${i}q${k}-q`).parentNode)

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

        console.log(currentPopover);

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

    // initClickEvent()
    // initSpPopup()
    // $("[data-toggle=popover]").popover();
})()