import React, {Fragment} from 'react';

import Ionicon from 'react-ionicons';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
    DropdownToggle, DropdownMenu,
    Nav, Col, Row, Button, NavItem, NavLink,
    UncontrolledTooltip, UncontrolledButtonDropdown
} from 'reactstrap';

import {
    toast,
    Bounce
} from 'react-toastify';


import {
    faAngleDown,

} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg';
import avatar1 from '../../../assets/utils/images/avatars/vendor.png';

class UserBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            loginuser:{},
        };

    }

    componentDidMount() {
         this.setState({
            loginuser: JSON.parse(localStorage.getItem('user_data'))
        })
      }
     callAPI() {
     //this.state.data.length = 0;
        fetch('/getdata')
          .then(res => res.json())
            .then(res => this.setState({
                data:res.filter(d => d.Vendor === "ABC"),
            }));
  }

    notify2 = () => this.toastId = toast("You don't have any new items in your calendar for today! Go out and play!", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'bottom-center',
        type: 'success'
    });

    logout(){
        localStorage.removeItem('user_data');
         window.location="#/";
    }


    render() {

        return (
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            <div className="widget-content-left">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="p-0">
                                        <img width={42} className="rounded-circle" src={avatar1} alt=""/>
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                        <div className="dropdown-menu-header">
                                            <div className="dropdown-menu-header-inner bg-info">
                                                <div className="menu-header-image opacity-2"
                                                     style={{
                                                         backgroundImage: 'url(' + city3 + ')'
                                                     }}
                                                />
                                                <div className="menu-header-content text-left">
                                                    <div className="widget-content p-0">
                                                        <div className="widget-content-wrapper">
                                                            <div className="widget-content-left mr-3">
                                                                <img width={42} className="rounded-circle" src={avatar1}
                                                                     alt=""/>
                                                            </div>
                                                            <div className="widget-content-left">
                                                                <div className="widget-heading">
                                                                    {this.state.loginuser ? this.state.loginuser.name : ''}
                                                                </div>
                                                                {/*<div className="widget-subheading opacity-8">
                                                                                                                                    A short profile description
                                                                                                                                </div>*/}
                                                            </div>
                                                            <div className="widget-content-right mr-2">
                                                                <Button className="btn-pill btn-shadow btn-shine"
                                                                        color="focus" onClick={this.logout.bind(this)}>
                                                                    Logout
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                            <div className="widget-content-left  ml-3 header-user-info">
                                <div className="widget-heading">
                                    {this.state.loginuser ? this.state.loginuser.name : ''}
                                </div>
                                {/*<div className="widget-subheading">
                                                                    VP People Manager
                                                                </div>*/}
                            </div>

                            {/*<div className="widget-content-right header-user-info ml-3">
                                                            <Button className="btn-shadow p-1" size="sm" onClick={this.notify2} color="info"
                                                                    id="Tooltip-1">
                                                                <Ionicon color="#ffffff" fontSize="20px" icon="ios-calendar-outline"/>
                                                            </Button>
                                                            <UncontrolledTooltip placement="bottom" target={'Tooltip-1'}>
                                                                Click for Toastify Notifications!
                                                            </UncontrolledTooltip>
                                                        </div>*/}
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default UserBox;