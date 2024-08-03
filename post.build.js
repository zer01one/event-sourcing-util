const fs = require('node:fs');
const path = require('node:path');

const functionSeparator = '\n\n';
const jsonOuputOPTS = [false, 4];
const dist = path.join(__dirname, 'dist');

(async function main() {
    cleanPacakageJson(path.join(dist, 'package.json')); // Clear out excess 

    formTypedPackageJSON(path.join(dist, '_cjs'), 'commonjs'); // Form typed json for modules
    formTypedPackageJSON(path.join(dist, '_esm'), 'module'); // Form typed json for modules

    formGlobalScript('./dist/_esm/event-sourcing-util.js', path.join(dist, 'global', 'event-sourcing-util.js')); // Form global script
})();

async function formGlobalScript(fromRelativePath, to) {
    const module = await import(fromRelativePath).catch(err => ({ err }));
    if (module.err) return console.error('Ошибка импорта скрипта: ', module.err);

    const output = '/* Automatically generated */' + functionSeparator + Object.values(module).reduce((acc, curr) => acc += curr += functionSeparator, '');

    fs.mkdirSync(to.split(path.sep).slice(0, -1).join(path.sep), { recursive: true }); // Create directory

    fs.writeFileSync(to, output, { encoding: 'utf-8' }); // Write to file
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
