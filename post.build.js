const fs = require('node:fs');
const path = require('node:path');

const functionSeparator = '\n\n';
const jsonOuputOPTS = [false, 4];
const dist = path.join(__dirname, 'dist');

const messageGlobalScript = `/* 
This file is generated automatically!

Any changes will be overwritten during the next build. 
*/`;

(async function main() {
    cleanPacakageJson(path.join(dist, 'package.json')); // Clear out excess 

    formTypedPackageJSON(path.join(dist, '_cjs'), 'commonjs'); // Form typed json for modules
    formTypedPackageJSON(path.join(dist, '_esm'), 'module'); // Form typed json for modules

    formGlobalScript('../_esm/event-sourcing-util.js', path.join(dist, '_global'), 'event-sourcing-util'); // Form global script
})();

async function formGlobalScript(fromRelativePath, to, name) {
    fs.mkdirSync(to, { recursive: true }); // Create directory

    fs.writeFileSync(path.join(to, name) + '.js', globalScriptText(), { encoding: 'utf-8' }); // Write to file

    function globalScriptText() {
        return messageGlobalScript + functionSeparator + `const EventSourcingUtil_load = import('${fromRelativePath}').catch(err => {
    console.error(err);
    return {err};
});`;
    }
}

function cleanPacakageJson(path) {
    const json = global.JSON.parse(fs.readFileSync(path));

    fs.writeFileSync(path, global.JSON.stringify(clean(json), ...jsonOuputOPTS), { encoding: 'utf-8' });

    function clean(json) {
        json.scripts = {};
        return json;
    }
}

function formTypedPackageJSON(where, type) {
    fs.writeFileSync(path.join(where, 'package.json'), global.JSON.stringify({ type }, ...jsonOuputOPTS), { encoding: 'utf-8' });
}
