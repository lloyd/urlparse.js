/**
 * urlmatch.js 
 *
 * Includes parseUri (c) Steven Levithan <stevenLevithan.com> Under the MIT License
 *
 * URL.parse(string) -
 *   parse a url using the 'parseUri' algorithm, returning an object containing various
 *   uri components.
 *
 * URL. 
 *  + parse a url into components
 *  + canonicalize url
 *  + 
 */

URL = (function() {
    /* const */ var INV_URL = "invalid url: ";
	  var parseUrl = function(s) {
        var toString = function() {
            return "astring";
        };
        
        var validate = function() {
            if (!this.scheme) throw INV_URL +"missing scheme";
            if (this.scheme !== 'http' && this.scheme !== 'https') 
                throw INV_URL + "unsupported scheme: " + this.scheme;
            console.log(this.scheme);
            return;
        };

        var normalize = function() {
            return;
        };

		    // parseUri 1.2.2
		    // (c) Steven Levithan <stevenlevithan.com>
		    // MIT License
		    var parseUri = function(str) {
			      var	o   = parseUri.options,
				    m   = o.parser.exec(str),
				    uri = {},
				    i   = 14;

		        while (i--) if (m[i]) uri[o.key[i]] = m[i];

            if (uri[o.key[12]]) {
    			      uri[o.q.name] = {};
			          uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				            if ($1) uri[o.q.name][$1] = $2;
			          });
            }
            // member functions
            uri.toString = toString;
            uri.validate = validate;
            uri.normalize = normalize;
			      return uri;
		    };

		    parseUri.options = {
			      key: ["source","scheme","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
			      q:   {
				        name:   "queryKey",
				        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			      },
			      parser: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
		    };
		    // end parseUri
		    
		    // parse URI using the parseUri code and return the resultant object
		    return parseUri(s);
	  };
	  
	  return {
		    parse: parseUrl
	  };
})();
