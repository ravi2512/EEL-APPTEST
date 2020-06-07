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
    Input, FormText, CardTitle
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
import { Redirect } from 'react-router-dom'

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

// const columns = [
//     {
//         dataField: 'Record.date',
//         text: 'Date'
//     },
//     {
//         dataField: 'Record.purchase_order',
//         text: 'PO No'
//     },
//     {
//         dataField: 'Record.part_no',
//         text: 'Part No'
//     },
//     {
//         dataField: 'Record.part_description',
//         text: 'Part Description',
//         style: {
//             width: '45%'
//         }
//     },
//     {
//         dataField: 'Record.uom',
//         text: 'UOM'
//     },
//     {
//         dataField: 'Record.max_stock',
//         text: 'Max Stock'
//     },
//     {
//         dataField: 'Record.min_stock',
//         text: 'Min Stock'
//     },
//     {
//         dataField: 'Record.opening_stock',
//         text: 'Opening Stock'
//     },
//     {
//         dataField: 'Record.consumption_per_day',
//         text: 'Cons/Day'
//     },
//     {
//         dataField: 'Record.consumption_per_3d',
//         text: 'Cons/3Day'
//     },
//     {
//         dataField: 'Record.to_supply',
//         text: 'Quantity'
//     },
//     {
//         dataField: 'Record.criticalty',
//         text: 'Critical'
//     },
//     {
//         dataField: 'Record.acknowledgement_details.acknowledgement_status',
//         text: 'Acknowledgement'
//     },
//     {
//         dataField: 'Record.remark',
//         text: 'Remark'
//     }

// ];

const options1 = [1, 2, 3, 4, 5, 6, 7, 8];

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
const sampleData2 = randomData(15);
const sampleData3 = randomData(8);
const sampleData4 = randomData(12);


export default class AnalyticCards extends Component {
    constructor() {
        super();
        this.todaysdate = new Date()
        this.state = {
            userdetails: '',
            dispatchDate: new Date(),
            etaDate: new Date(this.todaysdate.setDate(this.todaysdate.getDate() + 1)),
            selectedOption: null,
            data: [],
            criticaldata: [],
            Aknowledgedata: [],
            pos: 0,
            currentdate: '',
            parameter: '',
            visible: false,
            vendorpopup: false,
            currentprod: '',
            apidate: new Date(),
            isescalate: 'No',
            head: '',
            qty: '',
            vehicleNo: '',
            inventory_id: '',
            ackinventory_id:'',
            remark: '',
            escalationremark: '',
            ackreason:'',
            drivercontact:'',
            drivername:'',
            suplierqty:'',
            datepickervisible:false,
            datepickerdate:new Date(),
        };

    }


    componentDidMount() {
        
        this.setState({
            parameter: this.props.match.params.type,
            userdetails: JSON.parse(localStorage.getItem('user_data'))

        }, () => {
            this.callbApi()
        });
        this.dispatchChange(this.state.dispatchDate)
        this.etaChange(this.state.etaDate)
        console.log(this.props.match.params.type)
        var onload = { value: "1", label: "Today" }
        this.handleChange(onload)
        //this.callbApi()
        //this.callAPI()

    }
    componentWillReceiveProps(props) {
        this.setState({
            parameter: props.match.params.type,
        }, async () => {
            this.callbApi()
            // this.dataresult();
        })
    }

    dispatchChange(date) {
        this.setState({
            dispatchDate: date
        });
    }

