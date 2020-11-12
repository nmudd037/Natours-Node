/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

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
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
               location.assign('/')
            }, 600);
        }
        //console.log(res);
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
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
            showAlert('success', 'Logged out successfully');
            location.reload(true);
            location.assign('/');
        }     
    } catch (err) {
        console.log(err);
        showAlert('error', 'Error logging out! Try again.');
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
            showAlert('success', 'Signed up successfully');
            window.setTimeout(() => {
               location.assign('/')
            }, 600);
        }
        //console.log(res);
    } catch (err) {
        console.log(err);
        //console.log(err.response.data);
        showAlert('error', err.response.data.message);
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
            showAlert('success', 'An email has been sent with password reset link!');
            window.setTimeout(() => {              
                location.reload(true);
                location.assign('/login');
            }, 2500);
        }
        //console.log(res);
    } catch (err) {
        console.log(err);
        //console.log(err.response.data);
        showAlert('error', err.response.data.message);
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
            showAlert('success', 'Password reset successfull!, Login with your new password!');
            window.setTimeout(() => {              
                location.reload(true);
                location.assign('/login');
            }, 1500);
        }
        //console.log(res);
    } catch (err) {
        console.log(err);
        //console.log(err.response.data);
        showAlert('error', err.response.data.message);
    }
};