const { database, aql } = require('../database');
const FileService = require('../services/file.service');

const fileService = new FileService(database, aql);
describe('services/file', () => {
  it('should get all files', async () => {
    const files = await fileService.getAll();
    expect(files).toBeTruthy();
  });
  it('should create a file', async () => {
    const file = await fileService.create({
      _key: '12345',
      name: 'test.css',
      content: 'body { color: red; }',
      language: 'css',
    });
    expect(file).toBeTruthy();
    expect(file).toHaveProperty('_key');
  });
  it('should get a file', async () => {
    const file = await fileService.get('files/12345');
    expect(file).toBeTruthy();
    expect(file).toHaveProperty('content');
    expect(file).toHaveProperty('name');
  });
  it('should update a file', async () => {
    const updated = await fileService.update(
      'files/12345',
      {
        content: 'body { color: blue; }',
      },
    );
    expect(updated).toBeTruthy();
    expect(updated).toHaveProperty('new');
    expect(updated.new).toHaveProperty('content', 'body { color: blue; }');
  });
  it('should delete a file', async () => {
    const deleted = await fileService.delete('files/12345');
    expect(deleted).toBeTruthy();
  });
});
