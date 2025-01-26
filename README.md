<div align="center">

![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/ElijahToussaint/stevensoni.svg)
[![GitHub issues](https://img.shields.io/github/issues-raw/ElijahToussaint/stevensoni.svg)](https://github.com/ElijahToussaint/stevensoni/issues)
[![License](https://img.shields.io/github/license/ElijahToussaint/stevensoni.svg)](LICENSE)
![GitHub stars](https://img.shields.io/github/stars/ElijahToussaint/stevensoni?style=social)

</div>

<p align="center">
    <img width=200px src="docs/images/stevensoni.png">

 <h3 align="center">Stevensoni</h3>
  <p align="center">
    A simple one page static site generator.
    <br />
    <br />
    <a href="https://github.com/ElijahToussaint/stevensoni/issues">Report Bug</a>
    ·
    <a href="https://github.com/ElijahToussaint/stevensoni/issues">Request Feature</a>
    ·
    <a href="https://github.com/ElijahToussaint/stevensoni/blob/main/RELEASES.md">Releases</a>
  </p>
</p>

## About The Project

| Desktop   | Mobile    |
| :---:     | :---:     |
| ![desktop](docs/images/desktop.png) | ![mobile](docs/images/mobile.png) |

### What is a static site generator?

A static site generator is a tool that generates a full static HTML website based on raw data and a set of templates. Essentially, a static site generator automates the task of coding individual HTML pages and gets those pages ready to serve to users ahead of time.

### What is a static site?

A static site consists of a series of HTML files, each one representing a physical page of a website. On static sites, each page is a separate HTML file.

### Why is it called Stevensoni?

Stevensoni is the [seed shrimp](https://en.wikipedia.org/wiki/Ostracod) (Darwinula stevensoni),  the most common arthropods in the fossil record with fossils being found from the early Ordovician to the present.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Javascript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)
- [Hjson](https://hjson.github.io/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)

## Features

- Open source, [AGPL License](/LICENSE).
- Lightweight and easy to deploy.
- Clean, mobile-friendly interface.
- Supports seperate sections for personal links and cryptocurrencies.
- A webserver is started so you can preview your website in a browser.
- Support for the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.
- A user interface that can add, edit, and delete information for your website.
- Host anywhere static HTML is supported.

## Installation

Install dependencies:

`sudo apt install nodejs git`

`sudo apt install npm`

Clone the git repository:

`git clone https://github.com/ElijahToussaint/stevensoni`

Go into the directory:

`cd stevensoni`

Install node packages:

`npm install`

Start the app on localhost:

`npm start`

Generate site:

`npm run generate`

To access the ui:
The default port is 5000. The port variable can be modified in the config file.

`http://localhost:{port}/`

## Configuration

Configuration files can be found in the [config](src/config) and [data](src/data) directories.

Refer to the example files in the [config](src/config/examples) and [data](src/data/examples) directories for examples.

All multimedia files referenced in the site should be stored in the public [assets](public/assets) directory.

All configuration files should be in [hjson](https://hjson.github.io/) format and saved with the `.hjson` extension.

## Customization

The appearence of the generated site can be modified by editing the `public/css/stylesheet.css` file in the [public](public) directory.

Stevensoni uses [Spectre](https://github.com/picturepan2/spectre) for its frontend design. Learn to modify the CSS variables [here](https://picturepan2.github.io/spectre/getting-started/custom.html). 

## Support / Donate

Stevensoni is free, open-source software. Donations directly support development of the project.

### Crypto

- Bitcoin (BTC): `bc1qrf2f64n4znghwvaxt3mf3jr82fxw9wf83w6xtg`
- Ethereum (ETH): `0xB07b8b081BAA0d6Ad5D072A3132FfFd289bc5dAF`
- Bitcoin Cash (BCH): `qqxveqvtefqx4aszn83euv7mdcd8mgtx3cr3vu85dk`
- Litecoin (LTC): `LQZCnoGLKyEpqw7jpKfc1qpYN1bwLvyTcS`
- Dogecoin (DOGE): `D8cBSTDAh4LXDxkHVN44Nnf3LECgTerNjx`
- Zcash (ZEC): `t1YKzhroHjPwUwc5uxU7t4RP2rCt6FDo2ee`
- Dash (DASH): `XfQ2kvpQBKWjiDpCUe7G4RukrQN2YvVy7Y`
- Monero (XMR): `44tUtL754iP1uM1Vet2uUqJtLNCfgDCdjFqtSjg58oUYT576G47xdzjYoRrFhUr66obzLtFuBprMjBt1YfiKy2SpAqocWS8`

## Contact

- [Email](mailto:elijahtoussaint@protonmail.com)

## Code Mirrors

- [GitHub](https://github.com/ElijahToussaint/stevensoni)
- [Codeberg](https://codeberg.org/ElijahToussaint/stevensoni)
