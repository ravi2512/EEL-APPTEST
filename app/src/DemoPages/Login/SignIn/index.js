import React, {Component,Fragment} from 'react';
import {Col, Row, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import  { Redirect } from 'react-router-dom'
import { isThisISOWeek } from 'date-fns';
// Layout

export default class SignIn extends Component {
    constructor() {
        super();

        this.state = {
			userid: '',
			passwordText:'',
		}
    }

    componentDidMount() {
        this.getuser();

    }

    getuser(){
        var userexist =  JSON.parse(localStorage.getItem('user_data'));
        if(userexist){
            if(userexist.user_type == "Admin"){
                return <Redirect to='/solar/Admin'  />
                // window.location="#/solar/Admin";
             }else if(userexist.user_type == "Vendor"){
                return <Redirect to='/solar/Vendor'  />
                //window.location="#/solar/Vendor";
            }
        }
    }

    authenticate(comp){

        var data={
            'user_id':this.state.userid,
            'password':this.state.passwordText
        }
        
        fetch('/login', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
        }).then((response) => response.json())
        .then((responseData) => {
        console.log(responseData)
        if(responseData.code == 200){
            localStorage.setItem('user_data', JSON.stringify(responseData.user_data));
            if(responseData.user_data.user_type == "Admin"){
                 window.location="#/solar/Admin";
             }else if(responseData.user_data.user_type == "Vendor"){
                window.location="#/solar/Vendor";
            }else if(responseData.user_data.user_type == "Store"){
                window.location="#/solar/Admin";
            }
        }else {
            alert(responseData.msg)
        }
      
      
    });
        
    }
    useridchange(value){
        this.setState({
            userid: value
       });
    }

    passwordchange(value){
        this.setState({
            passwordText: value
       });
    }

    render() {
        return(
            <Fragment>
            <div className="h-100 bg-plum-plate bg-animation">
                <div className="d-flex h-100 justify-content-center align-items-center">
                    <Col md="8" className="mx-auto app-login-box">
                        <div className="app-logo-inverse mx-auto mb-3"/>
    
                        <div className="modal-dialog w-100 mx-auto">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="h5 modal-title text-center">
                                        <h4 className="mt-2">
                                            <div>Economic Explosive Limited.</div>
                                            <span>Welcome Here, Please Enter Your Credential Details.</span>
                                        </h4>
                                    </div>
                                    <Form>
                                        <Row form>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Input type="text" name="email" id="exampleEmail"
                                                           placeholder="User ID" value={this.state.userid} onChange={e => this.useridchange(e.target.value)}/>
                                                </FormGroup>
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Input type="password" name="password" id="examplePassword"
                                                           placeholder="Password" value={this.state.passwordText} onChange={e => this.passwordchange(e.target.value)}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <FormGroup check>
                                            <Input type="checkbox" name="check" id="exampleCheck"/>
                                            <Label for="exampleCheck" check>Keep me logged in</Label>
                                        </FormGroup>
                                    </Form>
                                </div>
                                <div className="modal-footer clearfix">
                                    <div className="float-right">
                                        <Button color="primary" size="lg" onClick={this.authenticate.bind(this)}>Login</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-white opacity-8 mt-3">
                            Copyright &copy; SolarGroup 2020
                        </div>
                    </Col>
                </div>
            </div>
        </Fragment>
     
        )
    }
}

