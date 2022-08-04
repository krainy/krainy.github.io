const ptlanbtn = document.getElementById("ptbtn");
const text = document.getElementById("text");
var i = 0;
var lastLanguage = "portuguese";



function changeLanguage(language) {

    if (language != lastLanguage) {
        console.log("1")
        lastLanguage = language;
        readTextFile("../txt/ws.txt");
    }
}