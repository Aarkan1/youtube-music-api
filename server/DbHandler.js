// Require the better-sqlite3 SQLite driver
const sqlite3 = require('better-sqlite3');

module.exports = class DbHandler {
  constructor(pathToDb) {
    this.db = sqlite3(pathToDb);
  }

  query(sql, parameters) {
    return new Promise((resolve, reject) => {
      // When using the SQLite driver
      // we create (prepared) statements
      const statement = this.db.prepare(sql);
      const command = sql.toLowerCase().startsWith('select') ? 'all' : 'run';

      try {
        resolve(parameters ? statement[command](parameters) : statement[command]());
      }
      catch (error) {
        reject({ error: error.name });
      }
    });
  }

  get(sql, parameters) {
    // When using the SQLite driver
    // we create (prepared) statements
    let statement = this.db.prepare(sql);
    // here we use the statement with the method 
    // all that retrieves all data
    try {
      return parameters ? statement.all(parameters) : statement.all();
    }
    catch (error) {
      return { error: error.name };
    }
  }

  run(sql, parameters) {
    let statement = this.db.prepare(sql);
    // here we use the statement with the method 
    // run (the correct method if it does not return data)
    try {
      return parameters ? statement.run(parameters) : statement.run();
    }
    catch (error) {
      return { error: error.name };
    }
  }
}