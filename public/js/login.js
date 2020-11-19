/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';


const displayMsg = (status, msg, path, timer, reload) => {
    if (status === 'success') {
        showAlert('success', msg);
        window.setTimeout(() => {
            location.reload(reload);
            location.assign(path);
        }, timer);
    } else if (status === 'error') {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
};


export const login = async (email, password) => {
    //console.log(email, password);
    try {            
        const res = await axios({
            method: 'POST',
            //url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            displayMsg('success', 'Logged in successfully', '/', 600);
            // showAlert('success', 'Logged in successfully');
            // window.setTimeout(() => {
            //    location.assign('/')
            // }, 600);
        }
        //console.log(res);
    } catch (err) {
        displayMsg('error');
        // console.log(err);
        // showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            //url: 'http://127.0.0.1:3000/api/v1/users/logout',
            url: '/api/v1/users/logout',
        });

        if (res.data.status = 'success') {
            displayMsg('success', 'Logged out successfully', '/', 600, true);
            // showAlert('success', 'Logged out successfully');
            // window.setTimeout(() => {
            //     location.reload(true);
            //     location.assign('/');
            //  }, 600);
        }     
    } catch (err) {
        displayMsg('error');
        // console.log(err);
        // //showAlert('error', 'Error logging out! Try again.');
        // showAlert('error', err.response.data.message);
    }
}

export const signup = async (name, email, password, passwordConfirm) => {
    //console.log(email, password);
    try {            
        const res = await axios({
            method: 'POST',
            //url: 'http://127.0.0.1:3000/api/v1/users/signup',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            displayMsg('success', 'Signed up successfully', '/', 600, true);
            // showAlert('success', 'Signed up successfully');
            // window.setTimeout(() => {
            //    location.assign('/');
            // }, 600);
        }
        //console.log(res);
    } catch (err) {
        displayMsg('error');
        // console.log(err);
        // //console.log(err.response.data);
        // showAlert('error', err.response.data.message);
    }
};

export const forgotPassword = async (email) => {
    //console.log(email, password);
    try {            
        const res = await axios({
            method: 'POST',
            //url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
            url: '/api/v1/users/forgotPassword',
            data: {
                email,
            }
        });

        if (res.data.status === 'success') {
            displayMsg(
                'success', 'An email has been sent with password reset link!', '/login', 2500, true
            );
            // showAlert('success', 'An email has been sent with password reset link!');
            // window.setTimeout(() => {              
            //     location.reload(true);
            //     location.assign('/login');
            // }, 2500);
        }
        //console.log(res);
    } catch (err) {
        displayMsg('error');
        // console.log(err);
        // //console.log(err.response.data);
        // showAlert('error', err.response.data.message);
    }
};

export const resetPassword = async (password, passwordConfirm, token) => {
    //console.log(email, password);
    try {            
        const res = await axios({
            method: 'PATCH',
            //url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,
            url: `/api/v1/users/resetPassword/${token}`,
            data: {
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            displayMsg(
                'success', 'Password reset successfull!, Login with your new password!', 
                '/login', 1500, true
            );
            // showAlert('success', 'Password reset successfull!, Login with your new password!');
            // window.setTimeout(() => {              
            //     location.reload(true);
            //     location.assign('/login');
            // }, 1500);
        }
        //console.log(res);
    } catch (err) {
        displayMsg('error');
        // console.log(err);
        // //console.log(err.response.data);
        // showAlert('error', err.response.data.message);
    }
};