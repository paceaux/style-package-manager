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
