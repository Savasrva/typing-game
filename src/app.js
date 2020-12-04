import Route from './routes';
import './app.css';

class App extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this._init();
        this._render();
        this._mountChild();
    }

    _init() {
        this.child = Route(location.href);
        this.addEventListener('leave', e => {
            const targetPath = location.pathname.includes('score') ? '/' : '/score';
            Route.push(this.child, e.detail, targetPath);
            this.child = Route(location.pathname);
            this._mountChild();
        });
    }

    _render() {
        this.root.innerHTML = `
            <h2>Typing Game</h2>
            <slot id="target"></slot>
        `;
    }

    _mountChild() {
        this.root.getElementById('target').appendChild(this.child);
    }
}

customElements.define('x-app', App, {extends: 'main'});
const app = new App();

document.getElementById('app').appendChild(app);
