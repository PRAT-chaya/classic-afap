var startTimeString = "0:00";
var tdSeparator = " / ";
var playSvgPathD = "M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z";
var playSvgClass = "bi bi-play-fill";

var pauseSvgPathD = "M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z";
var pauseSvgClass = "bi bi-pause-fill";

function getTimeStringFromSeconds(secs) {
    let timeString = "0:";
    let mins = 0;
    if (secs > 59) {
        mins = Math.floor(secs / 60);
        timeString = mins + ":";
        secs -= 60;
    }

    if (secs < 10) {
        timeString += "0";
    }
    timeString += Math.floor(secs);
    return timeString;
}

function loadAudioplayer(productId) {
    let music = document.getElementById('music' + productId); //html audio element
    let pButton = document.getElementById('pbutton' + productId); //play button
    let timeSpan = document.getElementById('timespan' + productId); //timePosition span
    pButton.style.cursor = "pointer";
    music.onloadedmetadata = function () {
        timeSpan.textContent = startTimeString + tdSeparator + getTimeStringFromSeconds(music.duration);
    };

    pButton.addEventListener("click", play); //play button click event listener
    music.addEventListener("timeupdate", timeupdate, false); //timeupdate event listener
}

function pButtonSwitch(pButton) {
    let pButtonSvg = pButton.children[0];
    //If pButton is a play button, we should change it to a pause button
    if (pButtonSvg.getAttribute("class") === playSvgClass) {
        pButtonSvg.setAttribute("class", pauseSvgClass);
        pButtonSvg.children[0].setAttribute("d", pauseSvgPathD);
    } //If pButton is a pause button, we should change it to a play button 
    else if (pButtonSvg.getAttribute("class") === pauseSvgClass) {
        pButtonSvg.setAttribute("class", playSvgClass);
        pButtonSvg.children[0].setAttribute("d", playSvgPathD);
    }
}

function timeupdate(event) {
    let music = event.target;
    if (music.getAttribute("class") === "audio-clip") {
        let id = music.getAttribute('data-id')
        let timeSpan = document.getElementById('timespan' + id);

        if (music.ended) {
            let pButton = document.getElementById('pbutton' + id);
            //Switch pButton to a play button
            if (pButton.children[0].getAttribute("class") === pauseSvgClass) {
                pButtonSwitch(pButton);
            }
        }
        timeSpan.textContent = getTimeStringFromSeconds(Math.floor(music.currentTime))
            + tdSeparator + getTimeStringFromSeconds(music.duration);
    }
    return;
}

function play(event) {
    let pButton = null;

    //Making sure pButton is referencing the span element
    if (event.target.parentElement.className === "pbutton") {
        pButton = event.target.parentElement;
    } else {
        pButton = event.target.parentElement.parentElement;
    }

    let id = pButton.getAttribute('data-id');
    let music = document.getElementById('music' + id);

    //start music
    if (music.paused) {
        music.play();
        pButtonSwitch(pButton);
    } else {    //pause music
        music.pause();
        pButtonSwitch(pButton);
    }
}

var productsMiniatures = document.getElementsByClassName("product-miniature js-product-miniature")
var productDescription = document.querySelector("div[id^=\"product-description-short-\"]");
if (productsMiniatures !== null && productsMiniatures.length > 0) {
    Array.prototype.forEach.call(productsMiniatures, function (product) {
        let dataIdProduct = product.getAttribute("data-id-product");
        let music = document.getElementById('music' + dataIdProduct);
        if(music != null) {
            loadAudioplayer(dataIdProduct);
        }
    });
} else {
    let music = document.querySelector("audio[id^=\"music\"]");
    if(music != null) {
        let productId = parseInt(music.id.slice(5));
        loadAudioplayer(productId);
    }
}