import Game from '@/components/game';

jest.useFakeTimers();
describe('Game test', () => {
    let game;
    let data;
    global.fetch = jest.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve(data),
        })
    );
    beforeEach(() => {
        game = new Game();
        data = [
            {second: 10, text: 'hello'},
            {second: 11, text: 'world'},
        ];
        fetch.mockClear();
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllTimers();
    });

    test('Mounted?', () => {
        document.body.appendChild(game);
        expect(document.querySelector('section')).not.toBe(null);
    });

    test('Set a data?', async () => {
        await game._setData();
        expect(game.dataList).toEqual(data);
    });

    test('Deep copy data', () => {
        const firstData = game._simpleDeepCopy(data[0]);
        firstData.second = 3;
        expect(firstData).not.toBe(data[0].second);
    });

    test('Get a waste time?', () => {
        const wasteTime = jest.spyOn(game, '_wasteTime');
        game._setStartTime();
        game._wasteTime();

        jest.advanceTimersByTime(1000);
        expect(wasteTime).toBeCalledTimes(1);
    });

    test('Toggle Input And Button', () => {
        const value = game.buttonEle.textContent;
        game._toggleInputAndButton();
        expect(value).not.toBe(game.buttonEle.textContent);
    });

    test('Call Start and Reset?', async () => {
        await game._setData();
        game._render();
        game._toggleInputAndButton();

        expect(game.buttonEle.textContent).not.toBe('초기화');

        game._start();
        expect(game.buttonEle.textContent).toBe('초기화');

        game._reset = jest.fn();
        game._contentsChange = jest.fn();
        game.root.querySelector('button').click();
        expect(game._reset).toHaveBeenCalledTimes(1);
    });

    test('Call timer and killTimer?', () => {
        game.dataList = [{second: 1, text: 'hello'}];
        game.presentData = game._simpleDeepCopy(game.dataList)[0];
        game.score = game.dataList.length;
        game._render();
        game._start();
        
        expect(game.timerVar).toBeTruthy();

        game._killTimer();
        expect(game.timerVar).toBeFalsy();
    });

    test('Submited input value to match text?', async () => {
        await game._setData();
        game._start();
        game._render();
        game.inputEle.value = 'hello';
        game._nextStep = jest.fn();
        const e = {preventDefault: function () {}};
        game._submit(e);
        expect(game._nextStep).toHaveBeenCalledTimes(1);
    });

    test('Submited input value to match text?', async () => {
        await game._setData();
        game._render();
        const e = {preventDefault: function () {}};
        game.inputEle.value = 'hey';
        game._submit(e);
        expect(game.paraEle.textContent).not.toBeFalsy();
    });

    test('Called componentLeave when finished', async () => {
        game._componentLeave = jest.fn();
        await game._setData();
        game._render();
        game.index = 1;
        game.presentData = game._simpleDeepCopy(game.dataList[game.index]);
        game._nextStep('FAILED');
        expect(game._componentLeave).toHaveBeenCalledTimes(1);
    });
});