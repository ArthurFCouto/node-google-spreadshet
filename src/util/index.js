function stringIncludes(actual, compare) {
  return actual.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .includes(compare.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
}

module.exports = {
  stringIncludes,
};
