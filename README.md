#### You might want to use this instead: [postcss-url](https://github.com/postcss/postcss-url)
Found it after I built this repo 🙈


<br/><br/><br/><br/><br/><br/>
postcss-url-base64, a [PostCSS](https://github.com/postcss/postcss/) plugin, replaces values inside `url()` functions with their base64 encoded strings.

[GitHub](https://github.com/schadenn/postcss-base64) | [NPM](https://www.npmjs.com/package/postcss-url-base64) | [@denyo357](https://twitter.com/denyo357)

#### Note
I took some inspiration from [postcss-base64](https://github.com/jelmerdemaat/postcss-base64). But since the project is no longer maintained and it wasn't working for my use-case I built this.

## Install

Install it from [NPM](https://www.npmjs.com/package/postcss-url-base64):

```
npm install postcss-url-base64
```

## Use

Load this plugin as a PostCSS module and use the following options:

#### extensions

_Default:_ `[".png", ".svg", ".jpg"]`

An array of extensions of files that have to be encoded, including the leading dot.

`extensions: [".woff", ".woff2"]`

#### root

_Default:_ `process.cwd()`

A root folder in which to search for the files. The path in the CSS file gets appended to this.

`root: 'any/path/to/files/'`

#### dataType

_Default:_ `` fileExt => `data:image/${fileExt};base64,` ``

A function that should return the prepended data-type. The file extension will be passed as a parameter.

`` dataType: fileExt => `data:font/${fileExt};base64,` ``

#### removeMultiple

_Default:_ `false`

Boolean, if true, consecutive `url()` definitions will be removed.

Example:

```css
@font-face {
    src: url("font.woff2") format("woff2"),
        url("font.woff") format("woff"); <-- this will be removed
}
```

### Example usage

Using PostCSS in NodeJS, the approach would be as follows:

```js
const opts = {
  extensions: [".woff2", ".woff"], // Replaces woff2 and woff files
  dataType: fileExt => `data:font/${fileExt};base64,` // use dataType specifying font
};

output = postcss([
    ...plugins...,
    require("postcss-url-base64")(opts)
    ...plugins...
]).process(src).css;
```

### More info

Only strings inside `url(...)` functions are replaced.
