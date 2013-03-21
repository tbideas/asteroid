#!/bin/sh

NODE_VERSION=v0.10.0
NODE_JS=http://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION.tar.gz
PING_INSTALL_1='http://io.tbideas.com/pijs/installing'
PING_INSTALL_2='http://io.tbideas.com/pijs/install-done'

echo "# Installing piJS on this Raspberry Pi..."

echo "## Pinging stat server to record a new installation... (no personal info sent)"
curl PING_INSTALL_1

echo "## Downloading nodejs"
curl $NODE_JS -o /tmp/nodejs.tar.gz

echo "## Installing nodejs ... this will take a while"
cd /tmp && tar zxvf nodejs.tar.gz
cd node-$NODE_VERSION
./configure && make && sudo make install

echo "## Installing dependencies"
/usr/local/bin/npm -g install pijs

echo "## Adding automatic startup script (/etc/init.d/pijs)"
cp /usr/local/node

echo "# Installation finished! Pinging stat server"
curl PING_INSTALL_2
