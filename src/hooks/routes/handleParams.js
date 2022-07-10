const handleParams = (requestUrl, querySeparatorIndex)=> {
  const raw = querySeparatorIndex !== -1 && requestUrl.slice(querySeparatorIndex + 1, requestUrl.length);
  if (raw) {
    const list = raw.split('&').map((item)=> {
      const [key, value] = item.split('=');
      return `"${key}" : "${value}"`;
    });
    const paramsJson = JSON.parse(`{${list.join(',')}}`);
    return paramsJson;
  }
  return raw;
};

module.exports = handleParams;
