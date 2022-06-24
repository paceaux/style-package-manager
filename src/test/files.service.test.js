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
      name: 'test.css',
      content: 'body { color: red; }',
      language: 'css',
    });
    expect(file).toBeTruthy();
    expect(file).toHaveProperty('_key');
  });
  it('should get a file', async () => {
    const file = await new FileService(database, aql).get('5f9f9a9c3f3d3d3e3d8b4567');
    expect(file).toBeTruthy();
  });
});
