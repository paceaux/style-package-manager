const { database, aql } = require('../database');
const PackageService = require('../services/package.service');

const packageService = new PackageService(database, aql);
describe('services/package', () => {
  it('should get all packages', async () => {
    const packages = await packageService.getAll();
    expect(packages).toBeTruthy();
  });

  it('should get a package', async () => {
    const stylePackage = await packageService.get('5f9f9a9c3f3d3d3e3d8b4567');
    expect(stylePackage).toBeTruthy();
  });

  it('should create a package', async () => {
    const stylePackage = await packageService.create({
      name: 'test',
      description: 'test',
      administrators: ['5f9f9a9c3f3d3d3e3d8b4567'],
      maintainers: ['5f9f9a9c3f3d3d3e3d8b4567'],
      contributors: ['5f9f9a9c3f3d3d3e3d8b4567'],
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
      optionalDependencies: [],
    });
    expect(stylePackage).toBeTruthy();
  });
});