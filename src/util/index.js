function stringIncludes(actual, compare) {
  /*
    O método abaixo remove os caracteres especiais da String
  */
  return actual.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .includes(compare.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
}

module.exports = {
  stringIncludes,
};
