
# Custom Unit Colored Custom Field Mashup

Output custom field value in color by config.

## Usage

Clone repository. 

Run `npm install`.

Edit `make-webpack-config.js` to make suitable for your needs. Edit source code in `src` folder.

Run `npm run build:development` or `npm run build:all`.

You can install [targetprocess-mashup-uploader](https://github.com/TargetProcess/targetprocess-mashup-uploader) to immediately upload your build to Mashup Manager

```
targetprocess-mashup-uploader --host yourhost --login admin --password admin --name MyMashup --watch dist/index.js
```
