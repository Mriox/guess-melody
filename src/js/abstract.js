class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Forbidden to inherit from this class. Only for extended classes`);
    }
  }

  get template() {
    throw new Error(`Need template`);
  }

  get element() {
    if (!this._element) {
      this._element = this.render();
      this.bind();
    }
    return this._element;
  }

  bind() {}

  render() {
    let div = document.createElement(`div`);
    div.innerHTML = this.template.trim();
    return div.firstChild;
  }
}


class DefaultAdapter {
  constructor() {
    if (new.target === `DefaultAdapter`) throw new Error(`abstract adapter!`);
  }
  preprocess(data) {
    return data;
  }
  toServer(data) {
    return data;
  }
}
const defaultAdapter = new class extends DefaultAdapter {}();


class Loader {
  static get GET_URL() {
    return `https://my-json-server.typicode.com/eduard4ck/gue`;
  }

  static get POST_URL() {
    return `https://jsonplaceholder.typicode.com/posts`;
  }

  static get DEFAULT_NAME() {
    return `Pablo`;
  }

  static get APP_ID() {
    return `48521885`;
  }

  static loadData(adapter = defaultAdapter) {
    return fetch(`${this.GET_URL}/questions`)
      .then((resp) => resp.json())
      .then(adapter.preprocess);
  }

  static loadResults() {
    return fetch(`${this.GET_URL}/results`)
      .then((resp) => resp.json());
  }

  static saveResults(data, adapter = defaultAdapter) {
    data.appid = this.APP_ID;
    data.name = this.DEFAULT_NAME;

    const requestSettings = {
      body: adapter.toServer(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };
    return fetch(this.POST_URL, requestSettings)
      .then(this.checkStatus);
  }

  static checkStatus(resp) {
    if (resp.status >= 200 && resp.status < 300) return resp;
    throw new Error(`${resp.status}: ${resp.statusText}`);
  }
}

Object.prototype.clon = function () {
  return JSON.parse(JSON.stringify(this));
};


export {AbstractView as default, DefaultAdapter, Loader};
