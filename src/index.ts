import * as path from "path";
import * as fs from "fs";
import postcss from "postcss";
import parser from "postcss-value-parser";
import helpers from "postcss-message-helpers";

interface IOptions {
  root: string;
  extensions: string[];
  removeMultiple: boolean;
  dataType: (fileExt: string) => string;
  warn: boolean;
}

/**
 * PostCSS plugin inline url() files as base64
 */
const plugin = postcss.plugin(
  "postcss-base64",
  (options: IOptions) => (style, result) => {
    const saveOptions = {
      root: process.cwd(),
      extensions: [".png", ".svg", ".jpg"],
      removeMultiple: false,
      dataType: fileExt => `data:image/${fileExt};base64,`,
      warn: false,
      ...options
    };
    style.walkDecls(decl => {
      if (
        !decl.value ||
        !decl.value.includes("url(") ||
        !saveOptions.extensions.some(ext => decl.value.includes(ext))
      ) {
        return;
      }

      try {
        decl.value = helpers.try(() => {
          const parse = parser(decl.value);
          const isUrlNode = node => node.value === "url";

          if (saveOptions.removeMultiple) {
            parse.nodes.splice(
              -(
                parse.nodes.length -
                parse.nodes
                  .slice(parse.nodes.findIndex(isUrlNode) + 1)
                  .findIndex(isUrlNode)
              )
            );
          }
          return parse
            .walk(node => {
              if (node.type !== "function" || node.value !== "url") {
                return;
              }
              const regExp = /.*?url\("(.*?)"\).*?/g;

              node.nodes.find(
                node => node.type === "string"
              ).value = parser
                .stringify([node])
                .replace(regExp, (_m, urlPath) => {
                  let fileContent;
                  try {
                    fileContent = fs.readFileSync(
                      path.join(saveOptions.root, urlPath)
                    );
                  } catch (error) {
                    if (saveOptions.warn) {
                      console.warn(
                        `@schadenn/postcss-base64 plugin warning:\n${
                          error.message
                        }`
                      );
                    }
                    decl.warn(result, error.message, {
                      word: decl.value
                    });
                  }
                  return (
                    saveOptions.dataType(path.extname(urlPath).slice(1)) +
                    fileContent.toString("base64")
                  );
                });
            })
            .toString();
        }, decl.source);
      } catch (error) {
        if (saveOptions.warn) {
          console.warn(
            `@schadenn/postcss-base64 plugin warning:\n${error.message}`
          );
        }
        decl.warn(result, error.message, {
          word: decl.value
        });
      }
    });
  }
);

export default plugin;
