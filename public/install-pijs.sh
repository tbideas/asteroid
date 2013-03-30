#!/bin/sh

VERSION=0.0.2
PRECOMPILED=http://pijs.s3.amazonaws.com/pijs-precompiled-$VERSION.tar.gz

PING_INSTALL_1='http://io.tbideas.com/pijs/installing?precompiled=true'
PING_INSTALL_2='http://io.tbideas.com/pijs/install-done'

echo "# Installing piJS on this Raspberry Pi... (using precompiled binaries)"

echo "## Pinging stat server to record a new installation... (no personal info sent)"
curl $PING_INSTALL_1

echo "## Downloading package with nodejs, pi-blaster and dependencies ..."
curl $PRECOMPILED -o /tmp/pijs-precompiled.tar.gz

echo "## Installing nodejs and dependencies"
cd / && sudo tar zxvf /tmp/pijs-precompiled.tar.gz

echo "Configuring auto-start"
sudo cp /usr/local/lib/node_modules/pi-steroid/pi-steroid-boot.sh /etc/init.d/pi-steroid
sudo chmod +x /etc/init.d/pi-steroid
sudo update-rc.d pi-steroid defaults
sudo /etc/init.d/pi-steroid start

echo "# Installation finished! Pinging stat server"
curl $PING_INSTALL_2
