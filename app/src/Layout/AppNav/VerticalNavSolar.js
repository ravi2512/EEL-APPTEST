import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';

import MetisMenu from 'react-metismenu';

import { SolarMainNav, SolarVendorNav ,StoreMainNav} from './SolarNavItems';

class SolarNav extends Component {

    constructor() {
        super();

        this.state = {
            usertype:'',
        }
    }

    componentDidMount() {
        this.getuser();

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

    render() {
        return (
            <Fragment>
                <h5 className="app-sidebar__heading">Menu</h5>
               {this.state.usertype =='Admin' ? 
                    <MetisMenu content={SolarMainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                    :
                    this.state.usertype =='Vendor' ?
                      <MetisMenu content={SolarVendorNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                      :
                      <MetisMenu content={StoreMainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                    
                }
                
            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

export default withRouter(SolarNav);