const arangojs = require('arangojs');

const { Database, aql } = arangojs;
const arangoDb = new Database({
  url: 'http://127.0.0.1:8529',
  databaseName: 'spm',
  auth: {
    username: 'spm-root',
    password: 'spmroot',
  },
});

arangoDb.useDatabase('spm');
arangoDb.useBasicAuth('spm-root', 'spmroot');
module.exports = {
  database: arangoDb,
  aql,
};
