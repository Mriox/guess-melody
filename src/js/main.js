// import './player.js';

let app = document.querySelector(`body .app`);
let main = document.querySelector(`body .app .main`);
let template = document.querySelector(`template`).content;
let screens = template.querySelectorAll(`.main`);
let arrows = template.querySelector(`.arrows__wrap`);

export const key = {
  leftArrow: 37,
  rightArrow: 39
};


function switchBlock(sections, appendTo) { // загружает нужный блок из темплейтов
  let number = 0;

  return function (plusMinus = 0) {
    number += plusMinus;
    if (number < 0 || number > 5) {
      number -= plusMinus;
      return;
    }

    sections = [...sections];
    appendTo.innerHTML = ``;
    appendTo.appendChild(sections[number]);
  };
}

function onArrowsPress(evt) { // переключает блоки по клавишам стрелок
  evt.keyCode === key.leftArrow ? closuredSwitch(-1) : false;
  evt.keyCode === key.rightArrow ? closuredSwitch(1) : false;
}

let closuredSwitch = switchBlock(screens, main);

let onContentLoaded = () => {
  app.appendChild(arrows);
  closuredSwitch();

  let arrowsDiv = app.querySelector(`.arrows__wrap`);
  arrowsDiv.addEventListener(`click`, function (evt) {
    evt.target.classList.contains(`left`) ? closuredSwitch(-1) : false;
    evt.target.classList.contains(`right`) ? closuredSwitch(1) : false;
  });
};


document.addEventListener(`DOMContentLoaded`, onContentLoaded);
document.addEventListener(`keydown`, onArrowsPress);


