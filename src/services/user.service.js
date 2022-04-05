class UserService {
  static bcrypt = require('bcrypt');

  constructor(database, aql) {
    this.database = database;
    this.aql = aql;
    this.collection = this.database.collection('users');
  }

  static async hashPassword(password) {
    const salt = await UserService.bcrypt.genSalt(15);
    const hash = await UserService.bcrypt.hash(password, salt);

    return hash;
  }

  static async comparePassword(password, hash) { 
    const result = await UserService.bcrypt.compare(password, hash);

    return result;
  }

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

  async get(id) {
    let result = null;

    if (!id) {
      throw new Error('No id provided');
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

  async checkUser(email, password) {
    let result = null;

    if (!email || !password) {
      throw new Error('Data missing: No email or password provided');
    }

    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await UserService.comparePassword(password, user.password);

    return isValid;
  }

  async getByEmail(email) {
    let result = null;

    if (!email) {
      throw new Error('No email provided');
    }
    try {
      result = await this.collection.byExample({ email });
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  async create(data) {
    let result = null;

    if (!data) {
      throw new Error('Data missing');
    }

    if (!data.email || !data.password) {
      throw new Error('Data missing:No email or password provided');
    }

    const existingUser = await this.getByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
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

  async update(id, data) {
    let result = null;

    if (!id) {
      throw new Error('Data missing: No id provided');
    }

    if (!data) {
      throw new Error('Data missing: no user data provided');
    }
    try {
      result = await this.collection.update(id, data);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

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
