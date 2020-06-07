import React, {Component, Fragment} from 'react';
import {
    Row, Col,
    Button,
    CardHeader,
    Container,
    Card,
    CardBody,
    CardFooter,
    UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,ModalHeader, ModalBody, ModalFooter,Form,
    FormGroup, Label,
    Input, FormText,CardTitle
} from 'reactstrap';

import Rodal from 'rodal';
import DatePicker from 'react-datepicker';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import Select from 'react-select';

const options = [
    {value: '1', label: 'Today'},
    {value: '2', label: 'Yesterday'},
    {value: '3', label: 'Select Date'},
];

const MyExportCSV = (props) => {
    const handleClick = () => {
        props.onExport();
    };
    return (
        <div>
            <button className="btn btn-success" onClick={handleClick}>Export to CSV</button>
        </div>
    );
};

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
        Showing {from} to {to} of {size} Results
    </span>
);

const pageoptions = {
    paginationSize: 4,
    pageStartIndex: 1,
    alwaysShowAllBtns: true, // Always show next and previous button
    withFirstAndLast: false, // Hide the going to First and Last page button
    hideSizePerPage: false, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: false, // Hide the pagination list when only one page
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    sizePerPageList: [
        {
            text: '100', value: 100
        }, {
            text: '150', value: 150
        },
    ]
};

export default class WeeklyCards extends Component {
    constructor() {
        super();

        this.state = {
            userdetails:'',
            data:[],
            apidate:new Date(),
            selectedOption: null,
            datepickervisible:false,
            datepickerdate:new Date(),
            };

    }

    componentDidMount() {
        var onload = { value: "1", label: "Today" }
        this.handleChange(onload)
        this.setState({
            userdetails: JSON.parse(localStorage.getItem('user_data'))

        }, () => {
            this.callbApi()
        });  
     }

  callbApi() {

         var data={
            'colVal':this.state.userdetails.user_id,
            'date': this.state.apidate
        }
        console.log('userdeatils in Weekly plan',this.state.userdetails);
        
        fetch('/getUserData', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
        }).then((response) => response.json())
        .then((responseData) => {
        console.log('Weekly details',responseData)
        if(responseData.code == 200){
            this.setState({
                data:responseData.user_data
            });
        }else {
            
        }
    });

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
    //alert(JSON.stringify(selectedOption));
    this.setState({selectedOption});
};

    render() {
        const columns = [
     {
        dataField: 'Record.date',
        text: 'Date',
        sort: true
    },
     {
        dataField: 'Record.inventory_type',
        text: 'Procurement Type',
        sort: true
    },
    {
        dataField: 'Record.part_no',
        text: 'Part No',
        sort: true
    },
    {
        dataField: 'Record.part_description',
        text: 'Part Description',
        sort: true,
    },
    {
        dataField: 'Record.uom',
        text: 'UOM',
        sort: true
    },
    {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 1',
        sort: true
    },
    {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 2',
        sort: true
    },
    {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 3',
        sort: true,
    },
    {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 4',
        sort: true,
    },
     {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 5',
        sort: true,
    },
     {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 6',
        sort: true,
    },
     {
        dataField: 'Record.weekly_plan.day_1',
        text: 'Day 7',
        sort: true,
    },
];

const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
}];
const {selectedOption} = this.state;
        return (
            <Fragment>
                 <PageTitle
                heading='Weekly Report'
                subheading=""
                icon="pe-7s-notebook icon-gradient bg-mixed-hopes"
            />
                <Container fluid>
                    <Row>
                    <Col md="12">
                        <Card className="main-card mb-3">
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
                            <CardBody>
                                <div className="table-responsive">
                                <ToolkitProvider
                                        keyField="id"
                                        data={this.state.data}
                                        columns={columns}
                                        exportCSV
                                    >
                                        {
                                            props => (
                                                <div>

                                                    <MyExportCSV {...props.csvProps} />
                                                    <hr />

                                                    <BootstrapTable {...props.baseProps} pagination={paginationFactory(pageoptions)} />

                                                </div>
                                            )
                                        }
                                    </ToolkitProvider>
                                </div>
                            </CardBody>
                        </Card>
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
