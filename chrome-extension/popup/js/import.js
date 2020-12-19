const fileReader = new FileReader()

fileReader.addEventListener("load", e=> {
    importedConfig = JSON.parse(atob(fileReader.result.split(',')[1]))
    updateConfig("Custom", importedConfig, false)
}, false)

function handleFiles() {
    fileReader.readAsDataURL(this.files[0]);
}


(() => {
    let importButton = document.getElementById("import-button")
    importButton.addEventListener("change", handleFiles, false);
    console.log("meow")
})()