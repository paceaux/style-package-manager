const { database } = require('./index');

describe('database test', () => {
  it('connects to an spm database', async () => {
    expect(database.name).toEqual('spm');
  });
});
