class Game extends HTMLElement {
    constructor () {
        super();
        this.dataList = [];
        this.presentData = {};
        this.index = 0;
        this.score = 0;
        this.timerVar;
        this.startTime;
        this.timesList = [];
        this.root;
        this._shadowRootStyle();
        this.textEle = document.createElement('h3');
        this.textEle.textContent = '시작버튼을 클릭하면 게임이 시작됩니다.';
        this.secondEle = document.createElement('h4');
        this.scoreEle = document.createElement('h4');
        this.inputEle = document.createElement('input');
        this.inputEle.disabled = true;
        this.inputEle.placeholder = '이곳에 입력하세요.';
        this.buttonEle = document.createElement('button');
        this.buttonEle.textContent = '시작';

    }
    
    connectedCallback () {
        this._fetch().then(dataList => {
            this.dataList = dataList;
            this._init();
            return this._draw();
        })
        .then(template => {
            this._render(template);
        });
    }

    disconnectedCallback () {
        this._killTimer();
    }

    _shadowRootStyle () {
        this.root = this.attachShadow({mode: 'open'});
        this.root.innerHTML = `
            <style>
            header {
                display: flex;
                justify-content: space-around;
            }
            form {
                margin-bottom: 10px;
            }
            button {
                width: 170px;
                height: 35px;
                border-color: #fff;
                border-radius: 5px;
                background-color: #6cbcdc;
                color: #fff;
            }
            input {
                width: 200px;
                height: 20px;
                border: 2px solid #ea9d9d;
                border-radius: 5px;
            }
            </style>
        `;
    }

    _init () {
        this.presentData = this._simpleDeepCopy(this.dataList)[0];
        this.score = this.dataList.length;
        this.index = 0;
        this.timesList = [];
        this.startTime = '';
        this._killTimer();
    }

    _fetch () {
        return window.fetch('https://my-json-server.typicode.com/kakaopay-fe/resources/words')
            .then(function(response) {
                return response.json();
            });
    }

    _draw () {
        const container = document.createElement('div');
        const form = document.createElement('form');
        const header = document.createElement('header');
        form.addEventListener('submit', this._submit.bind(this));
        this.buttonEle.addEventListener('click', () => {
            this._startAndReset();
        });
        header.append(this.secondEle, this.scoreEle);
        form.append(this.textEle, this.inputEle);
        container.append(header, form, this.buttonEle);
        return container;
    }

    _submit (e) {
        e.preventDefault();
        if (this.inputEle.value === this.presentData.text) {
            this._nextStep('SUCCESS');
        }
    }

    _redraw () {
        this._contentsChange();
    }

    _secondChange () {
        this.secondEle.textContent = `남은 시간: ${this.presentData.second}초`;
    }

    _contentsChange () {
        this.textEle.textContent = this.presentData.text;
        this.scoreEle.textContent = `점수: ${this.score}점`;
        this.inputEle.focus();
        this.inputEle.value = '';

        this._secondChange();
        this._setStartTime();
        this._killTimer();
        this._timer();
    }

    _render (template) {
        this.root.appendChild(template);
    }

    _timer () {
        this.timerVar = setInterval(() => {
            if (this.presentData.second <= 1) {
                this.score -= 1;
                this._nextStep('FAILED');
                return;
            }
            this.presentData.second -= 1;
            this._secondChange();
        }, 1000);
    }

    _killTimer () {
        if (this.timerVar) clearInterval(this.timerVar);
    }

    _setStartTime () {
        this.startTime = new Date().getTime();
    }

    _wasteTime () {
        return new Date(new Date().getTime() - this.startTime).getSeconds();
    }

    _nextStep (flag) {
        if (flag === 'SUCCESS') {
            this.timesList.push(this._wasteTime());
        }
        if (this.index === (this.dataList.length - 1)) {
            this._componentLeave();
            return;
        }
        this.presentData = this._simpleDeepCopy(this.dataList)[++this.index];
        this._contentsChange();
    }

    _startAndReset () {
        this._init();
        this.inputEle.disabled = false;
        this.buttonEle.textContent = '초기화';
        this._contentsChange();
    }

    _simpleDeepCopy (object) {
        return JSON.parse(JSON.stringify(object));
    }

    _componentLeave () {
        this.dispatchEvent(new CustomEvent('leave', {
            bubbles: true,
            composed: true,
            detail: {
                score: this.score,
                timesList: this.timesList
            }
        }));
    }
}

customElements.define('x-game', Game, {extends: 'section'});

export default Game;