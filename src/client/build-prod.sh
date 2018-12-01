#!/bin/sh
ng build -e prod --deploy-url=/client/ --base-href=/client/
cp .htaccess dist/
