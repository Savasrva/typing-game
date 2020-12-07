import Route from '@/routes/index';
import Game from '@/components/game';
import Score from '@/components/score';

describe('Route test', () => {
    let score;
    const fetch = jest.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve([
                {second: 10, text: 'hello'},
                {second: 11, text: 'world'},
            ]),
        })
    );
    beforeEach(() => {
        score = new Score();
    });

    test('Route return default children', () => {
        expect(Route('/eeeeee')).toBeInstanceOf(Game);
    });

    test('Route return Game', () => {
        expect(Route('/')).toBeInstanceOf(Game);
    });

    test('Route return Score', () => {
        expect(Route('/score')).toBeInstanceOf(Score);
    });

    test('Route.push works well?', () => {
        document.body.appendChild(score);
        expect(document.querySelector('section')).toBeTruthy();

        Route.push(score, {score: 0, timesList: []}, '/test');

        expect(document.querySelector('section')).toBeNull();
        expect(location.pathname).toBe('/test');
    })
});