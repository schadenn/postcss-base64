import postcss from "postcss";
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
declare const plugin: postcss.Plugin<IOptions>;
export default plugin;
