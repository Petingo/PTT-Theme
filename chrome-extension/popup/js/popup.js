function createPickrObject(el, defaultColor){
    let pickr = Pickr.create({
        el: el,
        theme: 'nano',
    
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

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
                hsla: true,
                input: true,
                cancel: true,
                save: true,
            }
        }
    });
    
    pickr.on('save', (color, instance) => {
        console.log('save', color, instance);
    }).on('change', instance => {
        console.log('clear', instance);
    })

    return pickr
}

let elements = [{
        el: ".pickr-foreground",
        defaultColor: "silver"
    }, {
        el: ".pickr-background",
        defaultColor: "black"
    }, {
        el: ".pickr-black",
        defaultColor: "black"
    }, {
        el: ".pickr-black-light",
        defaultColor: "gray"
    }, {
        el: ".pickr-red",
        defaultColor: "maroon"
    }, {
        el: ".pickr-red-light",
        defaultColor: "red"
    }]

let pickrObject = []
elements.forEach((e)=>{
    console.log(e)
    pickrObject.push(createPickrObject(e.el, e.defaultColor))
})

