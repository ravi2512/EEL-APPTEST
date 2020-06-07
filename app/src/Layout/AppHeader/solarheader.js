import React, {Fragment} from 'react';
import cx from 'classnames';

import {connect} from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HeaderLogo from '../AppLogo';

import SearchBox from './Components/SearchBox';
import MegaMenu from './Components/MegaMenu';
import UserBox from './Components/UserBox';
import HeaderRightDrawer from "./Components/HeaderRightDrawer";

import HeaderDots from "./Components/HeaderDots";

class SolarHeader extends React.Component {

     constructor() {
        super();

        this.state = {
            userdetails:'',
            usertype:'',
            };

    }

    componentDidMount() {
        this.setState({
            userdetails: JSON.parse(localStorage.getItem('user_data'))
        }, () => {

            this.setState({
                usertype:this.state.userdetails.user_type
            });
        });  
     }

    render() {
        let {
            headerBackgroundColor,
            enableMobileMenuSmall,
            enableHeaderShadow
        } = this.props;
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    className={cx("app-header", headerBackgroundColor, {'header-shadow': enableHeaderShadow})}
                    transitionName="HeaderAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={1500}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <HeaderLogo/>

                    <div className={cx(
                        "app-header__content",
                        {'header-mobile-open': enableMobileMenuSmall},
                    )}>
                    <div style={{fontSize:18,fontWeight:'bold'}}>
                        {this.state.usertype} Dashboard
                    </div>
                        <div className="app-header-right">
                            
                            <UserBox/>
                            
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
    headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SolarHeader);