const DatabaseBuilder = require('./databaseBuilder');

const collectionsMap = new Map([
  ['packages', {}],
  ['user_profiles', {}],
  ['users', {
    rule: {
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
      level: 'moderate',
      message: 'A user must have an email and a password',
    },
  }],
  ['package_managers', {}],
]);

const spmDb = new DatabaseBuilder(collectionsMap);

(async () => {
  try {
    await spmDb.createCollections();
  } catch (databaseInitError) {
    console.error(databaseInitError);
  }
})();
