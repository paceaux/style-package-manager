/* eslint-disable no-underscore-dangle */
const { database, aql } = require('../database');
const UserService = require('../services/user.service');

const userService = new UserService(database, aql);

const mockData = {
  seedUser: {
    email: 'foo@bar.com',
  },
  testUser1: {
    email: 'one@testUser.com',
    password: 'password',
  },
  testUser2: {
    email: 'two@testUser.com',
    password: 'password',
  },
  testUser3: {
    email: 'three@testUser.com',
    password: 'password',
  },
};

describe('services/user', () => {
  describe('services/user/static', () => {
    it('should have a static bcrypt property', () => {
      expect(UserService.bcrypt).toBeDefined();
    });
    it('should have a static hashPassword method', () => {
      expect(UserService.hashPassword).toBeDefined();
    });
    it('should have a static comparePassword method', () => {
      expect(UserService.comparePassword).toBeDefined();
    });
    it('shouldHashPasswords', async () => {
      const password = 'password';
      const hash = await UserService.hashPassword(password);
      expect(hash).toBeTruthy();
      expect(hash).not.toEqual(password);
    });
    it('shouldComparePasswords', async () => {
      const password = 'password';
      const hash = await UserService.hashPassword(password);
      const result = await UserService.comparePassword(password, hash);
      expect(result).toBe(true);
    });
  });
  describe('services/user/create', () => {
    it('should create a new User', async () => {
      const user = await userService.create(mockData.testUser1);

      if (user && user._key) {
        mockData.testUser1._key = user._key;
      }
      expect(user).toBeTruthy();
      expect(user._key).toBeTruthy();
    });
    it('should throw an error with no data', async () => {
      expect(async () => userService.create(null))
        .rejects
        .toThrowError('Data missing');
    });
    it('should throw an error with missing email or password', async () => {
      expect(async () => userService.create({}))
        .rejects
        .toThrowError('Data missing: No email or password provided');
    });
    it('should throw an error with duplicate emails', async () => {
      expect(async () => userService.create(mockData.testUser1))
        .rejects
        .toThrowError('User data: Email already exists');
    });
  });
  describe('services/user/getByEmail', () => { 
    it('should find a testUser by email', async () => {
      const user = await userService.getByEmail(mockData.testUser1.email);
      expect(user).toBeTruthy();
      expect(user._key).toBeTruthy();
    });
    it('should get null for unfound user by email', async () => {
      const user = await userService.getByEmail('null@user.com');
      expect(user).toBe(null);
    });
    it('should throw an error with no email', async () => {
      expect(async () => userService.getByEmail(null))
        .rejects
        .toThrowError('Data missing: No email provided');
    });
  });
  describe('services/user/get', () => {
    it('should get all users', async () => {
      const users = await userService.getAll();
      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThan(0);
    });
    it('should get a user by id', async () => {
      const user = await userService.get(mockData.testUser1._key);
      expect(user).toBeTruthy();
      expect(user._key).toBeTruthy();
      expect(user.email).toBe(mockData.testUser1.email);
      expect(user.password).not.toBe(mockData.testUser1.password);
    });
    it('should throw an error with no id', async () => {
      expect(async () => userService.get(null))
        .rejects
        .toThrowError('Data missing: No id provided');
    });
  });
  describe('services/user/checkuser', () => {
    it('gets a success when validating a preexisting user', async () => {
      const result = await userService.checkUser(mockData.testUser1.email, mockData.testUser1.password);
      expect(result).toBe(true);
    });
    it('throws an error if no email or password is sent', async () => {
      expect(async () => userService.checkUser(null, null))
        .rejects
        .toThrowError('Data missing: No email or password provided');
    });
    it('throws an error if it can\'t find the user', async () => {
      expect(async () => userService.checkUser('foo', 'bar'))
        .rejects
        .toThrowError('User: Not found');
    });
  });
  describe('services/user/update', () => {
    it('gets a success when updating a user email', async () => {
      const user = await userService.update(mockData.testUser1._key, { email: mockData.testUser2.email });
      expect(user).toBeTruthy();
      expect(user.email).toEqual(mockData.testUser2.email);
    });
    it('gets a success when updating a user email and it the email does not change ', async () => {
      const user = await userService.update(mockData.testUser1._key, mockData.testUser2);
      expect(user).toBeTruthy();
      expect(user.email).toEqual(mockData.testUser2.email);
    });
    it('encrypts the password when updating a user password', async () => {
      const user = await userService.update(mockData.testUser1._key, { password: 'foo' });

      expect(user.password).not.toEqual('foo');
    });
    it('should throw an error if trying to update and the email already exists', async () => {
      const preexistingUser = await userService.create(mockData.testUser3);
      mockData.testUser3._key = preexistingUser._key;

      expect(async () => userService.update(mockData.testUser1._key, mockData.testUser3))
        .rejects
        .toThrowError('User data: Email already exists');
    });
    it('should throw an error with no id', async () => {
      expect(async () => userService.update(null, mockData.testUser1))
        .rejects
        .toThrowError('Data missing: No id provided');
    });
    it('should throw an error with no data', async () => {
      expect(async () => userService.update('foo', null))
        .rejects
        .toThrowError('Data missing: No user data provided');
    });
  });
  describe('services/user/delete', () => {
    it('deletes a user by id', async () => {
      const result = await userService.delete(mockData.testUser1._key);
      const result2 = await userService.delete(mockData.testUser3._key);
      expect(result).toBeTruthy();
      expect(result2).toBeTruthy();
    });
    it('throws an error if no id is sent', async () => {
      expect(async () => userService.delete())
        .rejects
        .toThrowError('Data missing: No id provided');
    });
  });
});
