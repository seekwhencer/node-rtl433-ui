import webpack from "webpack";
import BrowserSync from "./BrowserSync.js";
import fs from "fs-extra";

/**
 * i found no way to embed the js bundle
 * i tried it as base64, as base64 and uri encoded / decoded
 * no way. so it results a base64 css bundle with base64 embedded fonts
 * as pack.html
 */

export default class WebpackRun {
    constructor(parent) {
        this.parent = parent;
        this.bundler = false;
        this.server = false;
        this.package = {};
        this.hash = false;
        this.browserSync = false;

        this.docRoot = `${this.parent.appPath}/dist/prod`;
        this.cssRoot = `${this.docRoot}/css`;
        this.jsRoot = `${this.docRoot}/js`;

        this.faviconFileName = `${this.docRoot}/favicon.ico`;
        this.htmlFileNameFrom = `${this.docRoot}/index_template.html`;
        this.htmlFileNameTo = `${this.docRoot}/index.html`;
        this.cssFileName = `${this.cssRoot}/app.css`;
        this.jsFileName = `${this.jsRoot}/app.js`;
    }

    run() {
        this.config = this.parent.config;
        this.parent.config.mode === 'development' ? this.runDev() : this.runProd();
    }

    runDev() {
        this.browserSync = new BrowserSync(this);

        this.bundler = webpack(this.config);
        this.watching = this.bundler.watch(this.config.watchOptions, (err, stats) => {
            if (err || stats.hasErrors()) {
                err ? console.log('>>> ERROR: ', err.message) : null;
                stats.hasErrors() ? console.log('>>> ERROR: ', stats.compilation.errors) : null;
            } else {
                console.log('>>> BUNDLING COMPLETE');
            }
        });
    }

    runProd() {
        console.log('');
        this.bundler = webpack(this.config, async (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('>>> ERROR: ', err.message);
            } else {
                this.hash = stats.compilation.hash;
                console.log('>>> BUNDLING COMPLETE', this.hash);

                //await this.rewriteHTML(/hash/g, parseInt(new Date().getTime() / 1000));

                // do the base64 packaging
                await this.pack();
                console.log('>>> PACK COMPLETE', this.htmlFileNameTo);

                await this.writeHash();
                await this.clean();
            }
        });
    }

    // (unused) old style for linked prod index.html
    async rewriteHTML(from, to) {
        console.log('>>> REWRITE HTML');
        const indexHTMLFile = `${this.parent.appPath}/dist/prod/index.html`;
        return fs.readFile(indexHTMLFile, (err, data) => {
            const reData = data.toString().replace(from, to);
            fs.writeFile(indexHTMLFile, reData);
        });
    }

    // read needed data and create the final production index.html
    async pack() {
        console.log('>>> PACK HTML (base64 encoded fonts in css file, base64 encoded css file as inline data source)');
        this.cssFile = await fs.readFile(this.cssFileName);
        this.jsFile = await fs.readFile(this.jsFileName);
        this.htmlFile = await fs.readFile(this.htmlFileNameFrom);
        this.faviconFile = await fs.readFile(this.faviconFileName);

        await this.packFonts();
        await this.packHTML();
    }

    // replace font urls in the css file with base64 encoded font data
    packFonts() {
        this.package.fonts = [];
        const promises = [];

        const find = new RegExp(/\burl\([^)]+.(woff|woff2)"\)/gi);

        const matches = `${this.cssFile}`.match(find);
        matches.forEach(m => {
            const cssPath = `${m.replace(`url("./`, '').replace(`")`, '')}`;
            const filePath = `${this.cssRoot}/${cssPath}`;
            const fileRead = fs.readFile(filePath).then(data => {
                const fullData = {
                    cssPath: cssPath,
                    cssString: `url("./${cssPath}")`,
                    filePath: filePath,
                    data: data.toString('base64')
                }
                return Promise.resolve(fullData);
            });
            promises.push(fileRead);
        });

        return Promise.all(promises)
            .then(files => files.forEach(file => this.package.fonts.push(file)))
            .then(() => {
                this.package.fonts.forEach(font => this.cssFile = `${this.cssFile}`.replace(font.cssString, `url("data:text/css;base64,${font.data}")`));
                return fs.writeFile(this.cssFileName, this.cssFile);
            });
    }

    // replace all the things in the html file
    packHTML() {
        const cssFile = `${Buffer.from(this.cssFile).toString('base64')}`;
        const faviconFile = `${this.faviconFile.toString('base64')}`; // not from buffer, because the read results a buffer

        this.htmlFile = `${this.htmlFile}`
            .replace('<favicon></favicon>', `<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${faviconFile}">`)
            .replace('<style></style>', `<link rel="stylesheet" type="text/css" href="data:text/css;base64,${cssFile}" />`)
            .replace('<script></script>', `<script type="text/javascript" src="js/app.js?${this.hash}"></script>`)

        //.replace('<script></script>', `<script type="text/javascript" src="data:text/javascript;base64,${Buffer.from(jsFile).toString('base64')}"></script>`)
        //.replace('<script></script>', `<script  type="module">\n//<![CDATA[\n${jsFile}\n//]]>\n</script>`)
        ;

        return fs.writeFile(this.htmlFileNameTo, this.htmlFile);
    }

    // write a version file with the compilation hash from webpack
    writeHash(hash) {
        return fs.writeFile(`${this.docRoot}/version`, this.hash || hash);
    }

    // delete unused files from prod folder
    clean() {
        const proms = [];
        const files = ['dev.html', 'index_template.html'];
        files.forEach(file => proms.push(fs.remove(`${this.docRoot}/${file}`)))
        return Promise.all(proms);
    }
}
