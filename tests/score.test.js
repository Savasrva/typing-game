import Score from '@/components/score';

describe('Score test', () => {
    let score;
    beforeEach(() => {
        score = new Score();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Mounted?', () => {
        document.body.appendChild(score);
        expect(document.querySelector('section')).not.toBe(null);
    });

    test("Score got 0", () => {
        expect(score._completeOrFail()).toBe('Mission Fail!');
    });

    test('Score got 10', () => {
        score.state = {socre: 10};
        expect(score._completeOrFail()).toBe('Mission Complete!');
    });

    test("Empty timesList get average time", () => {
        expect(score._averageTime()).toBe(0);
    });

    test("TimesList get average time", () => {
        score.state = {timesList: [2,2,2]};
        expect(score._averageTime()).toBe(2);
    });

    test('Rendered?', () => {
        score._render();
        expect(score.root.querySelector('button').textContent).toBe('다시시작');
    });

    test('Called componentLeave When Button click?', () => {
        score._componentLeave = jest.fn();
        score._render();
        score.root.querySelector('button').click();
        expect(score._componentLeave).toHaveBeenCalledTimes(1);
    });

    test('Dispatched leave event?', (done) => {
        document.body.appendChild(score);
        document.body.addEventListener('leave', () => {
            expect(1).toEqual(1);
            done();
        });
        score.root.querySelector('button').click();
    });
});