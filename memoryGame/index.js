const time = document.getElementById("time");
let sec = 0;
let min = 0;
let hour = 0;

function timer() {
    sec++;
    if (sec > 59) {
        sec = 0;
        min++;
        if (min > 59) {
            min = 0;
            hour++;
        }
    }

    if (sec < 10 && min < 10 && hour < 10) {
        time.innerHTML = `0${hour}:0${min}:0${sec}`;
    } else if (sec > 9 && min < 10 && hour < 10) {
        time.innerHTML = `0${hour}:0${min}:${sec}`;
    } else if (sec < 10 && min > 9 && hour < 10) {
        time.innerHTML = `0${hour}:${min}:0${sec}`;
    } else if (sec < 10 && min < 10 && hour > 9) {
        time.innerHTML = `${hour}:0${min}:0${sec}`;
    } else if (sec > 9 && min > 9 && hour < 10) {
        time.innerHTML = `0${hour}:${min}:${sec}`;
    } else if (sec > 9 && min < 10 && hour > 9) {
        time.innerHTML = `${hour}:0${min}:${sec}`;
    } else if (sec < 10 && min > 9 && hour > 9) {
        time.innerHTML = `${hour}:${min}:0${sec}`;
    } else if (sec > 9 && min > 9 && hour > 10) {
        time.innerHTML = `${hour}:${min}:${sec}`;
    }
}


const icons = [
    '<i class="fa fa-snowflake-o" aria-hidden="true"></i>',
    '<i class="fa fa-android" aria-hidden="true"></i>',
    '<i class="fa fa-bicycle" aria-hidden="true"></i>',
    '<i class="fa fa-tree" aria-hidden="true"></i>',
    '<i class="fa fa-futbol-o" aria-hidden="true"></i>',
    '<i class="fa fa-coffee" aria-hidden="true"></i>',
    '<i class="fa fa-star" aria-hidden="true"></i>',
    '<i class="fa fa-space-shuttle" aria-hidden="true"></i>',
    '<i class="fa fa-bank" aria-hidden="true"></i>',
    '<i class="fa fa-briefcase" aria-hidden="true"></i>',
    '<i class="fa fa-bug" aria-hidden="true"></i>',
    '<i class="fa fa-heart" aria-hidden="true"></i>',
    '<i class="fa fa-snowflake-o" aria-hidden="true"></i>',
    '<i class="fa fa-android" aria-hidden="true"></i>',
    '<i class="fa fa-bicycle" aria-hidden="true"></i>',
    '<i class="fa fa-tree" aria-hidden="true"></i>',
    '<i class="fa fa-futbol-o" aria-hidden="true"></i>',
    '<i class="fa fa-coffee" aria-hidden="true"></i>',
    '<i class="fa fa-star" aria-hidden="true"></i>',
    '<i class="fa fa-space-shuttle" aria-hidden="true"></i>',
    '<i class="fa fa-bank" aria-hidden="true"></i>',
    '<i class="fa fa-briefcase" aria-hidden="true"></i>',
    '<i class="fa fa-bug" aria-hidden="true"></i>',
    '<i class="fa fa-heart" aria-hidden="true"></i>',
];

const container = document.getElementsByClassName("container")[0];
const boxes = document.getElementsByClassName("box");
const startBtn = document.getElementById("startBtn");
const startDiv = document.getElementById("start");
const enterName = document.getElementById("enterName");
const userName = document.querySelector("[name='name']");
const nameDiv = document.getElementById("nameDiv");
const change = document.getElementById("change");
const scoreboard = document.getElementById("scoreboard");
let clicks = 0;
let gameOver = 0;
let twoBox = [];
let ids = [];
let resolvedBoxes = [];
let topResults = [];
const numberOfCards = 24;


defaultPage();

startBtn.addEventListener("click", startGame);

function changeUser() {
    nameDiv.style.display = "none";
    enterName.style.display = "flex";
}

