import React, {Component, Fragment} from 'react';
import {
    Row, Col,
    Nav,
    NavItem,
    NavLink,
    Button,
    CardHeader,
    Container,
    Card,
    CardBody,
    CardFooter,
    ButtonGroup,
    Table,
    Popover, PopoverBody,
    UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import Rodal from 'rodal';
import DatePicker from 'react-datepicker';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CountUp from 'react-countup';
import {
    Sparklines,
    SparklinesBars,
    SparklinesLine,
} from 'react-sparklines';

import Ionicon from 'react-ionicons';
import bg1 from '../../../../assets/utils/images/dropdown-header/abstract1.jpg';

import classnames from 'classnames';

import avatar1 from '../../../../assets/utils/images/avatars/1.jpg';
import avatar2 from '../../../../assets/utils/images/avatars/2.jpg';
import avatar3 from '../../../../assets/utils/images/avatars/3.jpg';
import avatar4 from '../../../../assets/utils/images/avatars/4.jpg';


import {
    faAngleUp,
    faAngleDown,
    faCalendarAlt,
    faEllipsisH,
    faCheck,
    faTrashAlt,
    faBusinessTime,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    toast,
    Slide
} from 'react-toastify';
import Select from 'react-select';
import moment from 'moment';

const options = [
    {value: '1', label: 'Today'},
    {value: '2', label: 'Yesterday'},
    {value: '3', label: 'Select Date'},
];


function boxMullerRandom() {
    let phase = false,
        x1, x2, w, z;

    return (function () {

        if (phase = !phase) {
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);

            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            return x1 * w;
        } else {
            return x2 * w;
        }
    })();
}

function randomData(n = 30) {
    return Array.apply(0, Array(n)).map(boxMullerRandom);
}



const sampleData = randomData(10);


export default class AdminAnalytic extends Component {
    constructor() {
        super();

    }

    state = {
        selectedOption: null,
        data:[],
        users:[],
        storeusers:[],
        criticaldata:[],
        Aknowledgedata:[],
        Dispatchdata:[],
        Escallatedata:[],
        pos:0,
        currentdate:'',
        apidate:new Date(),
        visible: false,
        currentprod:'',
        synctime:'',
        usertype:'',
        datepickervisible:false,
        datepickerdate:new Date(),
    };

    componentDidMount() {
    this.getuser();
    var onload ={value: "1", label: "Today"}
     this.handleChange(onload)  
    this.callAPI();
    this.getlastsync();
    this.getusers();
    console.log(this.state.apidate)
  }

  componentWillReceiveProps(props){
        var onload ={value: "1", label: "Today"}
         this.handleChange(onload)  
        this.callAPI();
        this.getusers();
        this.getlastsync();
}

getuser(){
        var userexist =  JSON.parse(localStorage.getItem('user_data'));
        if(userexist){
            if(userexist.user_type == "Admin"){
                this.setState({
                    usertype:'Admin'
                })
               
             }else if(userexist.user_type == "Vendor"){
                this.setState({
                    usertype:'Vendor'
                })
               
            }
            else if(userexist.user_type == "Store"){
                this.setState({
                    usertype:'Store'
                })
               
            }
        }
    }

showdatepicker() {
        this.setState({
            datepickervisible: true,
        });
    }

    hidedatepicker() {
        this.setState({datepickervisible: false});
    }

    setdatepickerdate(){

         var dt = this.state.datepickerdate;
        var date = new Date(dt).getDate();
        var month = new Date(dt).getMonth() + 1;
        var year = new Date(dt).getFullYear();

        var finaldate = "Selected Date " + date + "/" + month + "/" + year

        this.setState({
            datepickervisible: false,
            apidate:this.state.datepickerdate,
            currentdate:finaldate
        },()=>{
                this.callAPI()
        });

    }

  show(data) {
    console.log('onclic',data)
        this.setState({
            visible: true,
            currentprod:data.Part_No
        });
    }

    hide() {
        this.setState({visible: false});
    }

     notify22 = () => this.toastId = toast("Data Sync has Started.", {
        transition: Slide,
        closeButton: false,
        autoClose: 10000,
        position: 'bottom-center',
        type: 'default'
    });

    UpdateAknowledgement(){
        //alert(this.state.currentprod)
        var currentarray = this.state.data;
        for (var i in currentarray) {
            if (currentarray[i].Part_No == this.state.currentprod) {
                currentarray[i].Aknowledge = 'yes';
                break; //Stop this loop, we found it!
            }
        }
        this.setState({visible: false});
        this.dataresult();
    }
    getlastsync(){
        fetch('/getLastSync').then((response) => response.json())
        .then((responseData) => {
        //console.log('Sync Data',moment().startOf(responseData.data[0].Record.sync_time).fromNow(),responseData.data[0].Record.sync_time)
        if(responseData.code == 200){
            if(responseData.data[0]){
                var dt = responseData.data[0].Record.sync_time;
                var formateddate = moment(dt).fromNow();
                this.setState({
                    synctime:formateddate,
                });
            }else{
                this.setState({
                    synctime:'',
                });
            }
        }else {
            
        }
    
    });
    }

