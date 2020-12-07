const REQUEST_WORDS_URL = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words';

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
        this.textEle = document.createElement('h3');
        this.textEle.textContent = '시작버튼을 클릭하면 게임이 시작됩니다.';
        this.secondEle = document.createElement('h4');
        this.scoreEle = document.createElement('h4');
        this.inputEle = document.createElement('input');
        this.inputEle.disabled = true;
        this.inputEle.placeholder = '이곳에 입력하세요.';
        this.buttonEle = document.createElement('button');
        this.buttonEle.textContent = '시작';
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
        this._startAndReset = this._startAndReset.bind(this);
        this._simpleDeepCopy = this._simpleDeepCopy.bind(this);
        this._componentLeave = this._componentLeave.bind(this);
    }
    
    async connectedCallback () {
        await this._setData();
        this._render();
    }

    disconnectedCallback () {
        this._killTimer();
    }

    async _setData () {
        this.dataList = await (await fetch(REQUEST_WORDS_URL)).json();
        this.presentData = this._simpleDeepCopy(this.dataList)[0];
        this.score = this.dataList.length;
    }

    _submit (e) {
        e.preventDefault();
        if (this.inputEle.value === this.presentData.text) {
            this._nextStep('SUCCESS');
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
        const form = document.createElement('form');
        const header = document.createElement('header');
        form.addEventListener('submit', this._submit.bind(this));
        this.buttonEle.addEventListener('click', () => {
            this._startAndReset();
        });
        header.append(this.secondEle, this.scoreEle);
        form.append(this.textEle, this.inputEle);
        container.append(header, form, this.buttonEle);
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
        this.root.appendChild(container);
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
        this._setData();
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