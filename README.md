# xml-plus

Chrome Extension to display XML files built with Vue

## Development

### Requirements

1. `node.js`
2. `yarn`

### Development as regular web app

1. `yarn dev` or `npm run dev`
2. Open `http://localhost:8080/` to start debugging
3. By default it will render `public/xml/default.xml`
4. Add query `?xml=<path to another XML file under [public]>` to debug other XML files

### Test as Chrome Extension

1. `yarn ext` or `npm run ext`
2. Drag and drop `dist` folder into Chrome's Extensions page

### Build release version

`yarn build` or `npm run build`
