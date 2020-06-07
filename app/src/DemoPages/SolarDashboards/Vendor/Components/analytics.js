import React, {Component, Fragment} from 'react';
import {
    Row, Col,
    Button,
    CardHeader,
    Container,
    Card,
    CardBody,
    CardFooter,
    UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import Rodal from 'rodal';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CountUp from 'react-countup';
import {
    Sparklines,
    SparklinesCurve
} from 'react-sparklines';

import Ionicon from 'react-ionicons';
import  { Redirect } from 'react-router-dom'

import DatePicker from 'react-datepicker';
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

import Select from 'react-select';

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


export default class AnalyticCards extends Component {
    constructor() {
        super();

    }

    state = {
        userdetails:'',
        selectedOption: null,
        data:[],
        criticaldata:[],
        Aknowledgedata:[],
        pos:0,
        currentdate:'',
        currentprod:'',
        apidate:new Date(),
        datepickervisible:false,
        datepickerdate:new Date(),
    };

    componentDidMount() {
         var userexist =  JSON.parse(localStorage.getItem('user_data'));
    this.setState({
            userdetails: userexist
        }, () => {
            this.callbApi()
        });
    var onload ={value: "1", label: "Today"}
     this.handleChange(onload)  
     //this.showdatepicker();
    //this.callAPI()
    
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
                this.callbApi()
        });

    }

  callbApi() {

         var data={
            'colVal':this.state.userdetails.user_id,
            'date': this.state.apidate
        }
        console.log('analytics data',data);
        
        fetch('/getUserData', {
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
                data:responseData.user_data
            }, () => {
                    this.dataresult();
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
                this.callbApi()
            })
        }else if(selectedOption.value ==2){
            finaldate ="Yesterday "+(date-1)+"/"+month+"/"+year
            this.setState({
                currentdate:finaldate,
                apidate:today.setDate(today.getDate()-1)
            },()=>{
                this.callbApi()
            })
        }else if(selectedOption.value ==3){
            this.showdatepicker();
        }
        // else{
        //     finaldate ="Day Before Yesterday "+(date-2)+"/"+month+"/"+year
        //    this.setState({
        //         currentdate:finaldate,
        //         apidate:today.setDate(today.getDate()-1)
        //     },()=>{
        //         this.callbApi()
        //     })
        // }
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
            pos:this.state.data.map(item => item.Record.purchase_order)
            .filter((value, index, self) => self.indexOf(value) === index).length
        })
        console.log(this.state.pos)
    }

    showposdata(type){
        console.log(type)
        if(type=="pos"){
            //return <Redirect to='#/solar/details/pos'  />
            window.location="#/solar/details/pos"
        }
       else if(type=="critical"){
            //return <Redirect to='#/solar/details/critical'  />
            window.location="#/solar/details/critical"
        }else if(type == "pendingack"){
            //return <Redirect to='#/solar/details/pendingack'  />
            window.location="#/solar/details/pendingack"
        }
    }

    callgraph(type){

        if(type=="critical"){
            window.location="#/solar/vendorcriticalanalysis"
        }
    }


    render() {
        const {selectedOption} = this.state;

        return (
            <Fragment>
                <Container fluid>
                    <Card className="mb-3">
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
                            <Col sm="6" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left card_click">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-10 bg-warning"/>
                                        <i className="lnr-inbox text-dark opacity-8"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            No of Products
                                        </div>
                                        <div className="widget-numbers">
                                            {this.state.data.length}
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="divider m-0 d-md-none d-sm-block"/>
                            </Col>
                            <Col sm="6" md="3" xl="3">
                                <div className="card no-shadow rm-border bg-transparent widget-chart text-left card_click" onClick={this.showposdata.bind(this,"pos")}>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg opacity-10 bg-warning"/>
                                        <i className="lnr-tag text-dark opacity-8"/>
                                    </div>
                                    <div className="widget-chart-content">
                                        <div className="widget-subheading">
                                            POS
                                        </div>
                                        <div className="widget-numbers">
                                            {this.state.pos}
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="divider m-0 d-md-none d-sm-block"/>
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
