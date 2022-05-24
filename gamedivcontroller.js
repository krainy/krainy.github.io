function resizeGameDiv() {
    var gameDiv = document.getElementById("game-div");
    var header = document.getElementById("header").offsetHeight;
    var footer = document.getElementById("footer").offsetHeight;
    var windowHeight = window.innerHeight;

    var calcHeight = windowHeight - header - footer;

    gameDiv.style.height = calcHeight + "px";
}