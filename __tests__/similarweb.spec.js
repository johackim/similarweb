const { similarwebRank } = require('../src/similarweb');

test('Should return rank with duckduckgo.com as param', async () => {
    const param = 'duckduckgo.com';

    const rank = await similarwebRank(param);

    expect(typeof rank).toBe('number');
    expect(rank).toBeGreaterThan(10);
});

test('Should return rank with https://duckduckgo.com as param', async () => {
    const param = 'https://duckduckgo.com';

    const rank = await similarwebRank(param);

    expect(typeof rank).toBe('number');
    expect(rank).toBeGreaterThan(10);
});

test('Should return rank with https://duckduckgo.com/about as param', async () => {
    const param = 'https://duckduckgo.com/about';

    const rank = await similarwebRank(param);

    expect(typeof rank).toBe('number');
    expect(rank).toBeGreaterThan(10);
});
