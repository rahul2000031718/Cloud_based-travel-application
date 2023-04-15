import React from 'react';
import { Container, Card,Form,Button, Col, Row } from 'react-bootstrap';
import axios from 'axios'
import urls from "./utils"
import {AmplifySignOut } from '@aws-amplify/ui-react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const auth = null; 
    
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
