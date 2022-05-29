/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const CustomInterface = require('./interface');

class ContextStrategy extends CustomInterface {
  constructor(sheet) {
    super();
    this._sheet = sheet;
  }

  create(data) {
    return this._sheet.create(data);
  }

  getAll() {
    return this._sheet.getAll();
  }

  getById(id) {
    return this._sheet.getById(id);
  }

  getByDescription(description) {
    return this._sheet.getByDescription(description);
  }

  update(id, item) {
    return this._sheet.update(id, item);
  }

  delete(id) {
    return this._sheet.delete(id);
  }
}

module.exports = ContextStrategy;
