import Route from '@/routes/';

class Main extends HTMLElement {
    constructor () {
        super();
        this.child;
        this.root = this.attachShadow({mode: 'open'});
        this._render = this._render.bind(this);
        this._mountChild = this._mountChild.bind(this);
        this._remountChild = this._remountChild.bind(this);
    }

    connectedCallback () {
        this._render();
        this._remountChild();
    }

    _render () {
        this.root.innerHTML = `
            <h2>Typing Game</h2>
            <div id="target"></div>
        `;
        this._mountChild();
    }

    _mountChild () {
        this.child = Route(location.pathname);
        this.root.querySelector('#target').appendChild(this.child);
    }

    _remountChild () {
        this.addEventListener('leave', e => {
            Route.push(
                this.child,
                e.detail,
                location.pathname.includes('score') ? '/' : '/score'
            );
            this._mountChild();
        });
    }
}

customElements.define('x-main', Main, {extends: 'main'});

export default Main;
