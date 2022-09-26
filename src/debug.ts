function update() {
    chrome.storage.local.get(null, (result) => {
        for (let key of ["states", "history"]) {
            const el = document.getElementById(key)!;

            if(key === "states"){
                el.innerHTML = "";
                for(let [id, state] of Object.entries(result["states"])){
                    el.innerHTML += "<h3>" + id + "</h3>"
                    let table = "<table>"
                    for(let [attr, value] of Object.entries(state as {})){
                        table += "<tr><td>" + attr + "</td><td>" + JSON.stringify(value) + "</td></tr>"

                    }
                    table += "</table>"
                    el.innerHTML += table;

                }
            }else {
                el.innerHTML = JSON.stringify(result[key]);
            }
        }
    })
    chrome.storage.sync.get(null, (result) => {
        for (let key of ["blockData"]) {
            const el = document.getElementById(key)!;
            el.innerHTML = JSON.stringify(result[key]);
        }
    })
}


chrome.storage.local.onChanged.addListener(() => {
    update();
})
update();
export { }