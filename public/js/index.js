/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, signup, logout, forgotPassword, resetPassword } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

//DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');


//DELEGATION
if (mapbox) {
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);    
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();    
        const name = document.getElementById('namesignup').value;
        const email = document.getElementById('emailsignup').value;
        const password = document.getElementById('passwordsignup').value;
        const passwordConfirm = document.getElementById('passwordConfirmsignup').value;
        signup(name, email, password, passwordConfirm);
    });
}

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', e => {
        e.preventDefault();    
        const email = document.getElementById('emailfp').value;
        forgotPassword(email);
    });
}

if (resetPasswordForm) {
    const token = window.location.pathname.split('/')[2];
    resetPasswordForm.addEventListener('submit', e => {
        e.preventDefault();    
        const password = document.getElementById('passwordrp').value;
        const passwordConfirm = document.getElementById('passwordConfirmrp').value;
        resetPassword(password, passwordConfirm, token);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        //console.log(form);

        updateSettings(form, 'data');
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        // updateSettings({ name, email }, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();  //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';        
    });
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        //const tourId = e.target.dataset.tourId;
        const { tourId } = e.target.dataset;
        bookTour(tourId); 
    });
}