    etaChange(date) {
        this.setState({
            etaDate: date
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

    show(data) {
        console.log('onclic', data)
        var today = new Date().toDateString();
        var currdate = new Date(this.state.apidate).toDateString();

        console.log(today,currdate)
        if(today == currdate){
            this.setState({
                visible: true,
                currentprod: data.Record.part_no,
                ackinventory_id:data.Key
            });
        }else{
            alert("Sorry You can't Edit the details")
        }
    }

    hide() {
        this.setState({ 
            visible: false,
            ackinventory_id:'',
        });
    }
    showvendormodal(row) {
        var today = new Date().toDateString();
        var currdate = new Date(this.state.apidate).toDateString();
        console.log('show vendor', row)
        if(today == currdate){
            this.setState({
                vendorpopup: true,
                inventory_id: row.Key
            });
        }else{
            alert("Sorry You can't Edit the details")
        }
    }
    hidevendormodal() {
        this.setState({
            vendorpopup: false,
            inventory_id: ''
        });

    }

    UpdateAknowledgement() {
        //alert(this.state.currentprod)
        var currentarray = this.state.data;
        for (var i in currentarray) {
            if (currentarray[i].Part_No == this.state.currentprod) {
                currentarray[i].Aknowledge = 'yes';
                break; //Stop this loop, we found it!
            }
        }
        this.setState({ visible: false });
        this.dataresult();
    }

    callbApi() {

        var data = {
            'colVal': this.state.userdetails.user_id,
            'date': this.state.apidate
        }
        console.log('userdeatils in vendor details', this.state.userdetails);

        fetch('/getUserData', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('Vendor details BlocchainData', responseData)
                if (responseData.code == 200) {
                    this.setState({
                        data: responseData.user_data
                    }, () => {
                        this.dataresult();
                    });
                } else {

                }
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
                this.callbApi()
            })
        } else if (selectedOption.value == 2) {
            finaldate = "Yesterday " + (date - 1) + "/" + month + "/" + year
            this.setState({
                currentdate: finaldate,
                apidate: today.setDate(today.getDate() - 1)
            }, () => {
                this.callbApi()
            })
        }else if(selectedOption.value ==3){
            this.showdatepicker();
        }
        //alert(JSON.stringify(selectedOption));
        this.setState({ selectedOption });
    };

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
        }
        else if (this.state.parameter == "pos") {
            this.setState({
                head: 'POS List'

            })
        } else if (this.state.parameter == "today") {
            this.setState({
                head: "Today's List"
            })

        }
        // this.setState({
        //     criticaldata:this.state.data.filter(o=>o.Record.criticalty ==="Critical")
        // })
        // this.setState({
        //     Aknowledgedata:this.state.data.filter(o=>o.Record.acknowledgement_details.acknowledgement_status ==="No")
        // })
        this.setState({
            pos: this.state.data.map(item => item.Record.part_no)
                .filter((value, index, self) => self.indexOf(value) === index).length
        })
        console.log(this.state.pos)
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        //  var data={
        //     'userId':this.state.user_id,
        //     'name':this.state.user_name,
        //     'email':this.state.user_email,
        //     'userType':this.state.userType
        // }

        var data = {
            'inventoryId': this.state.inventory_id,
            'quantity': this.state.qty,
            'vehicleNumber': this.state.vehicleNo,
            'date': this.state.dispatchDate,
            'eta': this.state.etaDate,
            'driverName': this.state.drivername,
            'driverContactNo':this.state.drivercontact,
            'stockAtSuplierEnd': this.state.suplierqty,
            'supplierRemark': this.state.remark,
            'escalationRemark': this.state.escalationremark,
            'escalationStatus': this.state.isescalate,
            'escalationDoneBy': this.state.userdetails.user_id
        }

        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if(this.state.drivercontact.match(phoneno))
             {
               return true;      
             }
       else
         {
           alert("Not a valid Phone Number");
           return false;
         }

        console.log('data', JSON.stringify(data))

