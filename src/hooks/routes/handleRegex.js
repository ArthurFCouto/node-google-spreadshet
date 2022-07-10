const { pathToRegexp, match } = require('path-to-regexp');
const handleParams = require('./handleParams');
const config = require('../../server/config');

const { versionUrl } = config;

const handleRegex = (request, requiredPath)=> {
  try {
    const requiredUrl = `${versionUrl}${requiredPath}`;
    const requestUrl = request.url;
    const querySeparatorIndex = requestUrl.indexOf('?');
    const src = querySeparatorIndex !== -1 ? requestUrl.slice(0, querySeparatorIndex) : requestUrl;
    const regexp = pathToRegexp(requiredUrl);
    const isMatch = regexp.test(src);
    if (isMatch) {
      const paths = match(requiredUrl);
      const { params: path } = paths(src);
      request.path = path && JSON.parse(JSON.stringify(path));
      request.params = handleParams(requestUrl, querySeparatorIndex);
    }
    return isMatch;
  } catch {
    return false;
  }
};

module.exports = handleRegex;
