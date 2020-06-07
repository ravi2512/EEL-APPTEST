/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
// const conf = require('./')
const configPath = path.join(process.cwd(), '../config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const csv = require('csv-parser')

var ccpPath = path.join(process.cwd(), '../connection.json');
//var appAdmin = config.appAdmin;
var userId = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;
var channelName = config.channel_name;
var smartContractName = config.smart_contract_name;
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const nodemailer = require("nodemailer");
var cron = require('node-cron');
var curl = require('curl')
var xlsx = require('node-xlsx');
var moment = require('moment')
 // parses a file

const readXlsxFile = require('read-excel-file/node');

var task = cron.schedule('0 10 12 * * *', () => {
  curl.get("http://localhost:3001/addInventory", {}, function (err, res, body) {
    console.log("sdasd", res)
  })
}, {
  scheduled: false
});

task.start();


module.exports = {

  /*
  * Add Inventory
  * @param {[]String} args array of argument
  */
  addInventory: async function (req, res, next) {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);



    await module.exports.changeFile()
    try {
      // Create a new gateway for connecting to our peer node.

      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      setTimeout(async () => {
        await gateway2.disconnect();
      }, 20000);
      var findArgs = []
      var selector = {
        "selector": {
          "entry_date": (new Date()).toDateString()
        }
      }

      findArgs[0] = JSON.stringify(selector)

      let checkData = await contract.evaluateTransaction('queryData', ...findArgs);
      checkData = JSON.parse(checkData.toString());
      console.log("Check previous", checkData)

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      console.log(allInventory.length);
      var inventoryLength = allInventory.length

      var syncArgs = []
      syncArgs[0] = (new Date()).toISOString()
      await contract.submitTransaction('updateSyncTime', ...syncArgs)
      if (checkData.length === 0) {
        fs.createReadStream(path.join(__dirname + '/api/myfile.csv'))
          .pipe(csv())
          .on('data', async (data) => {
            inventoryLength++;
            //results.push(data)
            // var parsedData = JSON.parse(data)
            // Submit the specified transaction.
            console.log(data, data['0'])
            var date = new Date()
            var curr_date_day = date.getDate()
            var curr_date_year = date.getFullYear()
            var curr_date_month = date.getMonth()
            var args = [];
            var sheet = new Date(moment(data.Date, "DD.MM.YYYY"))
            var sheet_date_day = sheet.getDate()
            var sheet_date_year = sheet.getFullYear()
            var sheet_date_month = sheet.getMonth()
            var test = new Date(data.Date)
            console.log("Hello", sheet_date_day, sheet_date_month, sheet_date_year, curr_date_day, curr_date_month, curr_date_year)
            // if()
            if (curr_date_day === sheet_date_day && curr_date_month === sheet_date_month && curr_date_year === sheet_date_year) {
              for (var i in data) {
                args.push(data[i]);
              }
              args.push((new Date()).toDateString())
              var invL = inventoryLength.toString()
              args.push(invL)
              console.log('\nSubmit AddInventory transaction for data ');
              // console.log(data);
              console.log("args: ", args);
              // const gateway2 = new Gateway();
              // await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

              // // Get the network (channel) our contract is deployed to.
              // const network = await gateway2.getNetwork(channelName);

              // // Get the contract from the network.
              // const contract = network.getContract(smartContractName);
              await contract.submitTransaction('addInventory', ...args);
              // await gateway2.disconnect();
            }


            // console.log('addInventoryResponse: ');
            // console.log(JSON.parse(addInventoryResponse.toString()));
          })
          .on('end', async () => {

            // var test = results.filter(function (vendor) { return vendor.Vendor === "ABC"; });
            //console.log(results);
            //var args = results;
            // Disconnect from the gateway.
            var suc = {
              'code': 200,
              'msg': 'Inventory Inserted'
            }

            res.send(suc);

            // return true;
          });
      } else {
        await gateway2.disconnect();
        var suc = {
          'code': 200,
          'msg': 'Inventory Already Inserted'
        }

        res.send(suc);
      }
      //const results = [];

    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
    // Disconnect from the gateway.
    // await gateway2.disconnect();

  },

  addXlsInventory: async function (req, res, next) {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);



    await module.exports.changeFile()
    try {
      // Create a new gateway for connecting to our peer node.

      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      
      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      setTimeout(async () => {
        await gateway2.disconnect();
      }, 20000);

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      console.log(allInventory.length);
      var inventoryLength = allInventory.length

      var syncArgs = []
      syncArgs[0] = (new Date()).toISOString()
      await contract.submitTransaction('updateSyncTime', ...syncArgs)
      fs.createReadStream(path.join(__dirname + '/api/myfile.csv'))
        .pipe(csv())
        .on('data', async (data) => {
            inventoryLength++;
            var args=[]
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var sheet = new Date(moment(data.Date, "DD.MM.YYYY"))
            for (var i in data) {
              args.push(data[i]);
            }
            args.push(sheet.toDateString())
            var invL = inventoryLength.toString()
            args.push(invL)
            console.log('\nSubmit AddInventory transaction for data ');
            // console.log(data);
            // console.log("args: ", args);
            // const gateway2 = new Gateway();
            // await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

            // // Get the network (channel) our contract is deployed to.
            // const network = await gateway2.getNetwork(channelName);

            // // Get the contract from the network.
            // const contract = network.getContract(smartContractName);
            
            await contract.submitTransaction('addInventory', ...args);
            
            // await gateway2.disconnect();

        })
        .on('end', async () => {
          
          var suc = {
            'code': 200,
            'msg': 'Inventory Inserted'
          }

          res.send(suc);

          // return true;
        });

    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
    // Disconnect from the gateway.
    // await gateway2.disconnect();


  },

  /*
* Get all offers data
* @param {String} cardId Card id to connect to network
*/
  getInventory: async function (req, res, next) {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nGet all Inventory state ');
      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      // console.log(allInventory);
      var date = (new Date(req.body.date)).toDateString()
      console.log(date)
      var inventory = allInventory.filter(o => o.Record.entry_date === date)
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'All Inventory',
        'data': inventory
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },


  createUser: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nGet all offers state ');
      var password = Date.now()
        .toString()
        .substr(-6);
      var args = [];
      args[0] = req.body.userId;
      args[1] = req.body.name;
      args[2] = req.body.email;
      args[3] = password
      args[4] = req.body.userType;

      await contract.submitTransaction('createUser', ...args);
      let email = req.body.email
      let subject = "Registration Details"
      let message = "Hi <b>" + req.body.name + "</b>, <br><br><br> Your Account has been created with the following details: <br> <br> <b> UserID: </b> " + req.body.userId + " <br><br> <b> Password: </b> " + password
      module.exports.sendEmail(email, subject, message)
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'user created Successfully'
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  userLogin: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nlogin user state ');
      var selector = {
        "selector": {
          "user_id": req.body.user_id
        }
      }
      var args = [];
      args[0] = JSON.stringify(selector)

      let user = await contract.evaluateTransaction('queryData', ...args);
      user = JSON.parse(user.toString());
      console.log('asdas', user)



      // Disconnect from the gateway.
      await gateway2.disconnect();

      if (user.length > 0) {
        var password = user[0].Record.password
        var user_password = req.body.password
        user[0].Record.password = '******'
        if (password === user_password) {
          var suc = {
            'code': 200,
            'msg': 'user created Successfully',
            'user_data': user[0].Record
          }
        } else {
          var suc = {
            'code': 100,
            'msg': 'Invalid Credentials'
          }
        }
      } else {
        var suc = {
          'code': 201,
          'msg': 'User Doesnot exists!'
        }
      }


      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  sendEmail: async function (email, subject, message) {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "solargrouppoc@gmail.com", // generated ethereal user
        pass: "Smart@92256" // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    var mailOptions = {
      from: '"Solar Group" <solargrouppoc@gmail.com>', // sender address
      to: email,
      subject: subject, // Subject line
      html: message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("sendEmail:- " + error);
      }
      console.log("sendEmail:- Message sent: %s", info.messageId);
    });
  },

  changeFile: async function () {
    var rows = [];
    var writeStr = "";
    var obj = xlsx.parse(path.join(__dirname + '/api/masterFile/master.xlsx'));
    for (var i = 0; i < obj.length; i++) {
      var sheet = obj[i];
      //loop through all rows in the sheet
      for (var j = 0; j < sheet['data'].length; j++) {
        //add the row to the rows array
        rows.push(sheet['data'][j]);
      }
    }

    for (var i = 0; i < rows.length; i++) {
      writeStr += rows[i].join(",") + "\n";
    }

    fs.writeFile(path.join(__dirname + '/api/myfile.csv'), writeStr, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("test.csv was saved in the current directory!");
      // res.send("done")
      return true;
    });
  },

  getUserData: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nlogin user state ');
      var col = req.body.colName
      var selector = {
        "selector": {
          "vendor_id": req.body.colVal
        }
      }
      var args = [];
      args[0] = JSON.stringify(selector)
      console.log("asd", args)
      let user = await contract.evaluateTransaction('queryData', ...args);
      user = JSON.parse(user.toString());
      console.log('asdas', user)

      var date = (new Date(req.body.date)).toDateString()
      console.log(date)
      var inventory = user.filter(o => o.Record.entry_date === date)
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Data',
        'user_data': inventory
      }



      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  getUsers: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nlogin user state ');
      var col = req.body.colName
      var Vendorselector = {
        "selector": {
          "user_type": "Vendor"
        }
      }
      var Storeselector = {
        "selector": {
          "user_type": "Store"
        }
      }
      var vendorArgs = [];
      var StoreArgs = [];
      vendorArgs[0] = JSON.stringify(Vendorselector)
      StoreArgs[0] = JSON.stringify(Storeselector)
      // console.log("asd", args)
      let Vendoruser = await contract.evaluateTransaction('queryData', ...vendorArgs);
      Vendoruser = JSON.parse(Vendoruser.toString());
      console.log('asdas', Vendoruser)

      var criticalSelector = {
        "selector": {
          "criticalty": "Critical"
        }
      }
      var CriticalArgs = [];
      CriticalArgs[0] = JSON.stringify(criticalSelector)
      let criticalUser = await contract.evaluateTransaction('queryData', ...CriticalArgs);
      criticalUser = JSON.parse(criticalUser.toString());
      console.log("count", criticalUser.length, criticalUser);
      
      Vendoruser.map(async function (vendor, index) {
        console.log("vendor", vendor)
        var userCriticalArray = criticalUser.filter(o=>o.Record.vendor_id === vendor.Record.user_id)
        var userCriticalCount = userCriticalArray.length
        // console.log("critcalUser", criticalUser)
        Vendoruser[index].criticalCount = userCriticalCount
      })

      let StoreUser = await contract.evaluateTransaction('queryData', ...StoreArgs);
      StoreUser = JSON.parse(StoreUser.toString());
      console.log('asdas', StoreUser)

      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Data',
        'vendors': Vendoruser,
        'stores': StoreUser
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  updateEscalationDetails: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      var args = []
      args[0] = req.body.inventoryId
      args[1] = req.body.quantity
      args[2] = req.body.vehicleNumber
      args[3] = req.body.date
      args[4] = req.body.supplierRemark
      args[5] = req.body.escalationRemark
      args[6] = req.body.escalationStatus
      args[7] = req.body.escalationDoneBy
      args[8] = req.body.eta
      args[9] = req.body.driverName
      args[10] = req.body.driverContactNo
      args[11] = req.body.stockAtSuplierEnd
      await contract.submitTransaction('updateEscalation', ...args);
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Escalation Details Updated'
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  updateAcknowledgementDetails: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      var args = []
      args[0] = req.body.inventoryId
      args[1] = req.body.status
      args[2] = req.body.doneBy
      args[3] = req.body.remark

      await contract.submitTransaction('updateAcknowledgement', ...args);
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Acknowledgement Details Updated'
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  getLastSyncTime: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      console.log('\nlogin user state ');
      var syncSelector = {
        "selector": {
          "sync_id": "sync-1"
        }
      }
      var syncArgs = [];
      syncArgs[0] = JSON.stringify(syncSelector)
      // console.log("asd", args)
      let syncTime = await contract.evaluateTransaction('queryData', ...syncArgs);
      syncTime = JSON.parse(syncTime.toString());
      console.log('asdas', syncTime)

      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Data',
        "data": syncTime
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  updateEscalationAcknowledgement: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      var args = []
      args[0] = req.body.inventoryId
      args[1] = req.body.acknowledge_by_siil
      args[2] = req.body.remark_by_siil
      
      await contract.submitTransaction('updateEscalationAcknowledgement', ...args);
      // Disconnect from the gateway.
      await gateway2.disconnect();

      var suc = {
        'code': 200,
        'msg': 'Escalation Acknowledgement Details Updated'
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  criticalAnalysisData: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      // console.log('asdas', allInventory)
      
      var data = []
      if(req.body.key === 'today') {
        var filteredData;
        filteredData = await allInventory.filter(o=>o.Record.entry_date === (new Date()).toDateString())
        filteredData = await filteredData.filter(o=>o.Record.criticalty === 'Critical')
        data.push(filteredData.length)
      } else if(req.body.key === 'week') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical'))
          // console.log(filteredData.length)
          data.push(filteredData.length)
        })
      } else if(req.body.key === 'month') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical'))
          // console.log(filteredData.length)
          data.push(filteredData.length)
        })
      } else if(req.body.key === 'year') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date.includes(day) && o.Record.criticalty === 'Critical'))
          // console.log(filteredData.length)
          data.push(filteredData.length)
        })
      }

      // Disconnect from the gateway.
      await gateway2.disconnect();
      
      var suc = {
        'code': 200,
        'msg': 'Data',
        'filterData': data
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  criticalAnalysisInnerData: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path in cri: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      // console.log('asdas', allInventory)
      var vendorSelector = {
        "selector": {
          "user_type": "Vendor"
        }
      }
      var vendorArgs = [];
      vendorArgs[0] = JSON.stringify(vendorSelector)
      let allVendors = await contract.evaluateTransaction('queryData', ...vendorArgs);
      allVendors = JSON.parse(allVendors.toString());
      var data = []
      var vendorArr = []
      if(req.body.key === 'year') {
        allVendors.map(async function (vendor) {
          
          var filterDataLength = 0
          var days = req.body.days
          // console.log(vendor)
          days.map(async function (day, index) {
            // console.log(day, filterDataLength)
            var filterData = []
            filterData = await allInventory.filter(o=>(o.Record.entry_date === day && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendor.Record.user_id))
            // console.log(filterData.length)
            filterDataLength =  filterDataLength + filterData.length
            if(index === days.length -1) {
              vendorArr.push(vendor.Record.name)
              data.push(filterDataLength)
            }
          })
          
        })
      }else{
        allVendors.map(async function (vendor) {
          var filterData = []
          // console.log(vendor)
          vendorArr.push(vendor.Record.name)
          filterData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(req.body.date)).toDateString() && o.Record.criticalty === 'Critical') && o.Record.vendor_id === vendor.Record.user_id)
          data.push(filterData.length)
        })
      }
      
      console.log(vendorArr)

      // Disconnect from the gateway.
      await gateway2.disconnect();
      
      var suc = {
        'code': 200,
        'msg': 'Data',
        'dataLabel': vendorArr,
        'filterData': data
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  criticalVendorAnalysisData: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      // console.log('asdas', allInventory)
      
      var data = []
      var vendorId = req.body.vendor_id
      if(req.body.key === 'today') {
        var filteredData;
        filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date()).toDateString() && o.Record.vendor_id === vendorId))
        filteredData = await filteredData.filter(o=>o.Record.criticalty === 'Critical')
        data.push(filteredData.length)
      } else if(req.body.key === 'week') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
          // console.log(filteredData.length)
          data.push(filteredData.length)
        })
      } else if(req.body.key === 'month') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
          // console.log(filteredData.length)
          data.push(filteredData.length)
        })
      } else if(req.body.key === 'year') {
        var days = req.body.days
        days.map(async function (day) {
          var filteredData = [];
          filteredData = await allInventory.filter(o=>(o.Record.entry_date.includes(day) && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
          // console.log(filteredData.length, vendorId)
          data.push(filteredData.length)
        })
      }

      // Disconnect from the gateway.
      await gateway2.disconnect();
      
      var suc = {
        'code': 200,
        'msg': 'Data',
        'filterData': data
      }

      res.send(suc);
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  productAnalysisData: async function (req, res, next) {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    try {
      // Create a new gateway for connecting to our peer node.
      const gateway2 = new Gateway();
      await gateway2.connect(ccp, { wallet, identity: userId, discovery: gatewayDiscovery });

      console.log('chan', channelName)
      // Get the network (channel) our contract is deployed to.
      const network = await gateway2.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(smartContractName);

      let allInventory = await contract.evaluateTransaction('getAllInventory', "Hello");
      allInventory = JSON.parse(allInventory.toString());
      // console.log('asdas', allInventory)
      
      var filteredData;
      var labelArray = []
      var lengthArray = []
      filteredData = await allInventory.filter(o=>o.Record.criticalty === "Critical")
      // let unique = await removeDuplicates(filteredData, 'part_description')
      console.log(filteredData.length)
      var test = filteredData.map(item => item.Record.part_description).filter((value, index, self) => self.indexOf(value) === index)
      console.log()
      filteredData.map(async function (data, index) {
        
        var label2 = await labelArray.find(e=>e === data.Record.part_description)
        console.log(label2)
          if(label2 != data.Record.part_description) {
            labelArray.push(data.Record.part_description) 
          } else{
            return false
          }

          if(index === filteredData.length-1) {
            labelArray.map(async function (label) {
              var filterLength;
              // console.log(label)
              var fil_data = await filteredData.filter(e=>e.Record.part_description === label)
              // console.log(fil_data.length)
              filterLength = fil_data.length ? fil_data.length : 0;
              lengthArray.push(filterLength)
            })
          }
      })
      console.log(labelArray)

      console.log(lengthArray)
      var data = []
      // var vendorId = req.body.vendor_id
      // if(req.body.key === 'today') {
      //   var filteredData;
      //   filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date()).toDateString() && o.Record.vendor_id === vendorId))
      //   filteredData = await filteredData.filter(o=>o.Record.criticalty === 'Critical')
      //   data.push(filteredData.length)
      // } else if(req.body.key === 'week') {
      //   var days = req.body.days
      //   days.map(async function (day) {
      //     var filteredData = [];
      //     filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
      //     // console.log(filteredData.length)
      //     data.push(filteredData.length)
      //   })
      // } else if(req.body.key === 'month') {
      //   var days = req.body.days
      //   days.map(async function (day) {
      //     var filteredData = [];
      //     filteredData = await allInventory.filter(o=>(o.Record.entry_date === (new Date(day)).toDateString() && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
      //     // console.log(filteredData.length)
      //     data.push(filteredData.length)
      //   })
      // } else if(req.body.key === 'year') {
      //   var days = req.body.days
      //   days.map(async function (day) {
      //     var filteredData = [];
      //     filteredData = await allInventory.filter(o=>(o.Record.entry_date.includes(day) && o.Record.criticalty === 'Critical' && o.Record.vendor_id === vendorId))
      //     // console.log(filteredData.length, vendorId)
      //     data.push(filteredData.length)
      //   })
      // }

      // Disconnect from the gateway.
      await gateway2.disconnect();
     setTimeout(() => {
      var suc = {
        'code': 200,
        'msg': 'Data',
        'label': labelArray,
        'filterArray': test
      }
      res.send(suc);
     }, 1000); 
      

      
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },
}