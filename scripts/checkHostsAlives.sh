#!/bin/bash
CGDATE=`date +'%F'`
CGDATETIME=`date +'%Y%m%d_%H%M'`
CGCMD="node /home/cgil/get-web-screenshot/getWebScreenshot.js"
PATH2IMAGES=/tmp/getWebScreenshot_images/${CGDATE}
if [ ! -d ${PATH2IMAGES} ]
then
  mkdir -p "${PATH2IMAGES}"
fi
cd ${PATH2IMAGES}
$CGCMD https://carto.lausanne.ch/  carto_screenshot_${CGDATETIME}.png > carto_screenshot_${CGDATETIME}.log 2>&1
$CGCMD https://goeland.lausanne.ch/public/goeland_is_alive/  goeland_screenshot_${CGDATETIME}.png > goeland_screenshot_${CGDATETIME}.log 2>&1



