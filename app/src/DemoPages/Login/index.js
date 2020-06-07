import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// USER PAGES

import SignIn from './SignIn/';

const UserLogin = ({match}) => (
    <Fragment>
        <div className="app-container">

            {/* User Pages */}

            <Route path={`${match.url}/signin`} component={SignIn}/>
        </div>
    </Fragment>
);

export default UserLogin;