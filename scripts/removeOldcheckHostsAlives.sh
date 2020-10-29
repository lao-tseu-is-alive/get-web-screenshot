#!/bin/bash
## deleting older directory files
D5_DAYS_AGO=date --date="5 day ago" +%F
D6_DAYS_AGO=date --date="6 day ago" +%F
PATH2IMAGES=/tmp/getWebScreenshot_images/${D5_DAYS_AGO}
if [ -d ${PATH2IMAGES} ]
  rm -rf -p "${PATH2IMAGES}"
fi
PATH2IMAGES=/tmp/getWebScreenshot_images/${D6_DAYS_AGO}
if [ -d ${PATH2IMAGES} ]
  rm -rf -p "${PATH2IMAGES}"
fi



