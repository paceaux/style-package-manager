const { database } = require('./index');

class DatabaseBuilder {
  collections = new Map();

  constructor(collectionMap ,db = database) {
    this.database = db;
    this.collectionSchemas = collectionMap;
  }

  /**
   * @param  {Array} array
   * @param  {function} callback
   */
  static async forEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  /**
   * @param  {string} collectionName
   * @param  {Object} schema
   */
  async createCollection(collectionName, schema) {
    let result = null;
    try {
      const collection = this.database.collection(collectionName);
      const exists = await collection.exists();
      if (!exists) {
        result = await collection.create({schema});
      } else if (schema && Object.keys(schema).length > 0) {
        result = await collection.properties({schema});
      }
    } catch (createCollectionErr) {
      result = createCollectionErr;
    }
    return result;
  }

  /**
   * @param  {Map} collections=this.collectionSchemas
   */
  async createCollections(collections = this.collectionSchemas) {
    try {
      await DatabaseBuilder.forEach([...collections.keys()], async (collectionName) => {
        const collection = await this.createCollection(collectionName, collections.get(collectionName));
        this.collections.set(collectionName, collection);
      });
    } catch (createCollectionsErr) {
      console.error(createCollectionsErr);
    }
  }
}

module.exports = DatabaseBuilder;


