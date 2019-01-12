# XML Plus

Chrome Extension to display XML files built with Vue

## Features

1. Supports both `CSS` and `XPath` selectors.
2. Supports text search and `Regular Expression` search.
3. Both `querySelectorAll` and `jQuery` flavors of CSS selectors are available.
4. `RegEx` is the only **CASE-INSENSITIVE** one.
5. Highly optimized for large XML files ( > 1MB ).
6. Stand-alone version - extremely fast because of avoiding Chrome's slow loading process.
7. Global `x` variable (`window.x`) is available in DevTools which includes:
    * `doc` - raw XML document object
    * `root` - root XML element object
    * `$` - jQuery bound on root element
    * `history` - search results
    * `$q` - helper for jQuery search
    * `cs` - helper for CSS search
    * `re` - helper for RegEx search
    * `tx` - helper for Text search
    * `xp` - helper for XPath search

    > Above helpers are `(expression, baseElement = root) => []` and searching on `baseElement` which is `x.root` by default.

### Links

* [Online Demo](https://sad-fermi-5b5e4f.netlify.com/) - Remote links are very **UNLIKELY** working due to [same-origin policy](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy). Local files should be fine.
* [Github Repo](https://github.com/eGust/xml-plus)
* [Report Bug](https://github.com/eGust/xml-plus/issues)
* [Chrome Extension](https://chrome.google.com/webstore/detail/xml-plus/jmhicemblbmkcbonbhkjmflehkmkiidj)

## TO-DOs

* [ ] Add some themes
* [ ] Able to customize CSS
* [ ] More optimization

---

## Development

## Libraries and techs used

1. `Vue`
2. `Vuex`
3. `lodash/debounce`
4. `jQuery`
5. `document.querySelectorAll`
6. `document.evaluate` for `XPath`
7. `bestzip` for packaging

### Dev Mode

1. `yarn web` or `npm run web`
2. Open `http://localhost:8080/` to start debugging
3. Browse or drop local XML file and click Go!
4. HTTP service running on port 8000 points to `tests` folder with CORS enabled.

### Test as Chrome Extension

1. `yarn watch` or `npm run watch`
2. Drag and drop `dist` folder into Chrome's Extensions page

### Build Static Website

`yarn website` or `npm run website`

> Target folder is `public`

<details><summary>Advanced</summary>

#### Proxy

 You can also pass `PROXY` env variable to enable proxy. For example,

```bash
PROXY="https://my.proxy/get?url=" yarn website
```

When fetching `https://foo.bar/baz.xml`, it will get `https://my.proxy/get?url=https%3A%2F%2Ffoo.bar%2Fbaz.xml` instead. You can implement your own proxy with [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS).

There is an example for [webtask](https://webtask.io):

```js
const zlib = require('zlib');
const fetch = require('node-fetch'); // 3rd-party

module.exports = async (context, req, res) => {
  const { url } = context.query;
  if (!url) {
    res.writeHead(400, { 'Content-Type': 'text/plain'});
    res.end('Required query string `url`');
    return;
  }

  try {
    const response = await fetch(url);
    const { headers } = response;
    Array.from(headers.keys()).forEach((key) => {
      if (key === 'content-type') {
        res.setHeader('Content-Type', headers.get(key));
      }
    });

    res.writeHead(response.status, {
      'Access-Control-Allow-Origin': '*', // IMPORTANT: enables CORS. You can restrict it to your own domain names.
      'Content-Encoding': 'deflate',
      'Cache-Control': 'max-age=3600',
    });

    zlib.deflate(await response.buffer(), (err, buff) => {
      if (err) throw err;
      res.end(buff);
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(err.message);
  }
};
```

</details>

### Chrome Extension

* `yarn watch` or `npm run watch` to build dev in `dist` folder
* `yarn build` or `npm run build` to build prod version
* `yarn deploy` or `npm run deploy` will build and get `deploy/xml-plus.zip` ready for Chrome store

---

<details><summary>Others</summary>

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

```text
Windows 10 1803 x64
Intel i7-6700K
32G RAM
Chrome v71.0.3578.98 x64
```

</details>