function defaultPage() {
    if (localStorage.topResults) {
        let text = "";
        topResults = JSON.parse(localStorage.topResults);
        for (let i = 0; i < topResults.length; i++) {
            topResults[i].value = value(topResults[i].time);
        }
        topResults.sort(function (a,b) {
            return a.value - b.value;
        });
        for (let i = 0; i < topResults.length; i++) {
            if (i < 7) {
                text += `
        <div class="col-sm-2">
          <div class="scores">
            <p>${topResults[i].name}</p>
            <p>${topResults[i].time}</p>
          </div>
        </div>
        `;
            }
        }
        scoreboard.innerHTML = text;
    }
    if (localStorage.userName) {
        nameDiv.style.display = "block";
        nameDiv.children[1].innerText = localStorage.userName;
        enterName.style.display = "none";

        change.addEventListener("click", changeUser);
    }
}


function startGame() {
    startDiv.style.display = "none";
    container.classList.remove("rules");
    container.style.backgroundColor = '#ddc2ab';

    if (localStorage.userName) {
        if (userName.value != "") {
            localStorage.userName = userName.value;
        } else {
            localStorage.userName = nameDiv.children[1].innerText;
        }
    } else {
        localStorage.setItem("userName", userName.value);
    }
    createTable();
    addClickEvents(resolvedBoxes);
    setInterval(timer, 1000);
}



function createTable() {
    let text ="";
    for (let i = 0; i < numberOfCards; i++) {
        let rand = Math.floor(Math.random()*icons.length);
        text += "<div class='box' data-id=" + i + "><div class='back'>" + icons[rand] + "</div><div class='front'></div></div>";
        icons.splice(rand, 1);
    }
    container.innerHTML = text;
}

function flip() {
    twoBox.push(this);
    const back = this.children[0];
    const front = this.children[1];
    back.style.transform = "perspective(900px) rotateY(0deg)";
    front.style.transform = "perspective(900px) rotateY(180deg)";
    clicks++;
    const id = parseInt(this.getAttribute("data-id"));
    ids.push(id);
    this.removeEventListener("click", flip);
    if (clicks == 2) {
        removeEvents();
        checkFlip(ids);
    }
}

function checkFlip(ids) {
    const front1 = twoBox[0].children[1];
    const back1 = twoBox[0].children[0];
    const front2 = twoBox[1].children[1];
    const back2 = twoBox[1].children[0];
    if (back1.innerHTML === back2.innerHTML) {
        gameOver++;
        if (gameOver === numberOfCards/2) {
            topResults.push({
                name: localStorage.userName,
                time: time.innerText
            });
            localStorage.topResults = JSON.stringify(topResults);
            location.reload();
        }
        resolvedBoxes.push(ids[0]);
        resolvedBoxes.push(ids[1]);
        resetArrs();
        addClickEvents(resolvedBoxes);
    } else {
        setTimeout(function () {
            front1.style.transform = "perspective(900px) rotateY(0)";
            back1.style.transform = "perspective(900px) rotateY(180deg)";
            front2.style.transform = "perspective(900px) rotateY(0)";
            back2.style.transform = "perspective(900px) rotateY(180deg)";
            resetArrs()
            addClickEvents(resolvedBoxes);
        }, 700)
    }
}


function removeEvents() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].removeEventListener("click", flip)
    }
}

//add or return event to those which are not resolved
function addClickEvents(arr) {
    var noBoxes = [];
    var reducedBoxes = [];
    //filling in the array noBoxes with the order numbers of boxes (length should be 24)

    for (let i = 0; i < boxes.length; i++) {
        noBoxes.push(i);
    }
    //push to a reducedBoxes the order numbers for which we shouldn't returnEvent
    noBoxes.forEach(function (e) {
          if (arr.indexOf(e) == -1) {
            reducedBoxes.push(e);
        }
    })
    //returnEvent for those boxes which we didn't got!
    for (var i = 0; i < reducedBoxes.length; i++) {
        boxes[reducedBoxes[i]].addEventListener("click", flip);
    }
}

function resetArrs() {
    clicks = 0;
    twoBox.length = 0;
    ids.length = 0;
}

function value(string) {
    var replaceString = string.replace(/:/g, "");
    var x = parseInt(replaceString);
    return x;
}





