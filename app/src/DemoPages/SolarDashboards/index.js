import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// DASHBOARDS
import VendorDashboard from './Vendor';
import VendorDetails from './VendorDetails';
import AdminDashboard from './Admin';
import AdminDetails from './AdminDetails';
import AddUser from './AddUser';
import WeeklyReport from './WeeklyPlan';
import AdminPlan from './AdminPlan';
import  CriticalAnalysis  from  './criticalAnalysis'
import VendorCriticalAnalysis from './VendorCriticalAnaylysis'
import CriticalBreakDown from './CriticalBreakDown'
import Dispatchdetail from './DispatchDetails'
import Escalationdetail from './EscalationDetails'

// Layout

import AppHeader from '../../Layout/AppHeader/solarheader';
import AppSidebar from '../../Layout/AppSidebar/solarsidebar';
import AppFooter from '../../Layout/AppFooter';

// Theme Options
//import ThemeOptions from '../../Layout/ThemeOptions/';

const SolarDashboards = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                   <Route path={`${match.url}/vendor`} component={VendorDashboard}/>
                   <Route path={`${match.url}/details/:type`} component={VendorDetails}/>
                   <Route path={`${match.url}/admin`} component={AdminDashboard}/>
                   <Route path={`${match.url}/admindetails/:type`} component={AdminDetails}/>
                   <Route path={`${match.url}/adduser/:type`} component={AddUser}/>
                   <Route path={`${match.url}/weeklyplan`} component={WeeklyReport}/>
                   <Route path={`${match.url}/allweeklyplan`} component={AdminPlan}/>
                   <Route path={`${match.url}/criticalanalysis`} component={CriticalAnalysis}/>
                   <Route path={`${match.url}/vendorcriticalanalysis`} component={VendorCriticalAnalysis}/>
                   <Route path={`${match.url}/criticalbreakdown/:type`} component={CriticalBreakDown}/>
                   <Route path={`${match.url}/dispatchdetail`} component={Dispatchdetail}/>
                   <Route path={`${match.url}/escalationdetail`} component={Escalationdetail}/>
                </div>
            </div>
        </div>
    </Fragment>
);

export default SolarDashboards;