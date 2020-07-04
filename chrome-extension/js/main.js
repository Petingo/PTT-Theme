// chrome.storage.onChanged.addListener(async function(changes, namespace) {
//     console.log("changed!")
//     for (let key in changes) {
//         let colorKeyRE = /--.*/
//         let spColorKeyRE = /--q[0-9]*b[0-9]*-color/
//         let spBgColorKeyRE = /--q[0-9]*b[0-9]*-bg-color/
//         if (spBgColorKeyRE.test(key)) {
//             console.log(key, changes[key].newValue)
//             console.log(key, changes[key].oldValue)

//             if (changes[key].oldValue === undefined) {

//             } else {

//             }


//         } else if (spColorKeyRE.test(key)) {
//             console.log(key, changes[key].newValue)
//             console.log(key, changes[key].oldValue)

//         } else if (colorKeyRE.test(key)) {
//             console.log(key, changes[key].newValue)
//             document.documentElement.style.setProperty(key, changes[key].newValue);
//         }
//         // .match(/[0-9]+/g)
//     }

// })