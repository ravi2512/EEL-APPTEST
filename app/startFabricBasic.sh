#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# chaincode runtime will be node.js for language consistency across project
CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/solarIndustry-cc
CHAINCODE_NAME=solar-procurement
CHANNEL_NAME=scmchannel

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../basic-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode

docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/eel.solar.com/users/Admin@eel.solar.com/msp" -e "CORE_PEER_ADDRESS=peer0.eel.solar.com:7051" cli peer chaincode install -n $CHAINCODE_NAME -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

# docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/eel.solar.com/users/Admin@eel.solar.com/msp" cli peer chaincode instantiate -o orderer.solar.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}'

sleep 10
docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/eel.solar.com/users/Admin@eel.solar.com/msp" cli peer chaincode instantiate -o orderer.solar.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "AND('EelMSP.member')" --peerAddresses peer0.eel.solar.com:7051

echo Call invoke
sleep 10
docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/eel.solar.com/users/Admin@eel.solar.com/msp" cli peer chaincode invoke -o orderer.solar.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"initLedger","Args":[""]}'

cd ..

./explorer.sh

echo Total setup execution time : $(($(date +%s) - starttime)) secs ...

