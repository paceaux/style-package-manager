class PackageManagerService {
  constructor(database, aql) {
    this.database = database;
    this.aql = aql;
    this.collection = this.database.collection('package_managers');
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

  async create(data) {
    let result = null;

    if (!data) {
      throw new Error('No data provided');
    }

    if (!data.name || !data.description) {
      throw new Error('No name or description provided');
    }

    if (data.administrators.length === 0) {
      throw new Error('A package manager must have an administrator');
    }
    try {
      result = await this.collection.save(data);
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
      throw new Error('No id provided');
    }

    if (!data) {
      throw new Error('No data provided');
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
      throw new Error('No id provided');
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

module.exports = PackageManagerService;
