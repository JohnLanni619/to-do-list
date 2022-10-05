import { FaUserAlt, FaLock } from 'react-icons/fa';
import Register from '../components/Register';
import { useEffect } from 'react';

function openModal() {
    const modal = document.getElementById('register-modal')
    modal.showModal()
}

async function handleSubmit(e) {
    e.preventDefault();
    const errorMessage= document.getElementById('error')
    
    errorMessage.textContent = '';

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const values = {email,password}

    try {
        await fetch('/api/authorize', {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-type": "application/json; charset=UTF-8"}
        }).then( response => {
            if (response.status === 200) {
                window.location.replace(response.url)
            }

            if (response.status === 400) {
                errorMessage.textContent = 'Email and password combination are not correct'
            }
        })

    } catch (error) {
        console.error(error)
    }
}

export default function Login() {
    useEffect( () => {
        
        // Check if user is logged in.
        async function getUser() {
            const response = await fetch('/api/getuser')
            const data = await response.json();
            
            // If user is logged in, redirect them to the home page
            if (data?.data?.email) {
                window.location.replace('/')
            }
        }

        getUser();
    })

    return (
        <div className="background">
                <div className="login-container">
                    <h2>Login</h2>
                    <div className="input-container">
                        <label htmlFor='email'>Email Address</label>
                        <input name="email" id='login-email' type='email' placeholder={`Type your email`}></input>
                        <FaUserAlt className='icon' id='user-icon' />
                    </div>
                    <div className="input-container">
                        <label htmlFor='password'>Password</label>
                        <input name="password" id='login-password' type='password' placeholder="Type your password"></input>
                        <FaLock className='icon' id='password-icon' />
                    </div>
                    <p>Forgot Password?</p>
                    <button type="submit" onClick={event => handleSubmit(event)}>LOGIN</button>
                    <p id="error" className='error'></p>
                    <div>
                        <p>Don't have an account?</p>
                        <p> Click <b className='modal-link' onClick={openModal}>Here</b> to signup</p>
                    </div>
                </div>
                <Register />
        </div>
    )
}