class FileService {
  constructor(database, aql) {
    this.database = database;
    this.aql = aql;
    this.collection = this.database.collection('files');
  }

  static getLatest(results) {
    let result = null;

    try {
      [result] = results.sort((a, b) => {
        if (a.version > b.version) return -1;
        if (a.version < b.version) return 1;
        return 0;
      });
      return result;
    } catch (error) {
      return {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
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

    // the key is just the number, the id is 'files/id'
    const documentId = id.indexOf('files') === -1 ? `files/${id}` : id;

    try {
      result = await this.collection.document(documentId);
    } catch (error) {
      result = {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
    return result;
  }

  async getByName(name) {
    let result = null;

    if (!name) {
      throw new Error('No name provided');
    }

    try {
      result = await this.database.query(this.aql`
        FOR file in files
          FILTER file.name == ${name}
          SORT file.version ASC
          RETURN file
      `);
      const results = result.all();
      return results;
    } catch (error) {
      return {
        code: error.code,
        message: error.message,
        stack: error.stack,
      };
    }
  }

  async getByStyleId(id) {
    let result = null;

    try {
      const filesCursor = await this.database.query(this.aql`
        FOR file in files
          FILTER file._key == ${id} || file.styleId == ${id}
          SORT file.version DESC
          RETURN file
      `);
      const results = await filesCursor.all();
      result = results;
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
    // TODO: a create on something of same name creates new version?
    if (!data) {
      throw new Error('No data provided');
    }

    if (!data.name || !data.content || !data.language) {
      throw new Error('No name, content, or description provided');
    }

    const now = new Date();
    const created = now.toISOString();
    const modified = created;
    const version = 0;
    const newData = {
      created,
      modified,
      version,
      ...data,
    };

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

  // update should never alter a record. it should create a new one
  async update(id, fileData, options = { returnNew: true }) {
    let result = null;

    if (!id) {
      throw new Error('No id provided');
    }

    const existingFiles = await this.getByStyleId(id);
    const [existingFile] = existingFiles;
    const newFileData = { ...fileData };

    newFileData.created = existingFile.created;
    newFileData.styleId = existingFile.styleId ? existingFile.styleId : id;
    // eslint-disable-next-line no-underscore-dangle
    newFileData.previous = existingFile._key;
    newFileData.version = existingFile.version + 1;
    newFileData.modified = new Date().toISOString();
    if (!fileData.name) newFileData.name = existingFile.name;
    if (!fileData.language) newFileData.language = existingFile.language;

    try {
      result = await this.collection.save(newFileData);
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
