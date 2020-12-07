class Score extends HTMLElement {
    constructor () {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.buttonEle = document.createElement('button');
        this.buttonEle.textContent = '다시시작';
        this.buttonEle.addEventListener('click', () => {
            this._componentLeave();
        });
        this.state = history.state || {score: 0, timesList: []};

        this._render = this._render.bind(this);
        this._completeOrFail = this._completeOrFail.bind(this);
        this._averageTime = this._averageTime.bind(this);
        this._componentLeave = this._componentLeave.bind(this);
    }

    connectedCallback () {
        this._render();
    }

    _render () {
        this.root.innerHTML = `
            <style>
                button {
                    width: 170px;
                    height: 35px;
                    border-color: #fff;
                    border-radius: 5px;
                    background-color: #6cbcdc;
                    color: #fff;
                }    
            </style>
            <h3>${this._completeOrFail()}</h3>
            <h3>당신의 점수는 ${this.state.score}점입니다.</h2>
            <h5>단어당 평균 답변 시간은 ${this._averageTime()}초입니다.</h3>
            <h6>틀린 문제의 소요시간은 평균시간에 포함되지 않습니다.</h5>
        `;
        this.root.appendChild(this.buttonEle);
    }

    _completeOrFail () {
        return this.state.score === 0 ? 'Mission Fail!' : 'Mission Complete!';
    }

    _averageTime () {
        const timesList = this.state.timesList;
        if (timesList.length === 0) {
            return 0;
        }
        return Math.round(timesList.reduce((a, b) => {return a + b}, 0) / timesList.length);
    }

    _componentLeave () {
        this.dispatchEvent(new CustomEvent('leave', {
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define('x-score', Score, {extends: 'section'});

export default Score;
