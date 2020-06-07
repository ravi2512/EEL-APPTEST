import React, { Component, Fragment } from 'react';
import {
    Row, Col,
    Button,
    CardHeader,
    Container,
    Card,
    CardBody,
    CardFooter,
    UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, ModalHeader, ModalBody, ModalFooter, Form,
    FormGroup, Label,
    Input, FormText, CardTitle,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import Rodal from 'rodal';
import DatePicker from 'react-datepicker';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import CountUp from 'react-countup';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Sparklines,
    SparklinesCurve
} from 'react-sparklines';

import Ionicon from 'react-ionicons';

import PageTitle from '../../../Layout/AppMain/PageTitle';

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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Select from 'react-select';

import moment from 'moment';
import { Redirect } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';

const options = [
    { value: '1', label: 'Today' },
    { value: '2', label: 'Week' },
    { value: '3', label: 'Month' },
    { value: '4', label: 'Yearly' },
];
const yearoptions = [
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
];
const monthoptions = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
];



export default class CriticalAnalysis extends Component {
    constructor() {
        super();

        this.state = {
            head: "Critical Analysis",
            datalabels: ['Today'],
            datavalues: [4],
            selectedOption: null,
            yearselect: null,
            weekselect: null,
            monthselect:null,
            yearvisible: false,
            weeksvisible: false,
            monthvisible:false,
            monthoptions:null,
            weekoptions: [],
            days:[]
        };

    }

    componentDidMount() {
        var onload = { value: "1", label: "Today" }
        this.handleChange(onload)
        console.log('test', (new Date(moment('2019-01-3'))).toDateString(), moment().year(2018).weeks(), new Date())
        // var year = { value: "2019", label: "2019" }
        // this.yearChange(year)
        this.callApi('today')
    }

