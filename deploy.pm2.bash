#!/bin/bash

echo "NMCL deployment script"

FILE=./cert.pem
if test -f "$FILE"; then
    echo "Certificate found."
else
    echo "Certificate not found, generating..."
    openssl req -x509 -nodes -subj "/C=CA/ST=QC/L=MTL/O=NMCL/CN=127.0.0.1" -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
fi

pm2 stop nmcl
sudo mkdir /srv/$USER/
sudo chown $USER:$USER /srv/$USER
mkdir /srv/$USER/nmcl
rm -rf /srv/$USER/nmcl/*
cp ./build/main/* /srv/$USER/nmcl
cp ./cert.pem /srv/$USER/nmcl
cp ./opts.txt /srv/$USER/nmcl
#opts.txt : port user pass
pm2 start /srv/$USER/nmcl/index.js --name "nmcl" -- $(cat ./opts.txt)