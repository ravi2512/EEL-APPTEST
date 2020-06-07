var express = require('express');
var router = express.Router();
const csv = require('csv-parser')
const fs = require('fs')
const fctl = require('../../controller')

//const cntrl = require("../../controller.js")
//const results = [];
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getdata', function(req, res, next) {
const results = [];
	fs.createReadStream(path.join(__dirname + '/solartest.csv'))
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {

  	var test = results.filter(function (vendor) { return vendor.Vendor === "ABC"; });
    console.log(test);
    res.send(results);
  });
  
});

router.post('/userlogin', function(req, res, next) {
  const results = [];
    var userid=req.body.userid;
    var password =req.body.password;

    if(userid == password){
        console.log("in abc")
        fs.createReadStream(path.join(__dirname + '/solartest.csv'))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
  
      var test = results.filter(d=>d.Vendor.includes(userid));
      if(test.length > 0){
        var success ={
          'code':200,
          'userid':userid,
          'data':test
        }
        res.send(success);
      }else{
        var success ={
          'code':202,
          'userid':userid,
          'msg':'Vendor Not Found'
        }
        res.send(success);
      }
    });
    }
  //   if(userid === "ABC" && password === "ABC"){
  //     console.log("in abc")
  //     fs.createReadStream(path.join(__dirname + '/solartest.csv'))
  // .pipe(csv())
  // .on('data', (data) => results.push(data))
  // .on('end', () => {

  // 	var test = results.filter(d=>d.Vendor.includes("ABC"));
  //   res.send(test);
  // });
  //   }else if(userid === "MCP" && password === "MCP"){
  //     console.log("in mcp")
  //     fs.createReadStream(path.join(__dirname + '/solartest.csv'))
  //     .pipe(csv())
  //     .on('data', (data) => results.push(data))
  //     .on('end', () => {
    
  //       var test = results.filter(d=>d.Vendor.includes("MCP"));
  //       res.send(test);
  //     });
  //   }
    else{
      var success ={
        "code":201,
        "msg":"user doses not exist"
      }
      res.send(success)
    }
    
});

router.post('/createuser', fctl.createUser)

router.get('/addInventory', fctl.addInventory)

router.post('/getInventory', fctl.getInventory)

router.post('/login', fctl.userLogin)

router.post('/getUserData', fctl.getUserData)

router.get('/getUsers', fctl.getUsers)

router.post('/criticalData', fctl.criticalAnalysisData)

router.post('/criticalVendorData', fctl.criticalVendorAnalysisData)

router.post('/criticalInnerData', fctl.criticalAnalysisInnerData)

router.post('/productData', fctl.productAnalysisData)

router.get('/getLastSync', fctl.getLastSyncTime)

router.get('/syncInventory', fctl.addXlsInventory)

router.post('/updateEscalationDetails', fctl.updateEscalationDetails)

router.post('/updateEscalationAcknowledgement', fctl.updateEscalationAcknowledgement)

router.post('/updateAcknowledgementDetails', fctl.updateAcknowledgementDetails)

module.exports = router;
