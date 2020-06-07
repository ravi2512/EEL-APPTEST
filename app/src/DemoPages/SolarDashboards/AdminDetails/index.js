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
    Table,
    Input, FormText, CardTitle
} from 'reactstrap';

import Rodal from 'rodal';
import DatePicker from 'react-datepicker';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ReactTable from "react-table";
import PageTitle from '../../../Layout/AppMain/PageTitle';
import $ from 'jquery';
import dt from 'datatables.net';
import dtstyle from 'datatables.net-bs4';
//  import responsive from 'datatables.net-responsive';
import dtresponsive from 'datatables.net-responsive-bs4'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Select from 'react-select';

const options = [
    { value: '1', label: 'Today' },
    { value: '2', label: 'Yesterday' },
    { value: '3', label: 'Select Date' },
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
const columns = [
    {
        dataField: 'Record.date',
        text: 'Date'
    },
    {
        dataField: 'Record.purchase_order',
        text: 'PO No'
    },
    {
        dataField: 'Record.part_no',
        text: 'Part No'
    },
    {
        dataField: 'Record.part_description',
        text: 'Part Description',
        style: {
            width: '45%'
        }
    },
    {
        dataField: 'Record.uom',
        text: 'UOM'
    },
    {
        dataField: 'Record.max_stock',
        text: 'Max Stock'
    },
    {
        dataField: 'Record.min_stock',
        text: 'Min Stock'
    },
    {
        dataField: 'Record.opening_stock',
        text: 'Opening Stock'
    },
    {
        dataField: 'Record.consumption_per_day',
        text: 'Cons/Day'
    },
    {
        dataField: 'Record.consumption_per_3d',
        text: 'Cons/3Day'
    },
    {
        dataField: 'Record.to_supply',
        text: 'Quantity'
    },
    {
        dataField: 'Record.criticalty',
        isDummyField: false,
        text: 'Critical',
        style: {
            width: '40%'
        },
        formatter: (cellContent, row) => {
            console.log('row details',row,cellContent)
            if (cellContent == "Critical") {
                return (
                    <span>
                        <span style={{
                            color: 'var(--danger)',
                            transition: 'all .3s ease'
                        }}>
                            &#x25cf;
                        </span> {
                                cellContent
                            }
                    </span>
                );
            } else {
                return (
                    <span>
                    {
                            cellContent
                        }
                </span>
                );
            }

        }
    },
    {
        dataField: 'Record.acknowledgement_details.acknowledgement_status',
        text: 'Acknowledgement'
    },
    {
        dataField: 'Record.remark',
        text: 'Remark'
    }

];

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
            text: '5', value: 5
        }, {
            text: '10', value: 10
        },
        {
            text: '50', value: 50
        }
    ]
};

export default class AdminDetails extends Component {
    constructor() {
        super();

        this.state = {
            selectedOption: null,
            parameter: '',
            userdetails: '',
            currentdate: '',
            apidate: new Date(),
            data: [],
            criticaldata: [],
            Aknowledgedata: [],
            Dispatchdata: [],
            Escallatedata: [],
            datepickervisible:false,
            datepickerdate:new Date(),
        };

    }

    componentDidMount() {

        var onload = { value: "1", label: "Today" }
        this.handleChange(onload)

        this.setState({
            parameter: this.props.match.params.type
        }, () => {
            this.callAPI();

        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            parameter: props.match.params.type,
        }, async () => {
            this.callAPI()
        })
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


    handleChange = (selectedOption) => {

        var today = new Date();
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        var finaldate = "Today " + date + "/" + month + "/" + year
        if (selectedOption.value == 1) {
            this.setState({
                currentdate: finaldate,
                apidate: today
            }, () => {
                this.callAPI()
            })
        } else if (selectedOption.value == 2) {
            finaldate = "Yesterday " + (date - 1) + "/" + month + "/" + year
            this.setState({
                currentdate: finaldate,
                apidate: today.setDate(today.getDate() - 1)
            }, () => {
                this.callAPI()
            })
        } else if(selectedOption.value ==3){
            this.showdatepicker();
        }
        //alert(JSON.stringify(selectedOption));
        this.setState({ selectedOption });
    };

    callAPI() {
        var ts = ''
        var data = {
            'date': this.state.apidate,
        }


        fetch('/getInventory', {
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
                        data: responseData.data
                    }, () => {
                        this.dataresult();
                    });
                } else {

                }

            });

    }

    dataresult() {

        if (this.state.parameter == "critical") {
            this.setState({
                data: this.state.data.filter(o => o.Record.criticalty === "Critical"),
                head: 'Critical List'

            })
        } else if (this.state.parameter == "pendingack") {
            this.setState({
                data: this.state.data.filter(o => o.Record.acknowledgement_details.acknowledgement_status === "No"),
                head: 'Pending List'

            })
        } else if (this.state.parameter == "dispatch") {
            this.setState({
                data: this.state.data.filter(o => o.Record.dispatch_details.dispatched_date === this.state.apidate),
                head: 'Dispatch List'

            })

        } else if (this.state.parameter == "escalate") {

            this.setState({
                data: this.state.data.filter(o => o.Record.dispatch_details.escalation_remark != ''),
                head: 'Escalate List'

            })

        } else if (this.state.parameter == "today") {

            this.setState({
                head: 'Todays List'

            })

        }
    }

    render() {
        const { selectedOption } = this.state;
        return (
            <Fragment>
                <PageTitle
                    heading={this.state.head}
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
                                        <span className="d-inline-block ml-2" style={{ width: 200 }}>
                                            <Select
                                                value={selectedOption}
                                                onChange={this.handleChange}
                                                options={options}
                                            />
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardBody>

                                    {/* <Table  responsive striped bordered>
                                        <thead>
                                        <tr>
                                            <th className="text-center">SNO</th>
                                            <th className="text-center">PO No</th>
                                            <th className="text-center">Part No</th>
                                            <th className="text-center">Date</th>
                                            <th className="text-center">Part Description</th>
                                            <th className="text-center">UOM</th>
                                            <th className="text-center">Max Stock</th>
                                            <th className="text-center">Min Stock</th>
                                            <th className="text-center">Opening Stock</th>
                                            <th className="text-center">Consumption/Day</th>
                                            <th className="text-center">Consumption Next 3 days</th>
                                            <th className="text-center">To Supply</th>
                                            <th className="text-center">Criticality</th>
                                            <th className="text-center">Aknowledgement</th>
                                            <th className="text-center">Remark</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.data.map((records, index) => (
                                            <tr>
                                                <td className="text-center">{index+1}</td>
                                                <td className="text-center">{records.Record.purchase_order}</td>
                                                <td className="text-center">{records.Record.part_no}</td>
                                                <td className="text-center">{records.Record.date}</td>
                                                <td className="text-center">{records.Record.part_description}</td>
                                                <td className="text-center">{records.Record.uom}</td>
                                                <td className="text-center">{records.Record.max_stock}</td>
                                                <td className="text-center">{records.Record.min_stock}</td>
                                                <td className="text-center">{records.Record.opening_stock}</td>
                                                <td className="text-center">{records.Record.consumption_per_day}</td>
                                                <td className="text-center">{records.Record.consumption_per_3d}</td>
                                                <td className="text-center">{records.Record.to_supply}</td>
                                                <td className="text-center">{records.Record.criticalty}</td>
                                                <td className="text-center">{records.Record.acknowledgement_details.acknowledgement_status}</td>
                                                <td className="text-center">{records.Record.remark}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table> */}
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
