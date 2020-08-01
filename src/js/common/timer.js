import View from '../view';
import Result from '../result/result';
import showBlock from '../utils/show-block';
import gameState from '../data/game-state';


class TimerView extends View {
  constructor() {
    super();
    this.intervalId = false;
  }

  get minText() {
    let timer = gameState.now.timer;
    return timer / 60 < 10 ? `0${Math.trunc(timer / 60)}` : Math.trunc(timer / 60);
  }

  get secText() {
    let timer = gameState.now.timer;
    return timer % 60 < 10 ? `0${timer % 60}` : timer % 60;
  }

  get template() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
      <circle cx="390" cy="390" r="370" class="timer-line" stroke-dasharray="2325" stroke-dashoffset="0"
      style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>
    </svg>

    <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml" style="top: 65px"> 
      <span class="timer-value-mins">${this.minText}</span><!--
    --><span class="timer-value-dots">:</span><!--
    --><span class="timer-value-secs">${this.secText}</span>
    </div>`;
  }

  render() {
    let el = document.createElement(`template`);
    el.innerHTML = this.template.trim();
    return el.content;
  }

  bind() {
    this.min = this.element.querySelector(`div .timer-value-mins`);
    this.sec = this.element.querySelector(`div .timer-value-secs`);
    this.svgCircle = this.element.querySelector(`svg.timer circle`);
  }
}


export default class TimerPresenter {
  constructor() {
    this.view = new TimerView();
  }

  init() {
    this.view.app = document.querySelector(`body .app`);
    let cb = (dom, appendTo) => appendTo.prepend(dom);
    showBlock(this.view.element, this.view.app, cb);
    this._start();
  }

  clearTimer() {
    clearInterval(this.view.intervalId); this.view.intervalId = false;
    let svg = this.view.app.querySelector(`svg.timer`);
    let divClock = this.view.app.querySelector(`div.timer-value`);
    svg.remove(); divClock.remove();
  }

  _start() {
    this.view.intervalId = setInterval(() => {
      let timer = gameState.tick();
      [this.view.min.textContent, this.view.sec.textContent] = [this.view.minText, this.view.secText];

      let dash = this._paintSvgDash(gameState.initialState.timer, timer, this.view.svgCircle.r.baseVal.value);
      this.view.svgCircle.style.strokeDasharray = dash.stroke;
      this.view.svgCircle.style.strokeDashoffset = dash.offset;

      if (timer < 0) {
        this.clearTimer();
        new Result().init();
      }
    }, 1000);
  }

  _paintSvgDash(fullTime, currentTime, radius) {
    let stroke = 2 * Math.PI * radius;
    let offsetStep = stroke / fullTime;
    let offset = (fullTime - currentTime) * offsetStep;
    return {stroke, offset};
  }
}
