#!/usr/bin/env node

const urlparse = require('./urlparse.js');

module.exports = {
  "parse": function(test) {
    function parseTest(url, object) {
      var parsedUrl = urlparse(url);
      Object.keys(parsedUrl).forEach(function(k) {
        if (typeof parsedUrl[k] !== 'string') delete parsedUrl[k];
      });
      test.deepEqual(parsedUrl, object);
    }

    parseTest(
      "http://apps.mozillalabs.com",
      {
        "host": "apps.mozillalabs.com",
        "authority": "apps.mozillalabs.com",
        "scheme": "http",
        "source": "http://apps.mozillalabs.com"
      }
    );

    parseTest(
      "http://apps.mozillalabs.com/",
      {
        "directory": "/",
        "path": "/",
        "relative": "/",
        "host": "apps.mozillalabs.com",
        "authority": "apps.mozillalabs.com",
        "scheme": "http",
        "source": "http://apps.mozillalabs.com/"
      }
    );

    parseTest(
      "file:///Users/lth/dev/urlmatch/somefile.html",
      {
        "file": "somefile.html",
        "directory": "/Users/lth/dev/urlmatch/",
        "path": "/Users/lth/dev/urlmatch/somefile.html",
        "relative": "/Users/lth/dev/urlmatch/somefile.html",
        "scheme": "file",
        "source": "file:///Users/lth/dev/urlmatch/somefile.html"
      }
    );

    parseTest(
      "https://secu.re:443",
      {
        "port": "443",
        "host": "secu.re",
        "authority": "secu.re:443",
        "scheme": "https",
        "source": "https://secu.re:443"
      }
    );

    parseTest(
      "https://secu.re:443/foo/../bar/x.html",
      {
        "file": "x.html",
        "directory": "/foo/../bar/",
        "path": "/foo/../bar/x.html",
        "relative": "/foo/../bar/x.html",
        "port": "443",
        "host": "secu.re",
        "authority": "secu.re:443",
        "scheme": "https",
        "source": "https://secu.re:443/foo/../bar/x.html"
      }
    );

    parseTest(
      "http://f.oo/dir",
      {
        "file": "dir",
        "directory": "/",
        "path": "/dir",
        "relative": "/dir",
        "host": "f.oo",
        "authority": "f.oo",
        "scheme": "http",
        "source": "http://f.oo/dir"
      }
    );

    parseTest(
      "http://f.oo/dir/",
      {
        "directory": "/dir/",
        "path": "/dir/",
        "relative": "/dir/",
        "host": "f.oo",
        "authority": "f.oo",
        "scheme": "http",
        "source": "http://f.oo/dir/"
      }
    );

    parseTest(
      "http://user@host.com:76543",
      {
        "port": "76543",
        "host": "host.com",
        "user": "user",
        "userInfo": "user",
        "authority": "user@host.com:76543",
        "scheme": "http",
        "source": "http://user@host.com:76543"
      }
    );

    parseTest(
      "http://host.com:12.34/",
      {
        "directory": ".34/",
        "path": ".34/",
        "relative": ".34/",
        "port": "12",
        "host": "host.com",
        "authority": "host.com:12",
        "scheme": "http",
        "source": "http://host.com:12.34/"
      }
    );

    parseTest(
      "http://user:pass@host.com:81?query#anchor",
      {
        "anchor": "anchor",
        "query": "query",
        "relative": "?query#anchor",
        "port": "81",
        "host": "host.com",
        "password": "pass",
        "user": "user",
        "userInfo": "user:pass",
        "authority": "user:pass@host.com:81",
        "scheme": "http",
        "source": "http://user:pass@host.com:81?query#anchor"
      }
    );

    parseTest(
      "http://:pass@host.com",
      {
        "host": "host.com",
        "password": "pass",
        "userInfo": ":pass",
        "authority": ":pass@host.com",
        "scheme": "http",
        "source": "http://:pass@host.com"
      }
    );

    test.done();
  },
  "validate": function(test) {
    function throws(u, m) {
      try {
        urlparse(u).validate();
        test.ok(false, "no exception thrown for " + u);
      } catch(e) {
        test.equal(e.toString(), m);
      }
    }

    test.ok(urlparse("http://apps.mozillalabs.com").validate());
    throws("!@#%!$^!^$", "invalid url: missing scheme");
    throws("://host.com", "invalid url: missing scheme");
    throws("bogus://apps.mozillalabs.com", "invalid url: unsupported scheme: bogus");
    throws("http:", "invalid url: missing host");
    throws("http://host.com:76543", "invalid url: port out of range (76543)");
    throws("http://host.com:0", "invalid url: port out of range (0)");
    throws("http://host.com:12.34", "invalid url: path must start with '/'");
    test.ok(urlparse("http://user:pass@host.com:81#anchor").validate());
    test.done();
  },
  "stringify": function(test) {
    function roundTrip(x) { return urlparse(x).toString(); }
    test.equal(roundTrip("http://apps.mozillalabs.com"), 'http://apps.mozillalabs.com');
    test.equal(roundTrip("http://apps.mozillalabs.com/"), 'http://apps.mozillalabs.com/');
    test.equal(roundTrip("file:///Users/lth/dev/urlmatch/somefile.html"), 'file:///Users/lth/dev/urlmatch/somefile.html');
    test.equal(roundTrip("https://secu.re:443"), 'https://secu.re:443');
    test.equal(roundTrip("https://secu.re:443/foo/../bar/x.html"), 'https://secu.re:443/foo/../bar/x.html');
    test.equal(roundTrip("http://f.oo/dir"), 'http://f.oo/dir');
    test.equal(roundTrip("http://f.oo/dir/"), 'http://f.oo/dir/');
    test.equal(roundTrip("http://user@host.com:76543"), 'http://user@host.com:76543');
    test.equal(roundTrip("http://host.com:12.34/"), 'http://host.com:12.34/');
    test.equal(roundTrip("http://user:pass@host.com:81?query#anchor"), 'http://user:pass@host.com:81?query#anchor');
    test.equal(roundTrip("http://:pass@host.com"), 'http://:pass@host.com');
    test.done();
  },
  "normalize": function(test) {
    function normalize(s) { return urlparse(s).validate().normalize().toString(); };
    test.equal(normalize("http://apps.mozillalabs.com:80"), 'http://apps.mozillalabs.com/');
    test.equal(normalize("http://apps.mozillalabs.com:80/"), 'http://apps.mozillalabs.com/');
    test.equal(normalize("https://apps.mozillalabs.com:443/"), 'https://apps.mozillalabs.com/');
    test.equal(normalize("https://secu.re:443"), 'https://secu.re/');
    test.equal(normalize("https://secu.re:444"), 'https://secu.re:444/');
    test.equal(normalize("http://secu.re:443"), 'http://secu.re:443/');
    test.equal(normalize("https://secu.re:443/foo/../bar/x.html"), 'https://secu.re/bar/x.html');
    test.equal(normalize("http://f.oo:80/dir"), 'http://f.oo/dir');
    test.equal(normalize("http://f.oo/dir/"), 'http://f.oo/dir/');
    test.equal(normalize("http://:pass@host.com:80"), 'http://:pass@host.com/');
    test.done();
  },
  "originOnly": function(test) {
    test.equal(urlparse("http://apps.mozillalabs.com:80/app").originOnly(), "http://apps.mozillalabs.com:80");
    test.equal(urlparse("http://apps.mozillalabs.com:80/?foo=bar").originOnly(), "http://apps.mozillalabs.com:80");
    test.equal(urlparse("https://apps.mozillalabs.com:80#hai").originOnly(), "https://apps.mozillalabs.com:80");
    test.equal(urlparse("http://goog.le/this/one/?has=a_path#andahash").originOnly(), "http://goog.le");
    test.done();
  },
  "contains": function(test) {
    test.ok(urlparse("http://apps.mozillalabs.com:80/app").contains("http://apps.mozillalabs.com/app/somedoc.html"));
    test.equal(urlparse("http://doma.in/appscope/").contains("http://doma.in/appscope"), false);
    test.ok(urlparse("http://doma.in/appscope").contains("http://doma.in/appscope/"));
    test.equal(urlparse("http://doma.in/appscope/").contains("http://doma.in/appscope/somepath/../../attack.html"), false);
    test.ok(urlparse("http://doma.in/appscope/").contains("http://doma.in/appscope/./still_not_attack.html"));
    test.ok(urlparse("http://doma.in:80/wtm/").contains("http://doma.in/wtm/manifest.json"));
    test.ok(urlparse("http://doma.in:80/wtm/").contains("http://doma.in/wtm/manifest.json"));
    test.ok(urlparse("http://doma.in:80").contains("http://doma.in"));
    test.ok(urlparse("https://doma.in:443/").contains("https://doma.in"));
    test.done();
  }
};