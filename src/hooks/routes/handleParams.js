const handleParams = (request, querySeparatorIndex)=> {
  const { url } = request;
  const raw = querySeparatorIndex !== -1 && url.slice(querySeparatorIndex + 1, url.length);
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
