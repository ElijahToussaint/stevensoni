// node packages
const fs = require('fs');
const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const hjson = require('hjson');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'public/assets/' });
// locate config files
const configPath = path.join(__dirname, 'src/config/config.hjson');
const projectsPath = path.join(__dirname, 'src/data/projects.hjson');
const linksPath = path.join(__dirname, 'src/data/links.hjson');
const cryptoPath = path.join(__dirname, 'src/data/crypto.hjson');
const errorsPath = path.join(__dirname, 'src/data/errors.hjson');
const stylesheetPath = path.join(__dirname, 'public/css/stylesheet.css');
// locate example config files
const exampleConfigPath = path.join(__dirname, 'src/config/example/config.example.hjson');
const exampleErrorsPath = path.join(__dirname, 'src/data/examples/errors.example.hjson');
// adds files if they don't exist
if (!fs.existsSync(configPath)) {
    fs.cpSync(exampleConfigPath, configPath);
}
if (!fs.existsSync(errorsPath)) {
    fs.cpSync(exampleErrorsPath, errorsPath);
}
if (!fs.existsSync(projectsPath)) {
    fs.writeFileSync(projectsPath, hjson.stringify([]));
}
if (!fs.existsSync(linksPath)) {
    fs.writeFileSync(linksPath, hjson.stringify([]));
}
if (!fs.existsSync(cryptoPath)) {
    fs.writeFileSync(cryptoPath, hjson.stringify([]));
}
if (!fs.existsSync(stylesheetPath)) {
    fs.writeFileSync(stylesheetPath, "");
}
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
// app engine
const app = express();
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// cookie parser
app.use(cookieParser());
app.use(session({
    secret: 'stevensoni',
    saveUninitialized: false,
    resave: false
}));
// cors middleware
app.use(cors());
// config variables
const port = config.node.port;
// redirect to custom css folder
app.use('/public/css', express.static(__dirname + '/public/css'));
// redirect to assets folder
app.use('/public/assets', express.static(__dirname + '/public/assets'));
// redirect to custom javascript folder
app.use('/public/js', express.static(__dirname + '/public/js'));
// redirect to spectre folder
app.use('/public/spectre.css', express.static(__dirname + '/node_modules/spectre.css'));
// sets app engine directory
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
// templating engine
app.set('view engine', 'html');
// index page
app.get('/', function (req, res) {
    res.render('index.html', { config: config, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// seo page
app.get('/seo', function (req, res) {
    res.render('index.html', { config: config, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// profile page
app.get('/profile', function (req, res) {
    res.render('profile.html', { config: config, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// projects page
app.get('/projects', function (req, res) {
    res.render('projects.html', { projects: sortedProjects, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// links page
app.get('/links', function (req, res) {
    res.render('links.html', { links: sortedLinks, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// crypto page
app.get('/crypto', function (req, res) {
    res.render('crypto.html', { crypto: sortedCrypto, success: req.session.success, successMsg: req.session.successMsg, errors: req.session.errors });
    req.session.errors = null;
    req.session.success = null;
});
// preview page
app.get('/preview', function (req, res) {
    res.render('preview/index.html', { config: config, projects: sortedProjects, links: sortedLinks, crypto: sortedCrypto });
});
// seo page
app.post('/seo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
    [
        check('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        check('description')
            .not()
            .isEmpty()
            .withMessage('Description is required'),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/seo');
        } else {
            config.site.title = req.body.title;
            config.site.description = req.body.description;
            config.site.keywords = (req.body.keywords).trim().split(',');
            if (req.files.logo != undefined) {
                var oldPath = req.files.logo[0].path;
                var newPath = "";
                if (req.files.logo[0].mimetype == 'image/svg+xml') {
                    newPath = req.files.logo[0].path + '.svg';
                } else {
                    newPath = req.files.logo[0].path;
                }
                fs.renameSync(oldPath, newPath);
                config.site.logo = newPath;
            }
            if (req.files.favicon != undefined) {
                config.site.favicon = req.files.favicon[0].path;
            }
            fs.writeFileSync(configPath, hjson.stringify(config));
            req.session.success = true;
            req.session.successMsg = 'Search engine optimization was edited successfully';
            res.redirect('/seo');
        }
    });
// profile page
app.post('/profile', upload.fields([{ name: 'profile-picture', maxCount: 1 }]),
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/profile');
        } else {
            config.site.name = req.body.name;
            config.site.email = req.body.email;
            config.site.about = req.body.about;
            if (req.files['profile-picture'] != undefined) {
                config.site.avatar = req.files['profile-picture'][0].path;
            }
            fs.writeFileSync(configPath, hjson.stringify(config));
            //console.log(hjson.stringify(config))
            req.session.success = true;
            req.session.successMsg = 'Profile was edited successfully';
            res.redirect('/profile');
        }
    });
// add a new project
app.post('/projects/add',
    [
        check('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        check('date')
            .not()
            .isEmpty()
            .withMessage('Date is required'),
        check('description')
            .not()
            .isEmpty()
            .withMessage('Description is required'),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/projects');
        } else {
            sortedProjects.push({ 'title': req.body.title, 'date': req.body.date, 'description': req.body.description, 'link': req.body.link });
            sortedProjects = projects.sort(function (x, y) {
                return new Date(x.date) - new Date(y.date);
            });
            sortedProjects.reverse();
            fs.writeFileSync(projectsPath, hjson.stringify(sortedProjects));
            req.session.success = true;
            req.session.successMsg = 'Project was added successfully';
            res.redirect('/projects');
        }
    });
// edit an existing project
app.post('/projects/edit',
    [
        check('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        check('date')
            .not()
            .isEmpty()
            .withMessage('Date is required'),
        check('description')
            .not()
            .isEmpty()
            .withMessage('Description is required'),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/projects');
        } else {
            sortedProjects[req.body.position].title = req.body.title;
            sortedProjects[req.body.position].date = req.body.date;
            sortedProjects[req.body.position].description = req.body.description;
            sortedProjects[req.body.position].link = req.body.link;
            fs.writeFileSync(projectsPath, hjson.stringify(sortedProjects));
            req.session.success = true;
            req.session.successMsg = 'Project was edited successfully';
            res.redirect('/projects');
        }
    });
// delete an existing post
app.post('/projects/delete', function (req, res) {
    if (req.body.position == 0) {
        sortedProjects.shift();
    } else if (req.body.position > 0 && req.body.position < sortedProjects.length) {
        sortedProjects.splice(req.body.position, 1);
    } else {
        sortedProjects.pop();
    }
    fs.writeFileSync(projectsPath, hjson.stringify(sortedProjects));
    req.session.success = true;
    req.session.successMsg = 'Project was deleted successfully';
    res.redirect('/projects');
});
// add a new link
app.post('/links/add',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),
        check('url')
            .not()
            .isEmpty()
            .withMessage('URL is required'),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            //console.log(errors)
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/links');
        } else {
            sortedLinks.push({ 'name': req.body.name, 'url': req.body.url, 'position': sortedLinks.length });
            fs.writeFileSync(linksPath, hjson.stringify(sortedLinks));
            req.session.success = true;
            req.session.successMsg = 'Link was added successfully';
            res.redirect('/links');
        }
    });
// edit an existing link
app.post('/links/edit',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),
        check('url')
            .not()
            .isEmpty()
            .withMessage('URL is required')
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/links');
        } else {
            sortedLinks[req.body.position].name = req.body.name;
            sortedLinks[req.body.position].url = req.body.url;
            fs.writeFileSync(linksPath, hjson.stringify(sortedLinks));
            req.session.success = true;
            req.session.successMsg = 'Link was edited successfully';
            res.redirect('/links');
        }
    });
// delete an existing link
app.post('/links/delete', function (req, res) {
    if (req.body.position == 0) {
        sortedLinks.shift();
    } else if (req.body.position > 0 && req.body.position < sortedLinks.length) {
        sortedLinks.splice(req.body.position, 1);
    } else {
        sortedLinks.pop();
    }
    for (let i = parseInt(req.body.position); i < sortedLinks.length; i++) {
        sortedLinks[i].position = i;
    }
    fs.writeFileSync(linksPath, hjson.stringify(sortedLinks));
    req.session.success = true;
    req.session.successMsg = 'Link was deleted successfully';
    res.redirect('/links');
});
// move link element up
app.post('/links/moveUp', function (req, res) {
    if (req.body.position === 0) {
        req.session.errors = "Link is the top element already";
        req.session.success = false;
        res.redirect('/links');
    }
    sortedLinks[req.body.position].position = parseInt(req.body.position) - 1;
    sortedLinks[parseInt(req.body.position) - 1].position = parseInt(req.body.position);
    sortedLinks = links.sort(function (x, y) {
        return x.position - y.position;
    });
    fs.writeFileSync(linksPath, hjson.stringify(sortedLinks));
    req.session.success = true;
    req.session.successMsg = 'Link was moved up successfully';
    res.redirect('/links');
});
// move link element down
app.post('/links/moveDown', function (req, res) {
    if (req.body.position === sortedLinks.length) {
        req.session.errors = "Link is the bottom element already";
        req.session.success = false;
        res.redirect('/links');
    }
    sortedLinks[req.body.position].position = parseInt(req.body.position) + 1;
    sortedLinks[parseInt(req.body.position) + 1].position = parseInt(req.body.position);
    sortedLinks = links.sort(function (x, y) {
        return x.position - y.position;
    });
    fs.writeFileSync(linksPath, hjson.stringify(sortedLinks));
    req.session.success = true;
    req.session.successMsg = 'Link was moved down successfully';
    res.redirect('/links');
});
// add a new crypto
app.post('/crypto/add',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Cryptocurrency name is required'),
        check('address')
            .not()
            .isEmpty()
            .withMessage('Cryptocurrency wallet address is required')
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/crypto');
        } else {
            sortedCrypto.push({ 'name': req.body.name, 'address': req.body.address, 'position': sortedCrypto.length });
            fs.writeFileSync(cryptoPath, hjson.stringify(sortedCrypto));
            req.session.success = true;
            req.session.successMsg = 'Cryptocurrency address was added successfully';
            res.redirect('/crypto');
        }
    });
// edit an existing crypto
app.post('/crypto/edit',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required'),
        check('address')
            .not()
            .isEmpty()
            .withMessage('Cryptocurrency address is required')
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/crypto');
        } else {
            sortedCrypto[req.body.position].name = req.body.name;
            sortedCrypto[req.body.position].address = req.body.address;
            fs.writeFileSync(cryptoPath, hjson.stringify(sortedCrypto));
            req.session.success = true;
            req.session.successMsg = 'Cryptocurrency address was edited successfully';
            res.redirect('/crypto');
        }
    });
// delete an existing crypto
app.post('/crypto/delete', function (req, res) {
    if (req.body.position == 0) {
        sortedCrypto.shift();
    } else if (req.body.position > 0 && req.body.position < sortedCrypto.length) {
        sortedCrypto.splice(req.body.position, 1);
    } else {
        sortedCrypto.pop();
    }
    for (let i = parseInt(req.body.position); i < sortedCrypto.length; i++) {
        sortedCrypto[i].position = i;
    }
    fs.writeFileSync(cryptoPath, hjson.stringify(sortedCrypto));
    req.session.success = true;
    req.session.successMsg = 'Cryptocurrency was deleted successfully';
    res.redirect('/crypto');
});
// move crypto element up
app.post('/crypto/moveUp', function (req, res) {
    if (req.body.position === 0) {
        req.session.errors = "Cryptocurrency is the top element already";
        req.session.success = false;
        res.redirect('/crypto');
    }
    sortedCrypto[req.body.position].position = parseInt(req.body.position) - 1;
    sortedCrypto[parseInt(req.body.position) - 1].position = parseInt(req.body.position);
    sortedCrypto = crypto.sort(function (x, y) {
        return x.position - y.position;
    });
    fs.writeFileSync(cryptoPath, hjson.stringify(sortedCrypto));
    req.session.success = true;
    req.session.successMsg = "Cryptocurrency was moved up successfully";
    res.redirect('/crypto');
});
// move crypto element down
app.post('/crypto/moveDown', function (req, res) {
    if (req.body.position === sortedCrypto.length) {
        req.session.errors = "Cryptocurrency is the bottom element already";
        req.session.success = false;
        res.redirect('/crypto');
    }
    sortedCrypto[req.body.position].position = parseInt(req.body.position) + 1;
    sortedCrypto[parseInt(req.body.position) + 1].position = parseInt(req.body.position);
    sortedCrypto = crypto.sort(function (x, y) {
        return x.position - y.position;
    });
    fs.writeFileSync(cryptoPath, hjson.stringify(sortedCrypto));
    req.session.success = true;
    req.session.successMsg = 'Cryptocurrency was moved down successfully';
    res.redirect('/crypto');
});
// http error 400 (bad request)
app.get('*', function (req, res) {
    res.status(400).render('preview/error.html', { config: config, error: errors[0] });
});
// http error 401 (unauthorized)
app.get('*', function (req, res) {
    res.status(401).render('preview/error.html', { config: config, error: errors[1] });
});
// http error 403 (forbidden)
app.get('*', function (req, res) {
    res.status(403).render('preview/error.html', { config: config, error: errors[2] });
});
// http error 404 (not found)
app.get('*', function (req, res) {
    res.status(404).render('preview/error.html', { config: config, error: errors[3] });
});
// http error 500 (internal server error)
app.get('*', function (req, res) {
    res.status(500).render('preview/error.html', { config: config, error: errors[4] });
});
// start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log('Press Ctrl+C to quit.');
});