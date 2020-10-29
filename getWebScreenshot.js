#!/usr/bin/node
const puppeteer = require('puppeteer');
const url = require('url');
const version = '1.0.0';
const dateNow = new Date();
const url2Monitor = url.parse(process.argv[2]);
const screenshotFile = process.argv[3];
const nPixWidth = 1024; // width of screenshot
const nPixHeight = 768; // height of screenshot
const allRequests = {}; // will use it to store url entries as properties of this object (kind a associative array)
if (!url2Monitor) {
    throw "Please provide URL as a first argument, and screenshot filename as second argument ";
}
(async () => {
    console.log(`###### starting getWebScreenshot.js V ${version}. ${dateNow.toISOString()}   ######`);
    console.log(`### about to launch puppeteer headless (${nPixWidth} x ${nPixHeight}) ###`);
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/getWebScreenshot/',
        defaultViewport: {width: nPixWidth, height: nPixHeight},
    });
    const page = await browser.newPage();

    page.on('load', () => {
        console.log(`# ⚡⚡⭐ Event: page loaded      ⭐⚡⚡ # page loaded after ${getMilliSec(getElapsedTimeNanoSec(start))} ms `);
    });
    page.on('domcontentloaded', () => {
        console.log(`# ⚡⚡⭐ Event: domcontentloaded ⭐⚡⚡ # page domcontentloaded after ${getMilliSec(getElapsedTimeNanoSec(start))} ms `);
    });

    page.on('request', request => {
        const elapsed = getElapsedTimeNanoSec(start); // store the global hr timer counter at this point for later use
        const url = request.url();
        console.log(`# ⚡⚡🚀 Event: request              🚀⚡⚡ # ${trimString(url)} after ${getMilliSec(elapsed)} ms`);
        // initialising my pseudo "associative array", but really it's just an object where each properties is my unique key (here the url)
        allRequests[request.url()] = {elapsed, resourceType: request.resourceType(), isFinished: false};
    });

    page.on('response', response => {
        const elapsed = getElapsedTimeNanoSec(start);
        const status = response.status();
        const url = response.url();
        if (status > 399) {
            console.log(`# ⚡⚡⚠  Event: response status:[${status}] ⚠ ⚡⚡ # ${trimString(url)} after ${getMilliSec(elapsed)} ms `);
        } else {
            console.log(`# ⚡⚡✔  Event: response status:[${status}] ✔ ⚡⚡ # ${trimString(url)} after ${getMilliSec(elapsed)} ms`);
        }
        allRequests[url].statusCode = status;
    });

    page.on('requestfinished', request => {
        const elapsed = getElapsedTimeNanoSec(start);
        const url = request.url();
        console.log(`# ⚡⚡🏁 Event: requestfinished      🏁 ⚡⚡ # ${trimString(url)} after ${getMilliSec(elapsed)} ms `);
        allRequests[url].isFinished = true;
        allRequests[url].Time2CompleteMilliSec = getMilliSec(elapsed - allRequests[url].elapsed);
    });

    page.on('requestfailed', request => {
        const elapsed = getElapsedTimeNanoSec(start);
        const err = request.failure().errorText;
        const url = request.url();
        console.log(`# ⚡⚡⚠  Event: requestfailed status:[${err}] ⚠ ⚡⚡ # ${trimString(url)} after ${getMilliSec(elapsed)} ms `);
        // updating my pseudo "associative array", but really it's just an object where each properties is my unique key (here the url)
        allRequests[url].statusCode = 0;
        allRequests[url].errorMessage = err;
        allRequests[url].Time2CompleteMilliSec = getMilliSec(elapsed - allRequests[url].elapsed);
    });

    // process.hrtime.bigint() method returns the current high-resolution real time in nanoseconds as a bigint
    const start = process.hrtime.bigint(); // my initial time before navigation really begins
    console.log(`### about to navigate to ${url2Monitor.href} ###`);

    try {
        await page.goto(url2Monitor.href, {
            // networkIdleTimeout: 5000,
            waitUntil: 'networkidle2',
            timeout: 600000 // 60 sec
        });
        const gitMetrics = await page.metrics();
        console.log(`## ⏲  page metrics ⏲  ##  Timestamp when sample was taken :  ${gitMetrics.Timestamp}`);
        console.log(`## ⏲  page metrics ⏲  ##  Number of documents in the page :  ${gitMetrics.Documents}`);
        console.log(`## ⏲  page metrics ⏲  ##  Number of frames in the page    :  ${gitMetrics.Frames}`);
        console.log(`## ⏲  page metrics ⏲  ##  Number of events in the page    :  ${gitMetrics.JSEventListeners}`);
        console.log(`## ⏲  page metrics ⏲  ##  Number of DOM nodes in the page :  ${gitMetrics.Nodes}`);
        console.log(`## ⏲  page metrics ⏲  ##  Total number of page layout     :  ${gitMetrics.LayoutCount}`);
        console.log(`## ⏲  page metrics ⏲  ##  Durations of all page layouts   :  ${gitMetrics.LayoutDuration}`);
        console.log(`## ⏲  page metrics ⏲  ##  Total style recalculations      :  ${gitMetrics.RecalcStyleCount}`);
        console.log(`## ⏲  page metrics ⏲  ##  Duration of JavaScript execution:  ${gitMetrics.ScriptDuration}`);
        console.log(`## ⏲  page metrics ⏲  ##  Duration of JavaScript execution:  ${gitMetrics.ScriptDuration}`);
        console.log(`## ⏲  page metrics ⏲  ##  Duration of all browser tasks   :  ${gitMetrics.TaskDuration}`);
        console.log(`## ⏲  page metrics ⏲  ##  Used JavaScript heap size  :  ${gitMetrics.JSHeapUsedSize}`);
        console.log(`## ⏲  page metrics ⏲  ##  Total JavaScript heap size :  ${gitMetrics.JSHeapTotalSize}`);
        try {
            const elapsed = getElapsedTimeNanoSec(start);
            console.log(`### READY TO SAVE IMAGE AFTER  ${getMilliSec(elapsed)} ms `);
            console.log(`### about to save screenshot to ${screenshotFile} ###`);
            await page.screenshot({path: screenshotFile});
            const totalTime = getElapsedTimeNanoSec(start);
            console.log(`### 🏁🏁 IMAGE SAVED ! FINISH AFTER  ${getMilliSec(totalTime)} ms ! 🏁🏁 ### `);
        } catch (e) {
            console.error(`## 🔥🔥 ERROR saving screenshot file : ${screenshotFile} , ${e}`,);
        }
    } catch (e) {
        console.error(`## 🔥🔥 ERROR loading url : ${url2Monitor} , ${e}`);
    }
    const failedRequests = Object.entries(allRequests).filter(r => !r[1].isFinished);
    const successRequests = Object.entries(allRequests).filter(r => r[1].isFinished);
    console.log(`## ✔ ✔  Total number of successful requests : ${successRequests.length}  ✔ ✔  ##`);
    const countRequestByResType = countGroupBy(successRequests, 'resourceType')
    const sumTimeRequestByResourceType = sumGroupBy(successRequests, 'resourceType', 'Time2CompleteMilliSec');
    for (let p in countRequestByResType) {
        console.log(`## Number of ${p}(s)\t: ${countRequestByResType[p]} in ${sumTimeRequestByResourceType[p]} milliSeconds`)
    }
    ;
    // console.log(successRequests);
    if (failedRequests.length > 0) {
        console.log(`## ⚠ ⚠  Total number of FAILED requests : ${failedRequests.length}  ⚠ ⚠  ##`);
        failedRequests.forEach(
            r => console.log(`## 🔥🔥 ERROR : ${r[1].errorMessage}, after ${r[1].Time2CompleteMilliSec}ms, FAILED to load ${r[1].resourceType} :  ${r[0]}`)
        );
    }
    await browser.close();
})();

function logRequest(interceptedRequest) {
    console.log('A request was made:', interceptedRequest.url());
}

const getElapsedTimeNanoSec = function (startCounter, note) {
    return process.hrtime.bigint() - startCounter;
}

const getMilliSec = function (nanoSeconds) {
    return nanoSeconds / BigInt(1000000);
}

const trimString = function (s, maxLenght = 80) {
    if (s.length < maxLenght) return s;
    const firstLimit = Math.floor(maxLenght / 2);
    const prefix = s.slice(0, firstLimit);
    const sufix = s.slice(-firstLimit + 3)
    return `${prefix}...${sufix}`
}

const countGroupBy = function (obj, key) {
    return obj.reduce(
        (r, a) => {
            r[a[1][key]] = r[a[1][key]] + 1 || 1;
            return r
        }, Object.create(null)
    );
}

const sumGroupBy = function (obj, groupByKey, sumField) {
    return obj.reduce(
        (r, e) => {
            r[e[1][groupByKey]] = (r[e[1][groupByKey]] === undefined) ?
                e[1][sumField] : BigInt(r[e[1][groupByKey]]) + e[1][sumField];
            return r
        }, Object.create(null)
    );
}