    callApi(keydata) {
        var data = {}
        data['key'] = keydata
        if(keydata === 'week' || keydata === 'month' || keydata === 'year') {
            data['days'] = this.state.days
        }
        fetch('/criticalData', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('BlocchainData', responseData)
                if (responseData.code == 200) {
                    this.setState({
                        datavalues: responseData.filterData
                    }, () => {
                        // this.dataresult();
                    });
                } else {

                }

            });
    }

    handleChange = (selectedOption) => {

        if (selectedOption.value == 1) {
            this.setState({
                yearvisible: false,
                weeksvisible: false,
                monthvisible:false,
                yearselect:null,
                
            }, () => {
                
                var dbl=['Today']
                this.setState({
                    datalabels:dbl
                }, () => {
                    this.callApi('today')
                })
            })
        }else if (selectedOption.value == 2) {
            this.setState({
                yearvisible: true,
                monthvisible:false,
                yearselect:null,
               
            })
        }else if (selectedOption.value == 3) {
            this.setState({
                yearvisible: true,
                weeksvisible:false,
                yearselect:null,
                
            })
        }else if (selectedOption.value == 4) {
            this.setState({
                yearvisible: true,
                weeksvisible:false,
                monthvisible:false,
                yearselect:null,
                
            })
        }

        this.setState({ selectedOption });
    };

    yearChange = (yearselect) => {

        this.setState({ yearselect });
        var weeks = moment(yearselect).weeksInYear()
        var weekoptions = [];
        var monthoptions =[];
        for (var i = 1; i <= weeks; i++) {
            weekoptions.push({ value: i, label: i });
        }
        var month =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        //console.log('year change',this.state.selectedOption);
        if(this.state.selectedOption.value == "2"){
            this.setState({
                weekoptions: weekoptions,
                weeksvisible: true
             })
        }else if(this.state.selectedOption.value == "3"){
            this.setState({
                monthvisible: true
             })
        }else if(this.state.selectedOption.value == "4"){
            this.setState({
                days: ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datalabels: ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            }, () => {
                this.callApi('year')
            })
        }

    };

    getDaysArray(y, w) {
        // console.log(y, (w).toString())
        let days = [1, 2, 3, 4, 5, 6, 7]
            .map(d => moment(y.value + '-' + w.value + '-' + d, 'YYYY-W-E'));
        // console.log(days);
        var test = []
        var label = []
        days.map(function (day) {
            test.push((new Date(day)).toDateString())
            var d = new Date(day)
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var date = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear() 
            label.push(date)
        })
        this.setState({
            datalabels: label
        })
        return test
    }


    getMonthArray(y, m) {
        var days = moment(y.value+'-'+m.value, "YYYY-MM").daysInMonth()
        var daysLabel = []
        var daysArr = []
        for(var i =1; i <= days; i++) {
            daysArr.push((new Date(moment(y.value+'-'+m.value+'-'+i))).toDateString())
        }

        daysArr.map(function (day) {
            var d = new Date(day)
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var date = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear()
            daysLabel.push(date)
        })

        this.setState({
            datalabels: daysLabel
        })

        return daysArr
        //console.log(daysArr, daysLabel)
    }

     getMonthArraybeakdown(y, m) {
        var days = moment(y.value+'-'+m, "YYYY-MM").daysInMonth()
        var daysLabel = []
        var daysArr = []
        for(var i =1; i <= days; i++) {
            daysArr.push((new Date(moment(y.value+'-'+m+'-'+i))).toDateString())
        }

        daysArr.map(function (day) {
            var d = new Date(day)
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var date = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear()
            daysLabel.push(date)
        })

        return daysArr
    }

    weekChange = (weekselect) => {
        this.setState({ weekselect }, async () => {
            var test = await this.getDaysArray(this.state.yearselect, weekselect)
            console.log(test, this.state.days);
            this.setState({
                days: test
            }, () => {
                this.callApi('week')
            })
        });

    };

    monthChange =(monthselect)=>{
        this.setState({
            monthselect
        }, async () => {
            var test = await this.getMonthArray(this.state.yearselect, monthselect)
            console.log(test)
            this.setState({
                days: test
            }, () => {
                this.callApi('month')
            })
        })
    }

    callBreakdown(date){

        var dt='';
        var prm ='';


        if(date == 'Today'){
            dt = new Date().toDateString();
            window.location='#/solar/criticalbreakdown/'+dt
        }else{
            if(this.state.selectedOption.value ==4){
                dt = this.getMonthArraybeakdown(this.state.yearselect,date)
                console.log('horray',prm)
                window.location='#/solar/criticalbreakdown/'+dt
            }else{
                dt = new Date(date).toDateString();
                window.location='#/solar/criticalbreakdown/'+dt
            }
        }
        console.log(dt)
        //alert(dt)
        
    }



    render() {
        const { selectedOption } = this.state;
        const { yearselect,weekselect,monthselect } = this.state;
        const data = {
            labels: this.state.datalabels,
            datasets: [
                {
                    label: 'No. of Critical Product',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    borderCapStyle: 'round',
                    data: this.state.datavalues
                }
            ]
        };
        return (
            <Fragment>
                <PageTitle
                    heading={this.state.head}
                    subheading=""
                    icon="pe-7s-bandaid icon-gradient bg-amy-crisp"
                />
                <Container fluid>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody className="card-header-tab ">
                                    <div className="widget-heading">
                                        Select Filter Type
                                </div>
                                    <span className="d-inline-block ml-2" style={{ width: 200, marginBottom: '1%' }}>
                                        <Select
                                            value={selectedOption}
                                            onChange={this.handleChange}
                                            options={options}
                                        />
                                    </span>
                                    {this.state.yearvisible &&
                                        <div >
                                            <div className="widget-heading">
                                                Select Year
                                        </div>
                                            <span className="d-inline-block ml-2" style={{ width: 200, marginBottom: '1%' }}>
                                                <Select
                                                    value={yearselect}
                                                    onChange={this.yearChange}
                                                    options={yearoptions}
                                                />
                                            </span>
                                        </div>
                                    }
                                    {this.state.weeksvisible &&
                                        <div >
                                            <div className="widget-heading">
                                                Select Week
                                        </div>
                                            <span className="d-inline-block ml-2" style={{ width: 200, marginBottom: '1%' }}>
                                                <Select
                                                    value={weekselect}
                                                    onChange={this.weekChange}
                                                    options={this.state.weekoptions}
                                                />
                                            </span>
                                        </div>
                                    }
                                    {this.state.monthvisible &&
                                        <div >
                                            <div className="widget-heading">
                                                Select Month
                                        </div>
                                            <span className="d-inline-block ml-2" style={{ width: 200, marginBottom: '1%' }}>
                                                <Select
                                                    value={monthselect}
                                                    onChange={this.monthChange}
                                                    options={monthoptions}
                                                />
                                            </span>
                                        </div>
                                    }
                                   

                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardHeader className="card-header-tab ">
                                    <div
                                        className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                        <i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                                        {this.state.currentdate}
                                    </div>
                                    <div className="btn-actions-pane-right text-capitalize">
                                        <span className="d-inline-block ml-2" style={{ width: 200 }}>

                                        </span>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        <Bar
                                            onElementsClick={elems => {
                                                console.log(elems[0]._model.label);
                                                this.callBreakdown(elems[0]._model.label)
                                              // window.location='#/solar/criticalbreakdown'
                                            }}
                                            data={data}
                                            width={100}
                                            height={50}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    yAxes: [{
                                                        ticks: {
                                                          beginAtZero: true
                                                        }
                                                    }]
                                                }
                                            }}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}