import Router from '../main';
import FailView from './fail-view';
import SuccessView from './success-view';
import gameData from '../data/game-data';
import {showBlock} from '../utils';

class ResultPresenter {
  constructor(screenData) {
    if (screenData) {
      let data = Object.assign({}, gameData.resultWin, screenData);
      this.view = new SuccessView(data);
    }
  }

  init(screen) {
    this.view = this.view ? this.view : this._getView(screen);
    this.view.onReplay = this.onReplay;
    showBlock(this.view.element);
  }

  onReplay() {
    Router.showWelcome();
  }

  _getView(screen) {
    // screen принимает только 'failTries' или 'failTime'
    return new FailView(gameData[screen]);
  }
}

export default ResultPresenter;


