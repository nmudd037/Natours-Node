/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
//import isEmail from 'validator/lib/isEmail';
//import { AppError } from './../../utils/AppError';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        // if ((type === 'data') && !(isEmail(data.email))) {
        //     throw new Error('Please provide a valid email');
        //     //new AppError('Please provide a valid email', 400);
        // }
        
        // const url = 
        //     type === 'password' 
        //         ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        //         : 'http://127.0.0.1:3000/api/v1/users/updateMe';

        const url = 
        type === 'password' 
            ? '/api/v1/users/updateMyPassword'
            : '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            location.reload(true);
        }
        
    } catch (err) {
        showAlert('error', err.response.data.message);
        //console.log(err);
        //showAlert('error', type === 'password' ? err.response.data.message : err.message);
    }
};