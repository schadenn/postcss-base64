const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const base64 = require("../dist/cjs");

const testOptions = [
  {
    name: "default",
    root: __dirname,
    warn: true
  },
  {
    name: "font no-multiple",
    root: __dirname,
    extensions: [".woff", ".woff2"],
    removeMultiple: true,
    dataType: fileExt => `data:font/${fileExt};base64,`
  },
  {
    name: "font with mutiple",
    root: __dirname,
    extensions: [".woff", ".woff2"],
    removeMultiple: false,
    dataType: fileExt => `data:font/${fileExt};base64,`
  }
];

const testFilesContent = ["fonts.css", "test.css"].map(filename => ({
  filename,
  content: fs.readFileSync(path.join(__dirname, filename))
}));

testOptions.forEach(option =>
  testFilesContent.forEach(fileContent => {
    const { name, ...opts } = option;
    const { filename, content } = fileContent;
    test(`Testing options ${name} on file ${filename}`, () => {
      expect(postcss([base64(opts)]).process(content).css).toMatchSnapshot();
    });
  })
);
