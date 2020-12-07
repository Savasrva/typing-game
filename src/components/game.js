const REQUEST_WORDS_URL = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words';
const SUCCESS = 'SUCCESS';
const FAILED = 'FAILED';
const DESCRIPTION = '시작버튼을 클릭하면 게임이 시작됩니다.';

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
        this.root = this.attachShadow({mode: 'open'});
        this.formEle = document.createElement('form');
        this.headerEle = document.createElement('header');
        this.textEle = document.createElement('h3');
        this.secondEle = document.createElement('h4');
        this.scoreEle = document.createElement('h4');
        this.inputEle = document.createElement('input');
        this.inputEle.placeholder = '이곳에 입력하세요.';
        this.paraEle = document.createElement('p');
        this.buttonEle = document.createElement('button');
        this._setData = this._setData.bind(this);
        this._submit = this._submit.bind(this);
        this._secondChange = this._secondChange.bind(this);
        this._contentsChange = this._contentsChange.bind(this);
        this._render = this._render.bind(this);
        this._timer = this._timer.bind(this);
        this._killTimer = this._killTimer.bind(this);
        this._setStartTime = this._setStartTime.bind(this);
        this._wasteTime = this._wasteTime.bind(this);
        this._nextStep = this._nextStep.bind(this);
        this._toggleInputAndButton = this._toggleInputAndButton.bind(this);
        this._start = this._start.bind(this);
        this._simpleDeepCopy = this._simpleDeepCopy.bind(this);
        this._componentLeave = this._componentLeave.bind(this);
    }
    
    async connectedCallback () {
        await this._setData();
        this._render();
        this._toggleInputAndButton();
    }

    disconnectedCallback () {
        this._killTimer();
    }

    async _setData () {
        this.dataList = await (await fetch(REQUEST_WORDS_URL)).json();
    }

    _submit (e) {
        e.preventDefault();
        if (this.inputEle.value === this.presentData.text) {
            this._nextStep(SUCCESS);
        } else {
            this.paraEle.textContent = '정답을 입력해주세요.';
            setTimeout(() => {
                this.paraEle.textContent = '';
            }, 1000);
        }
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

    _render () {
        const container = document.createElement('div');
        this.buttonEle.addEventListener('click', () => {
            if (this.buttonEle.textContent === '시작') {
                this._start();
            } else {
                this._reset();
            }
        });
        this.formEle.addEventListener('submit', this._submit.bind(this));
        this.textEle.textContent = DESCRIPTION;
        this.headerEle.append(this.secondEle, this.scoreEle);
        this.formEle.appendChild(this.textEle);
        container.append(this.headerEle, this.formEle, this.buttonEle);
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
            p {
                height: 15px;
                font: 900 12px;
                color: red;
            }
            </style>
        `;
        this.root.appendChild(container);
    }

    _timer () {
        this.timerVar = setInterval(() => {
            if (this.presentData.second <= 1) {
                this.score -= 1;
                this._nextStep(FAILED);
                return;
            }
            this.presentData.second -= 1;
            this._secondChange();
        }, 1000);
    }

    _killTimer () {
        if (this.timerVar) {
            clearInterval(this.timerVar);
            this.timerVar = '';
        }
    }

    _setStartTime () {
        this.startTime = new Date().getTime();
    }

    _wasteTime () {
        return new Date(new Date().getTime() - this.startTime).getSeconds();
    }

    _nextStep (flag) {
        if (flag === SUCCESS) {
            this.timesList.push(this._wasteTime());
        }
        if (this.index === (this.dataList.length - 1)) {
            this._componentLeave();
            return;
        }
        this.presentData = this._simpleDeepCopy(this.dataList)[++this.index];
        this._contentsChange();
    }

    _toggleInputAndButton () {
        this.inputEle.disabled = this.inputEle.disabled == true ? false : true;
        this.inputEle.value = '';
        this.buttonEle.textContent = this.buttonEle.textContent === '시작' ? '초기화' : '시작';
    }

    _start () {
        this.formEle.append(this.inputEle, this.paraEle);
        this.presentData = this._simpleDeepCopy(this.dataList)[0];
        this.score = this.dataList.length;
        this._toggleInputAndButton();
        this._contentsChange();
    }

    _reset () {
        this._killTimer();
        this._toggleInputAndButton();
        this.textEle.textContent = DESCRIPTION;
        this.score = 0;
        this.presentData = {};
        this.secondEle.textContent = '';
        this.scoreEle.textContent = '';
        this.root.querySelector('input').remove();
        this.root.querySelector('p').remove();
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