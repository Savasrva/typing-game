import Main from '@/components/main';
import Game from '@/components/game';
import Score from '@/components/score';

describe('Main test', () => {
    let main;
    global.fetch = jest.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve([
                {second: 10, text: 'hello'},
                {second: 11, text: 'world'},
            ]),
        })
    );
    beforeEach(() => {
        main = new Main();
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Mounted default children?', () => {
        main._render();
        expect(main.child).toBeInstanceOf(Game);
    });

    test('Rendered?', () => {
        main._render();
        expect(main.root.querySelector('h2').textContent).toBe('Typing Game');
    });
});