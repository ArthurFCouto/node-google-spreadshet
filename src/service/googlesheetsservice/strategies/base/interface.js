/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
class NotImplementedException extends Error {
  constructor() {
    super('Method Not Implemented');
  }
}

class CustomInterface {
  create(data) {
    throw new NotImplementedException();
  }

  getAll() {
    throw new NotImplementedException();
  }

  getById(id) {
    throw new NotImplementedException();
  }

  getByDescription(description) {
    throw new NotImplementedException();
  }

  update(id, data) {
    throw new NotImplementedException();
  }

  delete(id) {
    throw new NotImplementedException();
  }
}

module.exports = CustomInterface;
