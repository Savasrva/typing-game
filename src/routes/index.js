import Game from '../components/game';
import Score from '../components/score';

function Route(url) {
    switch (url) {
        case '/':
            return new Game();
        case '/score':
            return new Score();
        default:
            return new Game();
    }
};


Route.push = function(component, data, url) {
    history.pushState(data, '', url);
    component.remove();
};

export default Route;