        fetch('/updateEscalationDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == 200) {
                    alert('Details Added Successfully');
                    this.hidevendormodal();
                    this.setState({
                        qty:'',
                        vehicleNo:'',
                        drivername:'',
                        drivercontact:'',
                        drivercontact:'',
                        suplierqty:'',
                        remark:'',
                        escalationremark:'',
                        isescalate:'',

                    })
                } else {
                    alert('Something Went wrong');
                    this.hidevendormodal();
                }
            });

    }

    onFormAckSubmit = (e) => {
        e.preventDefault();
        var data = {
            'inventoryId': this.state.ackinventory_id,
            'status':'Yes',
            'doneBy':this.state.userdetails.user_id,
            'remark': '',
        }

        console.log('Form_ack', JSON.stringify(data))

        fetch('/updateAcknowledgementDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == 200) {
                    alert('Acknowledged Successfully');
                    this.hide();
                    this.callbApi()
                    
                } else {
                    alert('Something Went wrong');
                }
            });

    }

    showposdata() {
        alert("")
    }


    render() {
        const columns = [
            {
                dataField: 'Record.purchase_order',
                text: 'PO No',
                sort: true
            },
            {
                dataField: 'Record.part_no',
                text: 'Part No',
                sort: true
            },
            {
                dataField: 'Record.date',
                text: 'Date',
                sort: true,
            },
            {
                dataField: 'Record.part_description',
                text: 'Part Description',
                sort: true,
            },
            {
                dataField: 'Record.uom',
                text: 'UOM',
                sort: true,
            },
            {
                dataField: 'Record.max_stock',
                text: 'Max Stock',
                sort: true,
            },
            {
                dataField: 'Record.min_stock',
                text: 'Min Stock',
                sort: true,
            },
            {
                dataField: 'Record.opening_stock',
                text: 'Opening Stock',
                sort: true,
            },
            {
                dataField: 'Record.consumption_per_day',
                text: 'Cons/Day',
                sort: true,
            },
            {
                dataField: 'Record.consumption_per_3d',
                text: 'Cons/3Days',
                sort: true,
            },
            {
                dataField: 'Record.to_supply',
                text: 'Quantity',
                sort: true,
            },
            {
                dataField: 'Record.criticalty',
                text: 'Criticality',
                sort: true,
            },
            {
                dataField: 'Record.acknowledgement_details.acknowledgement_status',
                isDummyField: false,
                align: 'center',
                text: 'Aknowledgement',
                formatter: (cellContent, row) => {
                    console.log('row details',row,cellContent)
                    if (cellContent == "") {
                        return (
                            <div className="d-block w-100 text-center">
                                <Button className="mb-2 mr-2 btn-icon btn-icon-only" color="white" onClick={this.show.bind(this,row)}>
                                    <FontAwesomeIcon color="red" icon={faTimes} />
                                </Button>

                            </div>
                        );
                    } else {
                        return (
                            <div className="d-block w-100 text-center">
                                <span className="pr-2 opacity-6">
                                    <FontAwesomeIcon color="green" icon={faCheck} />
                                </span>
                            </div>
                        );
                    }

                }
            },
            {
                dataField: 'Record.remark',
                text: 'Remark',
                sort: true,
            },
            {
                dataField: 'actions',
                isDummyField: true,
                align: 'center',
                text: 'Actions',
                formatter: (cellContent, row) => {
                    console.log('Actions',row)
                    if (row.Record.to_supply != row.Record.dispatch_details.dispatched_quantity) {
                        return (
                            <div>
                                <div className="d-block w-100 text-center">
                                    <Button className="mb-2 mr-2 btn-icon btn-icon-only" color="white" onClick={this.showvendormodal.bind(this, row)}>
                                        <i className="pe-7s-edit btn-icon-wrapper"> </i>
                                    </Button>
                                </div>
                            </div>
                        );
                    }else
                    {
                        return (
                        <div>
                                <div className="d-block w-100 text-center">
                                    Dispached
                                </div>
                        </div>
                        );
                    }
                },
            }

        ];

        const defaultSorted = [{
            dataField: 'name',
            order: 'desc'
        }];
        const { selectedOption } = this.state;
        console.log(this.state.head)
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
                    <Rodal visible={this.state.visible}
                        onClose={this.hide.bind(this)}
                        showMask={false}
                    >
                        <ModalHeader>Aknowledgement Product With Part No {this.state.currentprod}</ModalHeader>
                        <ModalBody>
                        <Form onSubmit={this.onFormAckSubmit}>
                        {/*<FormGroup>
                                                    <Label>Reaon</Label>
                                                    <Input type="text" name="ackreason" id="ackreason"
                                                        value={this.state.ackreason}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                ackreason: e.target.value
                                                            })
                                                        }}
                                                    />
                                                </FormGroup>*/}
                        <Button color="link" onClick={this.hide.bind(this)}>Cancel</Button>
                        <Button color="primary" className="mt-1">Submit</Button>
                        </Form>
                        </ModalBody>
                        {/* <ModalFooter>
                            <Button color="link" onClick={this.hide.bind(this)}>Cancel</Button>
                            <Button color="primary" onClick={this.UpdateAknowledgement.bind(this)}>Yes</Button>
                        </ModalFooter> */}
                    </Rodal>
                    <Rodal visible={this.state.vendorpopup}
                        onClose={this.hidevendormodal.bind(this)}
                        showMask={false}
                    >
                        <ModalHeader>Please Update the Details</ModalHeader>
                        <ModalBody>
                        <div className="scroll-areas-lg">
                            <PerfectScrollbar>
                            <Container fluid>
                                <Row>
                                    <Col md="12">
                                        <Card className="main-card">
                                            <CardBody>

                                                <Form ref={e=> this.formInput = e} onSubmit={this.onFormSubmit}>
                                                    <FormGroup>
                                                        <Label for="exampleEmail">Dispached Qty</Label>
                                                        <Input type="text" name="distpatchqty" id="distpatchqty" required
                                                            value={this.state.qty}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    qty: e.target.value
                                                                })
                                                            }}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="examplePassword">Dispatched Date</Label>
                                                        <DatePicker
                                                            selected={this.state.dispatchDate}
                                                            onChange={this.dispatchChange.bind(this)}
                                                            showTimeSelect
                                                            className="form-control"
                                                            timeFormat="HH:mm"
                                                            timeIntervals={30}
                                                            dateFormat="Pp"
                                                            timeCaption="Time"
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="examplePassword">ETA</Label>
                                                        <DatePicker
                                                            selected={this.state.etaDate}
                                                            onChange={this.etaChange.bind(this)}
                                                            showTimeSelect
                                                            className="form-control"
                                                            timeFormat="HH:mm"
                                                            timeIntervals={30}
                                                            dateFormat="Pp"
                                                            timeCaption="Time"
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="exampleText">Vehicle No</Label>
                                                        <Input type="text" name="text" id="Vehicle No" required 
                                                            value={this.state.vehicleNo}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    vehicleNo: e.target.value
                                                                })
                                                            }}

                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="exampleText">Driver Name</Label>
                                                        <Input type="text" name="text" id="Vehicle No" required
                                                            value={this.state.drivername}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    drivername: e.target.value
                                                                })
                                                            }}

                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="exampleText">Driver Contact</Label>
                                                        <Input type="number" name="text" id="Vehicle No" required pattern="^[2-9]{2}[0-9]{8}$"
                                                            value={this.state.drivercontact}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    drivercontact: e.target.value
                                                                })
                                                            }}

                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="exampleText">Stock At Suplier End</Label>
                                                        <Input type="text" name="text" id="Supplier Qty"
                                                            value={this.state.suplierqty}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    suplierqty: e.target.value
                                                                })
                                                            }}

                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="exampleText">Supplier Remark</Label>
                                                        <Input type="textarea" name="text" id="remark"
                                                            value={this.state.remark}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    remark: e.target.value
                                                                })
                                                            }}

                                                        />
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={5}>Escalate any Query ?</Label>
                                                        <Col sm={2} style={{ marginTop: '1%' }}>
                                                            <Input type="radio" name="radio2"
                                                                value="Yes"
                                                                checked={this.state.isescalate === 'Yes'}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        isescalate: e.target.value
                                                                    })
                                                                }}
                                                            />
                                                            Yes
                                        </Col>
                                                        <Col sm={2} style={{ marginTop: '1%' }}>
                                                            <Input type="radio" name="radio2"
                                                                value="No"
                                                                checked={this.state.isescalate === 'No'}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        isescalate: e.target.value
                                                                    })
                                                                }}

                                                            />
                                                            No

                                          </Col>

                                                    </FormGroup>
                                                    {this.state.isescalate == "Yes" && <FormGroup>
                                                        <Label for="exampleText">Escalation By Supplier</Label>
                                                        <Input type="textarea" name="text" id="escalation"
                                                            value={this.state.escalationremark}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    escalationremark: e.target.value
                                                                })
                                                            }}
                                                        />
                                                    </FormGroup>}
                                                    <Button color="primary" className="mt-1">Submit</Button>
                                                    <Button color="link" className="mt-1" onClick={this.hidevendormodal.bind(this)}>Cancel</Button>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                           
                            </PerfectScrollbar>
                            </div>
                        </ModalBody>
                    </Rodal>
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
