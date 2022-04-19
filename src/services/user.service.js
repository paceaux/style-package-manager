/**
 * @class Service for the user model in the database. This is 
 */
class UserService {
  static bcrypt = require('bcrypt');

  /**
   * @param  {object} database the arango database object
   * @param  {object} aql the aql query object
   */
  constructor(database, aql) {
    this.database = database;
    this.aql = aql;
    this.collection = this.database.collection('users');
  }

  /** converts a plain text password to a hash
   * @param  {string} password
   *
   * @return {string} the hashed password
   */
  static async hashPassword(password) {
    const salt = await UserService.bcrypt.genSalt(15);
    const hash = await UserService.bcrypt.hash(password, salt);

    return hash;
  }

  /**
   * @param  {string} password
   * @param  {string} hash
   *
   * @return {boolean} true if the password matches the hash
   */
  static async comparePassword(password, hash) { 
    const result = await UserService.bcrypt.compare(password, hash);

    return result;
  }

  /**
   * @returns {Promise<Array|null>} all users
   */
  async getAll() {
    let result = null;

    try {
      const all = await this.collection.all();
      result = await all.all();
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }

    return result;
  }

  /** gets a single user by id
   * @param  {string} id
   *
   * @return {Promise<object|null>} the user
   */
  async get(id) {
    let result = null;

    if (!id) {
      throw new Error('Data missing: No id provided');
    }
    try {
      result = await this.collection.document(id);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  /** Checks if user's password and email are valid
   * @param  {string} [email]
   * @param  {string} [password]
   *
   * @return {Promise<boolean>} the user
   */
  async checkUser(email, password) {

    if (!email || !password) {
      throw new Error('Data missing: No email or password provided');
    }

    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error('User: Not found');
    }

    const isValid = await UserService.comparePassword(password, user.password);

    return isValid;
  }

  /**
   * Gets a user by email (login)
   * @param  {string} [email]
   *
   * @return {Promise<object|null>} the user
   */
  async getByEmail(email) {
    let result = null;

    if (!email) {
      throw new Error('Data missing: No email provided');
    }
    try {
      const results = await this.collection.byExample({ email });
      const nextResult = await results.next();
      result = nextResult ? nextResult : null;
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  /**
   * Determines if a given email exists
   * @param  {string} email
   *
   * @return {Promise<boolean>} true if the email exists
   */
  async doesEmailExist(email) {
    let result = false;

    try {
      const user = await this.getByEmail(email);
      result = !!user;
    } catch(error) {
      console.error('Error checking if email exists: ', error);
    }
    return result;
  }

  /**
   * 
   * @typedef UserCreationData
   * @property {string} email
   * @property {string} password
   */
  
  /**
   * 
   * @typedef UserCreatedData
   * @property {string} email
   * @property {string} password
   * @property {string} _key
   */

  /**
   * @param  {UserData} data
   *
   * @return {Promise<UserCreatedData>} the created user
   */
  async create(data) {
    let result = null;

    if (!data) {
      throw new Error('Data missing');
    }

    if (!data.email || !data.password) {
      throw new Error('Data missing: No email or password provided');
    }

    const existingUser = await this.doesEmailExist(data.email);
  
    if (existingUser) {
      throw new Error('User data: Email already exists');
    }

    const password = await UserService.hashPassword(data.password);
    const encryptedData = {
      email: data.email,
      password,
    }

    try {
      result = await this.collection.save(encryptedData);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  /**
   * Updates a user
   * @param  {string} id the _key of the user
   * @param  {UserCreatedData} data
   */
  async update(id, data) {
    let result = null;
  
    if (!id) {
      throw new Error('Data missing: No id provided');
    }
    
    if (!data) {
      throw new Error('Data missing: No user data provided');
    }

    if (data.email) {
      const newUserEmail = data.email;
      const oldUser = await this.get(id);
      const oldUserEmail = oldUser.email;
      const hasNewEmailForUser = oldUserEmail !== newUserEmail;
      let isNewEmailUnique = true;

      if (hasNewEmailForUser) {
        isNewEmailUnique = !(await this.doesEmailExist(newUserEmail));
      }

      if (hasNewEmailForUser && !isNewEmailUnique) {
        throw new Error('User data: Email already exists');
      }
    }

    if (data.password) {
      const password = await UserService.hashPassword(data.password);
      data.password = password;
    }

    try {
      const updateResult = await this.collection.update(id, data, { returnNew: true, returnOld: true});
      result = updateResult.new;
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  /**
   * Deletes a user
   * @param  {string} id the _key of the user
   * @return {Promise<boolean>} true if the user was deleted
   */
  async delete(id) {
    let result = null;

    if (!id) {
      throw new Error('Data missing: No id provided');
    }
    try {
      result = await this.collection.remove(id);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }
}

module.exports = UserService;
