import Router from '../main';
import GameModel from './game-model';
import ArtistView from './artist-view';
import GenreView from './genre-view';
import Timer from '../common/timer';
import statistics from '../data/game-statistics';
import showBlock from '../utils/show-block';


class GamePresenter {
  constructor() {
    this.timer = new Timer(this.model);
    this.view = ``;
  }

  get model() {
    if (!this._model) {
      this._model = new GameModel();
      this._model.reset();
      statistics.reset();
    }
    return this._model;
  }

  init() {
    if (this.model.state.lives < 1 || this.model.state.currentQuestion >= this.model.state.questions) {
      statistics.pushState(this.model.state);
      this.timer.clearTimer();
      return Router.showResult();
    }
    if (!this.timer.intervalId) this.timer.init();

    this.view = this._generateLevel();
    this.view.onPlay = this.onPlay.bind(this);
    this.view.onAnswer = this.onAnswer.bind(this);
    this.view.currentTime = this.model.state.timer;
    this.model.nextQuestion();
    showBlock(this.view.element);
  }

  onAnswer(evt) {
    let isAnswerTrue = this.view.checkValidAnswer(evt);
    if (typeof isAnswerTrue === `undefined`) return;
    statistics.pushAnswer(isAnswerTrue, this.view.currentTime - this.model.state.timer);
    this.model.setLives(isAnswerTrue);
    this.init();
  }

  onPlay(evt) {
    let cls = evt.target.classList;
    if (cls.contains(`player`) || cls.contains(`player-control`)) {
      evt.preventDefault();

      let clickedDiv = [...this.view.playerDivs].find((div) => div.contains(evt.target));
      let song = this._getSongObject(clickedDiv);

      if (this.view._playingSong && this.view._playingSong.audio !== song.audio) { // останавливаем песню
        this.view._playingSong.onEnded();
      }

      song.audio.volume = 0.2;
      song.pauseOrPlay();

      song.audio.addEventListener(`ended`, () => song.onEnded());
      this.view._playingSong = !song.audio.paused ? song : null; // записываем играющую песню
    }
  }

  _generateLevel() {
    return this.model.getSomeScreen(ArtistView, GenreView);
  }

  _getSongObject(div) {
    let that = this;
    return {
      audio: div.querySelector(`audio`),
      playButton: div.querySelector(`.player-control`),
      pauseOrPlay() {
        this.playButton.classList.contains(`player-control--pause`) ? this.audio.pause() : this.audio.play();
        this.playButton.classList.toggle(`player-control--play`);
        this.playButton.classList.toggle(`player-control--pause`);
      },
      onEnded() {
        this.audio.pause();
        this.playButton.classList.add(`player-control--play`);
        this.playButton.classList.remove(`player-control--pause`);
        that.view._playingSong = null;
      }
    };
  }

}

export default GamePresenter;
