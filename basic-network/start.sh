#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
CHANNEL_NAME=scmchannel

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@eel.solar.com/msp" peer0.eel.solar.com peer channel create -o orderer.solar.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/channel.tx

# Join peer0.eel.solar.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@eel.solar.com/msp" peer0.eel.solar.com peer channel join -b ${CHANNEL_NAME}.block

# Update the channel with the anchor peers
docker exec -e "CORE_PEER_LOCALMSPID=EelMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@eel.solar.com/msp" peer0.eel.solar.com peer channel update -o orderer.solar.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/EelMSPanchors.tx
