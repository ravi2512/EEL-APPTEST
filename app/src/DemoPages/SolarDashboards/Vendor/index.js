import React, {Component, Fragment} from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import PageTitle from '../../../Layout/AppMain/PageTitle';

// import Tabs, {TabPane} from 'rc-tabs';
// import TabContent from 'rc-tabs/lib/SwipeableTabContent';
// import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

// Examples
import DataCards from './Components/analytics';
//import AnalyticsDashboard2 from './Examples/Variation2';
// import PopoversExample from "../../Components/TooltipsPopovers";

export default class AnalyticsDashboard extends Component {

    render() {
        return (
            <Fragment>
                <DataCards/>
            </Fragment>
        )
    }
}
