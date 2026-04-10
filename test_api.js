const options = {};
const headers = {
  ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
  ...((options.headers) ?? {}),
  ...(true ? { Authorization: `Bearer test` } : {}),
};
console.log(headers);
