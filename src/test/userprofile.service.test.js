/* eslint-disable no-underscore-dangle */
const { database, aql } = require('../database');
const UserProfileService = require('../services/userprofile.service');


const mockData = {
  userProfile1: {
    username: 'test',
    bio: 'test',
    phone: 'test',
    website: 'test',
    github: 'test',
    twitter: 'test',
    image: 'test',
  },
  userProfile2: {
    username: 'test2',
    bio: 'test2',
    phone: 'test2',
    website: 'test2',
    github: 'test2',
    twitter: 'test2',
    image: 'test2',
  },
};
const userProfileService = new UserProfileService(database, aql);
describe('services/userprofile', () => {
  it('should create a profile', async () => {
    const result = await userProfileService.create(mockData.userProfile1);
    expect(result).toBeDefined();
    expect(result.username).toBe('test');
    expect(result).toHaveProperty('_id');
    mockData.userProfile1._id = result._id;
  });
  it('should get a profile', async () => {
    const result = await userProfileService.get(mockData.userProfile1._id);
    expect(result).toBeDefined();
    expect(result.username).toBe('test');
    expect(result).toHaveProperty('_id');
  });
  it('should get all profiles', async () => {

  });
});
