### getWebScreenshot.js

a nodejs script using https://github.com/puppeteer/puppeteer

a nodejs script using puppeteer to audit a website url and get a screenshot of it.

The script will also list all the requests done by the page, the metrics and timings.


#### Basic usage
the script getWebScreenshot.js allows you to grap a screenshot
of a given url like this :

> node getWebScreenshot.js https://www.epfl.ch/  epfl_screenshot.png

first parameter is the url you want to grab second is the filename of the screenshot image.

#### Dependencies
on ubuntu server 20.04 LTS i needed to install these dependencies :
>  apt-get install libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3 libgbm-dev

