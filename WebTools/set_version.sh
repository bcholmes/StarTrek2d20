#!/bin/bash

currentDate=`date +%y%m%d`
version="var version = 'v1.$currentDate';"
echo $version > "version.js"