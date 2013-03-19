var urlparse = require('./urlparse.js');

var burl = urlparse("https://browserid.org:443/some/path/to/a/../doc.html");

console.log("components of '" + burl.source + "':");

Object.keys(burl).forEach(function(key) {
  if (key === 'contains') return;
  console.log(" ", key + ":", (typeof burl[key] === 'string') ? burl[key] : burl[key]().toString());
});
