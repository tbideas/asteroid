# This script is mean to be run on a Raspberry Pi, after install-pijs.sh
# It generates a new precompiled tarball for faster installation on other raspberry pis.

VERSION=0.0.2

cat > /tmp/pijsfiles <<EOF
usr/local/bin/node
usr/local/bin/npm
usr/local/bin/forever
usr/local/bin/foreverd
usr/local/bin/pi-steroid
usr/local/bin/serialportlist
usr/local/bin/serialportterm
usr/local/bin/wscat
usr/local/man/man1/node.1
usr/local/lib/node_modules
EOF

cd /
echo "Building precompiled tarball ..."
tar -zvc -T /tmp/pijsfiles -f ~/pijs-precompiled-$VERSION.tar.gz

echo "Precompiled tarball ready in: ~/pijs-precompiled-$VERSION.tar.gz"
echo "Run 'aws put pijs ~/pijs-precompiled-$VERSION.tar.gz' to publish"
