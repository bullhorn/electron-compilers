import _ from 'lodash';
import path from 'path';
import {CompilerBase} from '../compiler-base';
import pify from 'pify';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const mimeTypes = ['text/sass', 'text/x-sass', 'text/scss', 'text/x-scss'];
let sass = null;
let psass = null;

// TODO - pull from compiler config!
const autoprefixerOptions = {
  browsers: [
    'last 2 versions',
    'iOS >= 7',
    'Android >= 4',
    'Explorer >= 10',
    'ExplorerMobile >= 11'
  ],
  cascade: false
};

let prefixer = postcss([autoprefixer(autoprefixerOptions)]);

/**
 * @access private
 */
export default class SassCompiler extends CompilerBase {
  constructor() {
    super();
    this.compilerOptions.sourceMap = true;
    this.compilerOptions.sourceMapEmbed = true;
    this.seenFilePaths = {};
  }

  static getInputMimeTypes() {
    return mimeTypes;
  }

  async shouldCompileFile(fileName, compilerContext) {
    return true;
  }

  async determineDependentFiles(sourceCode, filePath, compilerContext) {
    return [];
  }

  async compile(sourceCode, filePath, compilerContext) {
    sass = sass || require('node-sass');
    psass = psass || pify(sass);

    let paths = Object.keys(this.seenFilePaths);
    paths.unshift('.');

    this.seenFilePaths[path.dirname(filePath)] = true;

    let indent = filePath.match(/sass$/i);
    let opts = _.extend({}, this.compilerOptions, {
      indentedSyntax: indent,
      includePaths: paths,
      file: filePath,
      data: sourceCode
    });

    // Render the SCSS
    let result = await psass.render(opts);

    // Run through the auto prefixer
    // TODO - add this as an optional step
    let prefixed = await prefixer.process(result.css);

    if (!result || !result.css) {
      throw new Error(`Failed to compile file: ${JSON.stringifyt(result)}`);
    }

    return {
      code: prefixed.css.toString('utf8'),
      mimeType: 'text/css'
    };
  }

  shouldCompileFileSync(fileName, compilerContext) {
    return true;
  }

  determineDependentFilesSync(sourceCode, filePath, compilerContext) {
    return [];
  }

  compileSync(sourceCode, filePath, compilerContext) {
    sass = sass || require('node-sass');
    psass = psass || pify(sass);

    let paths = Object.keys(this.seenFilePaths);
    paths.unshift('.');

    this.seenFilePaths[path.dirname(filePath)] = true;

    let indent = filePath.match(/sass$/i);
    let opts = _.extend({}, this.compilerOptions, {
      indentedSyntax: indent,
      includePaths: paths,
      file: path.basename(filePath),
      data: sourceCode
    });

    let result = sass.renderSync(opts);

    // Run through the auto prefixer
    // TODO - add this as an optional step
    let prefixed = prefixer.process(result.css);

    if (!result || !result.css) {
      throw new Error(`Failed to compile file: ${JSON.stringifyt(result)}`);
    }

    return {
      code: prefixed.css.toString('utf8'),
      mimeType: 'text/css'
    };
  }

  getCompilerVersion() {
    return require('node-sass/package.json').version;
  }
}
