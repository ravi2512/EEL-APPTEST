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
    { value: '3', label: 'Quaterly' },
    { value: '4', label: 'Yearly' },
];
const yearoptions = [
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
];


export default class CriticalBreakDown extends Component {
    constructor() {
        super();

        this.state = {
            head: "Critical Analysis",
            parameter:'',
            datalabels: ['Today'],
            datavalues: [4],
        };

    }

    componentDidMount() {
        console.log('Date',this.props.match.params)
        this.setState({
            parameter:this.props.match.params.type
        },() => {
            this.callApi();
        })
    }

    callApi() {

    var data ={}

    if (this.state.parameter.indexOf(',') > -1){

        var daysarr =this.state.parameter.split(',');
            data = {
                date: '',
                days: daysarr,
                key:'year'
            }

    }else{

        data = {
            date: this.state.parameter,
            days: '',
            key: ''
        }

    }
    
        fetch('/criticalInnerData', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('Breakdown Response', responseData)
                if (responseData.code == 200) {
                    this.setState({
                        datalabels:responseData.dataLabel,
                        datavalues: responseData.filterData
                    }, () => {
                        // this.dataresult();
                    });
                } else {

                }

            });
    }

    



    render() {
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
                    heading= 'BreakDown Analysis'
                    subheading=""
                    icon="pe-7s-bandaid icon-gradient bg-amy-crisp"
                />
                <Container fluid>
                    <Row>
                        <Col md="12">
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