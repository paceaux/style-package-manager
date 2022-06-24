const DatabaseBuilder = require('./databaseBuilder');

const collectionsMap = new Map([
  ['packages', {
    rule: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        dependencies: { type: 'array' },
        devDependencies: { type: 'array' },
        peerDependencies: { type: 'array' },
        optionalDependencies: { type: 'array' },
      },
      required: ['name', 'description'],
      level: 'new',
      message: 'a package must have a name and description',
    },
  }],
  ['user_profiles', {
    rule: {
      properties: {
        username: { type: 'string' },
        bio: { type: 'string' },
        phone: { type: 'string' },
        website: { type: 'string' },
        github: { type: 'string' },
        twitter: { type: 'string' },
        image: { type: 'string' },
      },
      required: ['username'],
      level: 'new',
      message: 'a user profile must have a username',
    },
  }],
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
      level: 'new',
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
