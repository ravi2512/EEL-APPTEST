import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Col, Card, CardBody,
    CardTitle, Button, Form, FormGroup, Label, Input, FormText, Container
} from 'reactstrap';
import  { Redirect } from 'react-router-dom'

export default class UserAdd extends React.Component {
    constructor() {
        super();
        this.state = {
          user_email: '',
          user_id:'',
          user_name:'',
          userType:'Vendor',
          fieldname:'',
          headingname:'',
          parameter:'',
        }
}

 componentDidMount() {
        this.setState({
            parameter:this.props.match.params.type,
        }, () => {
            this.dataresult()
        });
        
  }
  componentWillReceiveProps(props){
    this.setState({
            parameter:props.match.params.type,
        }, () => {
            this.dataresult()
        })
  }

  dataresult(){

        if(this.state.parameter =="siil"){
            this.setState({
                userType:'Vendor',
                fieldname:"Vendor",
                headingname:'Vendor'

            })
        }else if(this.state.parameter =="store"){
            this.setState({
                userType:'Store',
                fieldname:"Employee",
                headingname:'Store'

            })  
        }
    }

    onFormSubmit = (e) => {
        e.preventDefault();
         var data={
            'userId':this.state.user_id,
            'name':this.state.user_name,
            'email':this.state.user_email,
            'userType':this.state.userType
        }

        //console.log('data',JSON.stringify(data))
        
        fetch('/createuser', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
        }).then((response) => response.json())
        .then((responseData) => {
        if(responseData.code == 200){
            alert('User Added Successfully');
              window.location='#/solar/Admin/'
        }else{
            alert('Something Went wrong');
        }
    });
       
    }
    render() {
        return (
            <Fragment>
                    <Container fluid>
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>Add {this.state.headingname} User</CardTitle>
                                <Form onSubmit={this.onFormSubmit}>
                                    <FormGroup row>
                                        <Label for="exampleEmail" sm={2}>{this.state.fieldname} ID</Label>
                                        <Col sm={10}>
                                            <Input  type="text" name="userid" id="userid" placeholder="ID"
                                            value={ this.state.user_id }
                                            onChange={ (e) => {
                                                        this.setState({
                                                            user_id:e.target.value
                                                        })
                                            } }
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="exampleEmail" sm={2}>Name</Label>
                                        <Col sm={10}>
                                            <Input  type="text" name="username" id="username" placeholder="Name"
                                            value={ this.state.user_name }
                                            onChange={ (e) => {
                                                        this.setState({
                                                            user_name:e.target.value
                                                        })
                                            } }
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="exampleEmail" sm={2}>Email</Label>
                                        <Col sm={10}>
                                            <Input  type="email" name="useremail" id="useremail" placeholder="Email"
                                            value={ this.state.user_email }
                                            onChange={ (e) => {
                                                        this.setState({
                                                            user_email:e.target.value
                                                        })
                                                      } }
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup check row>
                                        <Col sm={{size: 10, offset: 2}}>
                                            <Button>Submit</Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Container>
            </Fragment>
        );
    }
}
