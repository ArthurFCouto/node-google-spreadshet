function stringIncludes(base, description) {
  /*
    O método abaixo remove os caracteres especiais da String
  */
  const descriptionNormalize = description.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const baseNormalize = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const regexp = new RegExp(descriptionNormalize, 'gi');
  return regexp.test(baseNormalize);
}

module.exports = {
  stringIncludes,
};
