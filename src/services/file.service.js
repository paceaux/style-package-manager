class FileService {
  constructor(database, aql) {
    this.database = database;
    this.aql = aql;
    this.collection = this.database.collection('files');
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

    if (!data.name || !data.content || !data.language) {
      throw new Error('No name, content, or description provided');
    }

    const now = new Date();
    const created = now.toISOString();
    const modified = created;
    const newData = { created, modified, ...data };

    try {
      result = await this.collection.save(newData);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  async update(id, fileData, options = { returnNew: true }) {
    let result = null;

    if (!id) {
      throw new Error('No id provided');
    }

    const newFileData = { ...fileData };

    // don't ever modify the created date. it's immutable
    if (newFileData.created) {
      delete newFileData.created;
    }

    newFileData.modified = new Date().toISOString();

    try {
      result = await this.collection.update(id, newFileData, options);
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

module.exports = FileService;
