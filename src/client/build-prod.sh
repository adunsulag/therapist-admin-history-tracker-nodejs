#!/bin/sh
ng build -e prod --deploy-url=/client/dist/ --base-href=/client/dist/
cp .htaccess dist/
