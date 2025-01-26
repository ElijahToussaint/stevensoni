// node modules
const nunjucks = require('nunjucks');
const hjson = require('hjson');
const fs = require('fs');
const path = require('path');
const prettify = require('html-prettify');
// locate config files
const configPath = path.join(__dirname, '../config/config.hjson');
const projectsPath = path.join(__dirname, '../data/projects.hjson');
const linksPath = path.join(__dirname, '../data/links.hjson');
const cryptoPath = path.join(__dirname, '../data/crypto.hjson');
const errorsPath = path.join(__dirname, '../data/errors.hjson');
const publicPath = path.join(__dirname, '../../public');
// locate example config files
const exampleConfigPath = path.join(__dirname, '../config/example/config.example.hjson');
const exampleErrorsPath = path.join(__dirname, '../data/examples/errors.example.hjson');
const stylesheetPath = path.join(publicPath, 'css/stylesheet.css');
// adds files if they don't exist
if (!fs.existsSync(configPath)) {
    console.log('The configuration file doesn\'t exist.');
    console.log('Generating configuration file now...');
    fs.cpSync(exampleConfigPath, configPath);
    console.log('Configuration file generated.');
}
if (!fs.existsSync(errorsPath)) {
    console.log('The errors file doesn\'t exist.');
    console.log('Generating errors file now...');
    fs.cpSync(exampleErrorsPath, errorsPath);
    console.log('Errors file generated.');
}
if (!fs.existsSync(projectsPath)) {
    console.log('The projects file doesn\'t exist.');
    console.log('Generating projects file now...');
    fs.writeFileSync(projectsPath, hjson.stringify([]));
    console.log('Projects file generated.');
}
if (!fs.existsSync(linksPath)) {
    console.log('The links file doesn\'t exist.');
    console.log('Generating links file now...');
    fs.writeFileSync(linksPath, hjson.stringify([]));
    console.log('Links file generated.');
}
if (!fs.existsSync(cryptoPath)) {
    console.log('The crypto file doesn\'t exist.');
    console.log('Generating crypto file now...');
    fs.writeFileSync(cryptoPath, hjson.stringify([]));
    console.log('Crypto file generated.');
    
}
if (!fs.existsSync(stylesheetPath)) {
    console.log('The stylesheet CSS file doesn\'t exist.');
    console.log('Generating stylesheet CSS file now...');
    fs.writeFileSync(stylesheetPath, "");
    console.log('Stylesheet CSS file generated.');
    
}
// locate file paths
const templatesPath = path.join(__dirname, '../../templates');
const nodeModulesPath = path.join(__dirname, '../../node_modules');
const mainPath = path.join(__dirname, '../../');
// read config files
const readConfig = fs.readFileSync(configPath, 'utf8');
const readProjects = fs.readFileSync(projectsPath, 'utf8');
const readLinks = fs.readFileSync(linksPath, 'utf8');
const readCrypto = fs.readFileSync(cryptoPath, 'utf8');
const readErrors = fs.readFileSync(errorsPath, 'utf8');
// config variable
const config = hjson.parse(readConfig);
// projects variable
const projects = hjson.parse(readProjects);
// links variable
const links = hjson.parse(readLinks);
// crypto variable
const crypto = hjson.parse(readCrypto);
// errors variable
const errors = hjson.parse(readErrors);
// generated site folder path
const sitePath = path.join(mainPath, '_site');
// main module for generating static web pages
console.log("Generating static website...");
// checks site directory
if (!fs.existsSync(sitePath)) {
    console.log('Static site folder doesn\'t exist. Creating it now.');
    fs.mkdirSync(sitePath);
    console.log('Site folder created.');
}
// copying dependency directories to site directory
console.log('Copying public directory to generated site directory...');
fs.cpSync(publicPath, path.join(sitePath, 'public'), { recursive: true });
console.log('Public directory copied successfully.');
console.log('Copying spectre.css directory to generated site directory...');
fs.cpSync(path.join(nodeModulesPath, 'spectre.css'), path.join(sitePath, 'public/spectre.css'), { recursive: true });
console.log('Spectre.css directory copied successfully.');
// sorts projects
var sortedProjects = projects.sort(function (x, y) {
    return new Date(x.date) - new Date(y.date);
});
sortedProjects.reverse();
// sorts links
var sortedLinks = links.sort(function (x, y) {
    return x.position - y.position;
});
// sorts crypto
var sortedCrypto = crypto.sort(function (x, y) {
    return x.position - y.position;
});
// configures nunjucks for the templates directory
nunjucks.configure(templatesPath);
// checks templates directory
if (fs.existsSync(templatesPath)) {
    // index page generation
    console.log('Generating index page...');
    const indexTemplate = path.join(templatesPath, 'index.html');
    if (fs.existsSync(indexTemplate)) {
        var render = nunjucks.render('index.html', { config: config, projects: sortedProjects, links: sortedLinks, crypto: sortedCrypto });
        fs.writeFileSync(path.join(sitePath, 'index.html'), prettify(render));
        console.log('Index page generated.');
    } else {
        console.log('The index template doesn\'t exist.');
    }
    // error page generation
    const errorsTemplate = path.join(templatesPath, 'error.html');
    if (fs.existsSync(errorsTemplate)) {
        const errorPath = path.join(sitePath, 'errors');
        if (!fs.existsSync(errorPath)) {
            console.log('Error directory doesn\'t exist. Creating it now.');
            fs.mkdirSync(errorPath);
            console.log('Error directory created.');
        }
        console.log('Generating error pages...');
        for (var i = 0; i < errors.length; i++) {
            console.log('Generating ' + errors[i].status + ' error page...');
            var render1 = nunjucks.render('error.html', { config: config, error: errors[i] });
            fs.writeFileSync(path.join(errorPath, errors[i].status + '.html'), prettify(render1));
            console.log('Generated ' + errors[i].status + ' error page successfully.');
        }
    } else {
        console.log('The error template doesn\'t exists.');
    }
} else {
    console.log('The template directory doesn\'t exists.');
}