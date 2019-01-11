# XML Plus

Chrome Extension to display XML files built with Vue

## Features

1. Supports both `CSS` and `XPath` selectors.
2. Supports text search and `Regular Expression` search.
3. Both `querySelectorAll` and `jQuery` flavors of CSS selectors are available.
4. Optimized for big XML responses. I could not find a way to speed up loading local XML files.
5. `RegEx` is the only one **case-insensitive**
6. Stand-alone version - to open local or remote files muck quicker
7. Global `x` variable (`window.x`) is available in DevTools:
    * `doc` - raw XML document object
    * `root` - root XML element object
    * `$` - jQuery bound on root element
    * `history` - search results
    * `$q` - helper to jQuery search
    * `cs` - helper to CSS search
    * `re` - helper to RegEx search
    * `tx` - helper to Text search
    * `xp` - helper to XPath search

    > Above helpers are `(expression, el = root) => []` and searching on root element.

## Libraries and techs used

1. `Vue`
2. `Vuex`
3. `lodash/debounce`
4. `jQuery`
5. `document.querySelectorAll`
6. `document.evaluate` for `XPath`
7. `bestzip` for packaging

## TO-DOs

- [ ] Add some themes
- [ ] Able to customize CSS
- [ ] More optimization

---

## Development

### Dev Mode

1. `yarn web` or `npm run web`
2. Open `http://localhost:8080/` to start debugging
3. Browse or drop local XML file and click Go!
4. HTTP service running on port 8000 points to `tests` folder with CORS enabled.

### Test as Chrome Extension

1. `yarn watch` or `npm run watch`
2. Drag and drop `dist` folder into Chrome's Extensions page

### Web Prod Version

`yarn website` or `npm run website`

> Target folder is `public`

### Web with Proxy

 You can also pass `PROXY` env variable to enable proxy. For example,

```bash
PROXY="https://my.proxy/get?url=" yarn website
```

When fetching `https://foo.bar/baz.xml`, it will get `https://my.proxy/get?url=https%3A%2F%2Ffoo.bar%2Fbaz.xml` instead. You can implement your own proxy with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

There is an example for [webtask](https://webtask.io):

```js
const fetch = require('node-fetch');
const zlib = require('zlib');

module.exports = async (context, req, res) => {
  const { url } = context.query;
  const useCache = !context.query['nocache'];
  if (!url) {
    res.writeHead(400, { 'Content-Type': 'text/plain'});
    res.end('Required query string "url"');
    return;
  }

  console.log(url);
  try {
    const response = await fetch(url);
    const { headers } = response;
    Array.from(headers.keys()).forEach((key) => {
      if (key === 'content-type') {
        res.setHeader('Content-Type', headers.get(key));
      }
    });

    res.writeHead(response.status, {
      'access-control-allow-origin': '*',
      'Content-Encoding': 'deflate',
      'Cache-Control': useCache ? 'max-age=3600' : 'max-age=0',
    });

    const buf = await response.buffer();
    zlib.deflate(buf, function (_, result) {
      res.end(result);
    });
  } catch (e) {
    console.log(e);
    res.writeHead(500, { 'Content-Type': 'text/plain'});
    res.end(e.message);
  }
};
```

---

## Benchmarks

### Candidates

1. Chrome - the browser itself
2. `** * *** ****` - Another Extension available on Chrome Store and open-sourced on Github. Will use `X` to represent it.
3. XML Plus

### Method

1. Serve XML files on localhost
2. Open Chrome Developer Tools
3. Turn-on/off Extension to test
4. Kill the tab in Chrome Task Manager to avoid memory operation
5. Empty Cache and Hard Reload XML file via local network
6. Repeat step 4 to 5 and skip the first read.

> Since Extension `X` needs more time to render the page, I put some extra code to calculate real time. The code is something like:

    ```js
    document.addEventListener('readystatechange', function() {
      console.time('ready');
      // ... main code
    });

    // Inside another function
    function xxx() {
      sendMessage(..., function () {
        // ...
        sendMessage(..., function () {
          // ... it will generate DOM here
          setTimeout(() => {
            console.timeEnd('ready');
          }, 0);
        });
      });
    }
    ```

### Results

1. Round 1: 2MiB XML file (Total 41248 nodes; Max Depth: 5)
    * Chrome: 14.55s, 14.34s, 15.19s
    * X: 3.54s + 1141ms, 3.46s + 738ms, 2.94s + 898ms
    * XML Plus: 4.12s, 3.89s. 4.18s

2. Round 2: 5.2MiB XML file (Total 113126 nodes; Max Depth: 4)
    * Chrome: 34.10s, 34.82s, 33.9s (7.7s~8.0s `DOMContentLoaded`)
    * X: 8.50s + 3968ms, 8.74s + 3976ms, 8.44s + 3965ms (7.7s~8.0s `DOMContentLoaded`)
    * XML Plus: 7.32s, 7.30s, 7.50s (4.8s~5.0s `DOMContentLoaded`)

3. Round 3: 14.4MiB XML file (Total 307067 nodes; Max Depth: 4)
    * Chrome: 3.2min (~42s `DOMContentLoaded`)
    * X: 43.72s + 17449ms (~42s `DOMContentLoaded`)
    * XML Plus: 22.32s, 24.01s, 22.04s (13.6s~15.8s `DOMContentLoaded`)

* Some Conclusions:
    1. `DOMContentLoaded` is not avoidable.
    2. `text/xml` and `application/xml` take much longer time than `text/plain` which I used. If you know a better way to make Chrome avoid rendering while processing responses, please let me know!
    3. Chrome will take 1.1min+ If you don't End Process in Task Manager. It will take much longer if the tab used too much memory.
    4. In Round 2 you can see the styles of X will be applied after `ready`, while in Round 3 it took 7s+ to apply styles.

### Environment

```
Windows 10 1803 x64
Intel i7-6700K
32G RAM
Chrome v71.0.3578.98 x64
```

## FAQ

* Have you tried even bigger file?

    > Yes I did. I loaded a 38.7MiB XML (Total 824347 nodes; Max Depth: 4). It took 45s to get `DOMContentLoaded` and spent another ~30s to get the result.

* Can XML Plus be even faster?

    > Yes. I am planning to avoid going through all nodes at the beginning when the document is ready. Move it to a background worker so it should immediately get a meaningful result after `DOMContentLoaded`.

* Can you improve the speed of loading local XML files?

    > Probably I can't. I tried really hard but seems like Chrome will always do a stupid loading.

* Will you provide a standalone version?

    > Yes. I have a plan. Maybe later I will make an Electron version.
