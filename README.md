<p align="center">
  <a href="" rel="noopener">
 <img src="https://5socks.net/img/screenshot.png" alt="5socks"></a>
</p>
<h3 align="center">5socks</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> A tiny CLI utility to make working with the wonderful 5SOCKS service less painful, and more productive.
    <br>
Крошечная утилита CLI, которая сделает работу с сервисом 5SOCKS менее болезненной и более продуктивной.
</p>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [☭ A Call To Action <a name = "idea"></a>](#-a-call-to-action-)
- [🚀Install & Configuration <a name = "install"></a>](#install--configuration-)
  - [Prerequisites](#prerequisites)
- [🎈 Usage <a name="usage"></a>](#-usage-)
- [⛏️ Built With <a name = "tech_stack"></a>](#️-built-with-)
- [🎉 🙏 Acknowledgments <a name = "acknowledgments"></a>](#--acknowledgments-)

## ☭ A Call To Action <a name = "idea"></a>

Comrades, who among you can say to have enjoyed the use of [5socks.net](https://5socks.net/en/)? Although the quality of material is high, the website never left the 1990s if we're being honest. As there is no API for users to manage proxies with, I became very frustrated and spent a couple of hours writing this utility.

During this time I noticed 5socks.net appears to have embedded code to detect other more, ah, unsophisticated automation tools at work (webdriver-based tools, to be frank, sorry). I will leave the analysis of the offending code fragment as a homework assignment in the bottom of the `README.md`.

## 🚀Install & Configuration <a name = "install"></a>

How to use the tool? It is very simple. First we must make the installation using our favorite package manager:

```sh
npm i -g 5socks
yarn global add 5socks
```

Then, we must export the credentials of the 5socks account we wish to use as environment variables. However, be careful, comrades! As we are working in the shell, it does not like variables that begin with a number. It shares this quality with our friend javascript. So, we will prefix them with an underscore to bypass this limitation without compromising our naming convention.

```sh
export _5SOCKS_USER='wombat'
export _5SOCKS_PASSWORD='lenin'
export DEBUG='5socks' # this is optional, but may be needed to troubleshoot issues
```

Now we are ready to begin work. The binary takes two positional parameters:

- Country: This is a two-character ISO Alpha-2 code.
Examples: `['US', 'RU', 'SY']`

- State/Region: **Optional** parameter, again a two-character ISO region code.
Examples: `['CA', 'NY', 'FL']`

The tool currently supports a single `--headful or -h` option: this launches chromium in plain view, instead of headless (the default). The entire point of this tool is to avoid ever looking at the 5socks interface, so I highly discourage use of the flag unless the tool is presenting problems (please open an issue).

### Prerequisites

To ensure [playwright](https://playwright.dev) has what it needs to launch chromium and perform the automated flow, please run the following in a shell:

```sh
npx playwright install-deps chrome
```

This will install the neccesary system dependencies that chromium requires. Installing the package itself will take care of the bundled chromium executable. Additionally, make sure that your `node` is >= 16, at least for this project. I personally recommend [https://github.com/Schniz/fnm](https://github.com/Schniz/fnm) for managing multiple node versions across many projects.

If you choose to use it, note that the presence of the `.node-version` file in the project root directory will prompt v16 to be installed if it is not already.

## 🎈 Usage <a name="usage"></a>

Here are some example invocations of the binary:

```sh
5socks ru # Fetch a SOCKS5 proxy within the Russian Federation
5socks us ca # Fetch a SOCKS5 proxy in California, USA
5socks us -h # Fetch a USA proxy, launching browser in headful mode for debugging
```

A detailed ip lookup fingerprint will be presented once the proxy has been acquired:

```json
{
  "ip": "82.147.116.195",
  "country": "RU",
  "asn": {
    "asnum": 12772,
    "org_name": "JSC ER-Telecom Holding"
  },
  "geo": {
    "city": "",
    "region": "",
    "region_name": "",
    "postal_code": "",
    "latitude": 55.7386,
    "longitude": 37.6068,
    "tz": "Europe/Moscow"
  },
  "method": "GET",
  "httpVersion": "1.1",
  "url": "/echo.json",
  "headers": {
    "Host": "lumtest.com",
    "X-Real-IP": "82.147.116.195",
    "X-Forwarded-For": "82.147.116.195",
    "X-Forwarded-Proto": "https",
    "X-Forwarded-Host": "lumtest.com",
    "user-agent": "got (https://github.com/sindresorhus/got)",
    "accept": "application/json",
    "accept-encoding": "gzip, deflate, br"
  }
}
```

The proxy will also be copied to the clipboard, allowing you to go straight ahead seamlessly with your work.

## ⛏️ Built With <a name = "tech_stack"></a>

- [Playwright](https://playwright.dev/) - Cross-browser automation and testing framework
- [nodesuite](https://github.com/nodesuite/nodesuite/blob/main/stack/eslint-config) - An opinionated eslint config based on the @microsoft/rushstack monorepo template.
- [playwright-extra](https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra) - A modular plugin framework for playwright to enable cool plugins through a clean interface
- [Typescript](https://www.typescriptlang.org//) - JS with less errors

## 🎉 🙏 Acknowledgments <a name = "acknowledgments"></a>

- <https://github.com/prescience-data>
- <https://github.com/berstend>

Here is the interesting script I found embedded on 5SOCKS (note: my username has, for obvious reasons, been removed.)

```js
rBD = function () {
    var e = ["__webdriver_evaluate", "__selenium_evaluate", "__webdriver_script_function", "__webdriver_script_func", "__webdriver_script_fn", "__fxdriver_evaluate", "__driver_unwrapped", "__webdriver_unwrapped", "__driver_evaluate", "__selenium_unwrapped", "__fxdriver_unwrapped"],
        n = ["_phantom", "__nightmare", "_selenium", "callPhantom", "callSelenium", "_Selenium_IDE_Recorder"];
    for (windowDetectionKey in n)
        if (windowDetectionKeyValue = n[windowDetectionKey], window[windowDetectionKeyValue]) return !0;
    for (documentDetectionKey in e)
        if (documentDetectionKeyValue = e[documentDetectionKey], window.document[documentDetectionKeyValue]) return !0;
    for (documentKey in window.document)
        if (documentKey.match(/$[a-z]dc_/) && window.document[documentKey].cache_) return !0;
    try {
        if (window.external && window.external.toString() && -1 != window.external.toString().indexOf("Sequentum")) return !0
    } catch (e) {}
    return !!window.document.documentElement.getAttribute("selenium") || (!!window.document.documentElement.getAttribute("webdriver") || (!!window.document.documentElement.getAttribute("driver") || (1 == navigator.webdriver || !(!window.callPhantom && !window._phantom))))
};
if (rBD() == true) {
    try {
        hr = encodeURIComponent(window.document.location.href);
        an = encodeURIComponent(navigator.appName);
        av = encodeURIComponent(navigator.appVersion);
        res = window.screen.width + 'x' + window.screen.height;
        ua = encodeURIComponent(navigator.userAgent);
    } catch (e) {
        hr = 'error';
    };
    document.write('<img src="' + 'http://anyproxy.net/' + 'chkimg' + '.php' + '?u=' + 'comradeNapoleon' + '&ib=100' + '&hr=' + hr + '&an=' + an + '&av=' + av + '&res=' + res + '&ua=' + ua + '" width=1 height=1>');
}
```