  callAPI() {

    var data={
            'date':this.state.apidate,
        }

        console.log('callapi',data)


    fetch('/getInventory', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
        }).then((response) => response.json())
        .then((responseData) => {
        console.log('BlocchainData',responseData)
        if(responseData.code == 200){
            this.setState({
                data:responseData.data
            }, () => {
                    this.dataresult();
                });
        }else {
            
        }
    
    });
    
  }

  syncdata(){
    fetch('/addInventory').then((response) => response.json())
    .then((responseData) => {
    console.log('Sync Data Call Data',responseData)
    if(responseData.code == 200){
        console.log(responseData)
        this.notify22();
        this.getlastsync();

    }else {
        
    }

});
  }

  getusers(){
    fetch('/getUsers').then((response) => response.json())
        .then((responseData) => {
        console.log('Blocchain users Data',responseData)
        if(responseData.code == 200){
            this.setState({
                users:responseData.vendors,
                storeusers:responseData.stores
            });
        }else {
            
        }
    
    });
    
  }

    handleChange = (selectedOption) => {

        var today = new Date();
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1; 
        var year = new Date().getFullYear();

        var finaldate ="Today "+date+"/"+month+"/"+year
        if(selectedOption.value ==1){
            this.setState({
                currentdate:finaldate,
                apidate:today
            },()=>{
                this.callAPI()
            })
        }else if(selectedOption.value ==2){
            finaldate ="Yesterday "+(date-1)+"/"+month+"/"+year
            this.setState({
                currentdate:finaldate,
                apidate:today.setDate(today.getDate()-1)
            },()=>{
                this.callAPI()
            })
        }else if(selectedOption.value ==3){
            this.showdatepicker();
        }
        //alert(JSON.stringify(selectedOption));
        this.setState({selectedOption});
    };

    dataresult(){
        
        this.setState({
            criticaldata:this.state.data.filter(o=>o.Record.criticalty ==="Critical")
        })
        this.setState({
            Aknowledgedata:this.state.data.filter(o=>o.Record.acknowledgement_details.acknowledgement_status ==="No")
        })
        this.setState({
            Dispatchdata:this.state.data.filter(o=> moment(o.Record.dispatch_details.dispatched_date).format('l') === moment(this.state.apidate).format('l'))
        })
        this.setState({
            Escallatedata:this.state.data.filter(o=>o.Record.dispatch_details.escalation_status === 'Yes')
        })
        this.setState({
            pos:this.state.data.map(item => item.Record.purchase_order)
            .filter((value, index, self) => self.indexOf(value) === index).length
        })
    }

    showposdata(type){
        console.log(type)
       if(type=="critical"){
            window.location="#/solar/admindetails/critical"
        }else if(type == "pendingack"){
            window.location="#/solar/admindetails/pendingack"
        }
        else if(type == "dispatch"){
            window.location="#/solar/dispatchdetail"
        }
        else if(type == "escalate"){
            window.location="#/solar/escalationdetail"
        }
    }

    callgraph(type){

        if(type=="critical"){
            window.location="#/solar/criticalAnalysis"
        }
    }


    render() {
        const {selectedOption} = this.state;

        return (
            <Fragment>
                <Container fluid>
                    <Card className="mb-3">
                    <div style={{margin:'2%'}}>
                        <Row>
                            <Button className="mb-3 mr-2 btn-shadow" color="info" onClick={this.syncdata.bind(this)}>Sync</Button>
                            <p style={{}}>Last updated on {this.state.synctime}</p>
                        </Row>
                    </div>
                        <CardHeader className="card-header-tab z-index-6">
                            <div
                                className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                {this.state.currentdate}
                            </div>
                            <div className="btn-actions-pane-right text-capitalize">
                                    <span className="d-inline-block ml-2" style={{width: 200}}>
                                        <Select
                                            value={selectedOption}
                                            onChange={this.handleChange}
                                            options={options}
                                        />
                                    </span>
                            </div>
                        </CardHeader>
                        <Row className="no-gutters">
                            <Col sm="12" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left" onClick={this.showposdata.bind(this,"pendingack")}>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-9 bg-success"/>
                                        <i className="lnr-hourglass text-white"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            Pending Aknowledgement
                                        </div>
                                        <div className="widget-numbers text-success">
                                            <CountUp start={0}
                                                     end={this.state.Aknowledgedata.length}
                                                     separator=""
                                                     decimals={0}
                                                     decimal="."
                                                     prefix=""
                                                     useEasing={false}
                                                     suffix=""
                                                     duration="0"/>
                                        </div>
                                       
                                    </div>
                                </div>
                            </Col>
                            <Col sm="6" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left" onClick={this.showposdata.bind(this,"critical")}>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-9 bg-danger"/>
                                        <i className="pe-7s-attention text-white"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            Critical
                                        </div>
                                        <div className="widget-numbers">
                                            <CountUp start={0}
                                                     end={this.state.criticaldata.length}
                                                     separator=""
                                                     decimals={0}
                                                     decimal=","
                                                     prefix=""
                                                     useEasing={false}
                                                     suffix=""
                                                     duration="0"/>
                                        </div>
                    
                                    </div>
                                </div>
                                <div className="divider m-0 d-md-none d-sm-block"/>
                            </Col>
                            <Col sm="6" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left card_click" onClick={this.showposdata.bind(this,"dispatch")}>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-10 bg-warning"/>
                                        <i className="lnr-inbox text-dark opacity-8"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            Dispatch Item
                                        </div>
                                        <div className="widget-numbers">
                                            {this.state.Dispatchdata.length}
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="divider m-0 d-md-none d-sm-block"/>
                            </Col>
                            <Col sm="6" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left card_click" onClick={this.showposdata.bind(this,"escalate")}>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-10 bg-warning"/>
                                        <i className="lnr-tag text-dark opacity-8"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            Escalation
                                        </div>
                                        <div className="widget-numbers">
                                            {this.state.Escallatedata.length}
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="divider m-0 d-md-none d-sm-block"/>
                            </Col>
                        </Row>
                    </Card>
                    <Row>
                            <Col md="4" onClick={this.callgraph.bind(this,"critical")}>
                                <div className="card mb-3 bg-primary widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-1"/>
                                        <i className="lnr-cog text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        Critical Analysis
                                    </div>
                                    
                                    <div className="widget-description text-success">
                                        
                                        <span className="pl-2" style={{fontSize:30,fontWeight:'bold'}}>{this.state.criticaldata.length}</span>
                                    </div>
                                </div>
                            </Col>
                    </Row>
                     <Row>
                                            <Col md="6">
                                                <Card className="main-card mb-3">
                                                    <CardHeader>
                                                        Vendor List
                                                       
                                                    </CardHeader>
                                                     <div className="scroll-areas-lg">
                                                        <PerfectScrollbar>
                                                            <Table responsive hover striped borderless>
                                                                <thead>
                                                                <tr>
                                                                    <th className="text-center">SNO</th>
                                                                    <th className="text-center">#SIIL ID</th>
                                                                    <th className="text-center">Name</th>
                                                                    <th className="text-center">Critical Count</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.users.map((vendors, index) => (
                                                                    <tr>
                                                                        <td className="text-center">{index+1}</td>
                                                                        <td className="text-center text-muted">{vendors.Record.user_id}</td>
                                                                        <td className="text-center">
                                                                            <div className="widget-content p-0">
                                                                                <div className="widget-content-wrapper">
                                                                                    <div className="widget-content-left flex2">
                                                                                        <div className="widget-heading">
                                                                                            {vendors.Record.name}
                                                                                        </div>
                                                                                        <div className="widget-subheading opacity-7">
                                                                                            {vendors.Record.email}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center text-muted">{vendors.criticalCount}</td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table>
                                                        </PerfectScrollbar>
                                                    </div>
                                                </Card>
                                            </Col>
                                            {this.state.usertype == "Admin" && <Col md="6">
                                                <Card className="main-card mb-3">
                                                    <CardHeader>
                                                        Store List
                                                       
                                                    </CardHeader>
                                                    <div className="scroll-areas-lg">
                                                        <PerfectScrollbar>
                                                            <Table responsive hover striped borderless>
                                                                <thead>
                                                                <tr>
                                                                    <th className="text-center">SNO</th>
                                                                    <th className="text-center">#Employee ID</th>
                                                                    <th className="text-center">Name</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.storeusers.map((stores, index) => (
                                                                    <tr>
                                                                        <td className="text-center">{index+1}</td>
                                                                        <td className="text-center text-muted">{stores.Record.user_id}</td>
                                                                        <td className="text-center">
                                                                            <div className="widget-content p-0">
                                                                                <div className="widget-content-wrapper">
                                                                                    <div className="widget-content-left flex2">
                                                                                        <div className="widget-heading">
                                                                                            {stores.Record.name}
                                                                                        </div>
                                                                                        <div className="widget-subheading opacity-7">
                                                                                            {stores.Record.email}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table>
                                                        </PerfectScrollbar>
                                                    </div>
                                                </Card>
                                            </Col>}
                                        </Row>
                                        <Rodal visible={this.state.datepickervisible}
                        onClose={this.hidedatepicker.bind(this)}
                        showMask={false}
                    >
                        <ModalHeader>Select Date</ModalHeader>
                        <ModalBody>
                        <Card className="main-card mb-3">
                                <CardBody>
                                    <div className="text-center">
                                        <DatePicker
                                            inline
                                            selected={this.state.datepickerdate}
                                            onChange={(e) => {
                                                            this.setState({
                                                                datepickerdate: e
                                                            })
                                                        }}
                                            calendarClassName="no-shadow"
                                        />
                                    </div>
                                </CardBody>
                        </Card>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="link" onClick={this.hidedatepicker.bind(this)}>Cancel</Button>
                            <Button color="primary" onClick={this.setdatepickerdate.bind(this)}>Yes</Button>
                        </ModalFooter> 
                    </Rodal>

                </Container>
            </Fragment>
        )
    }
}
