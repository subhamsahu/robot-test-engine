#!/bin/bash

CWD=$PWD
PYTHON3_VERSION="3.10.12"
PIP_VERSION="pip3.10"
PYTHON2_VERSION="Python 2.7.18"
NODEJS_VERSION="v18.19.0"

python3_check() 
{
    ver=`(python3.10 -V | sed 's/.* \([0-9]\).\([0-9]\+\).\([0-9]\+\).*/\1.\2.\3/') 2>/dev/null`
    if [[ "$ver" == "$PYTHON3_VERSION" ]]; then
        echo "python 3.10 is installed"
        apt install python3-pip
        pip3.10 -V
    else
        echo $ver
        # exit 0
    fi
}
python3_check

python2_check() 
{
    ver=`(python2.7 -V | sed 's/.* \([0-9]\).\([0-9]\+\).\([0-9]\+\).*/\1.\2.\3/') 2>/dev/null`
    if [[ "$ver" == "$PYTHON2_VERSION" ]]; then
        echo "python 2.7 is installed"
    else
        echo "Installing Python 2.7"
        apt update
        apt install python2
        curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py # Fetch get-pip.py for python 2.7
        chmod +x get-pip.py 
        python2 get-pip.py
        pip --version
    fi
}
python2_check


# Install Test Framework and EMS Simulator Packages
echo "################################################"
echo "Installing Test Framework Dependencies"
echo "################################################"

 ${PIP_VERSION} install -r requirements.txt

 apt install tmux

# Installing MongoDB
echo "################################################"
echo "Installing Mongo DB"
echo "################################################"

install_mongo_db() 
{

    apt-get install gnupg curl

    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
     gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    --dearmor

    touch /etc/apt/sources.list.d/mongodb-org-7.0.list

    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" |  tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    apt-get update

    apt-get install -y mongodb-org

}
install_mongo_db

apt update

#  systemctl status mongod
echo "################################################"
echo "Installing Node Js"
echo "################################################"

node_version=`node --version 2>/dev/null`

if [[ "$node_version" !=  "$NODEJS_VERSION"* ]]; then
    apt-get purge nodejs &&\
    rm -r /etc/apt/sources.list.d/nodesource.list &&\
    rm -r /etc/apt/keyrings/nodesource.gpg
    apt autoremove -y

    apt-get update
    apt-get install -y ca-certificates curl gnupg
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |  gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

    NODE_MAJOR=18
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" |  tee /etc/apt/sources.list.d/nodesource.list

    apt-get update
    apt-get install nodejs -y
else
    echo "########## NODEJS ALREADY INSTALLED ##########"
fi

npm install -g npm@10.2.3
npm install --global node-gyp
npm install --global yarn
yarn global add wetty@2.5.0

install_ui(){
    cd $CWD/ui
    npm install
 }
install_ui
 
