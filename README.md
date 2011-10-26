A simple and focused javascript library which supports basic URL parsing
and 'url prefix' testing.

The first feature of urlmatch is its ability to parse a url into components:

    console.log(URLParse("http://google.com/"));
    {
        "directory": "/",
        "path": "/",
        "relative": "/",
        "host": "google.com",
        "authority": "google.com",
        "scheme": "http",
        "source": "http://google.com/"
    }

urlmatch can also validate urls:

    $ URLParse("httpe://www.google.com/").validate();
    Error: invalid url: unsupported scheme: httpe

can also normalize urls:

    $ URLParse("http://www.google.com:80/foo/../bar/").normalize();
    http://www.google.com/bar/

And finally, urlmatch can combine all of these features to support
robust url prefix matching:

    $ URLParse("http://doma.in/appscope/").contains("http://doma.in/appscope/somepath/../../attack.html");
    false
    $ URLParse("http://doma.in/appscope/").contains("http://doma.in/appscope/somepath/../not_attack.html");
    true
