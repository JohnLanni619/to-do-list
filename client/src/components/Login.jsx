import { FaUserAlt, FaLock } from 'react-icons/fa';
import Register from './Register';

function openModal() {
    const modal = document.getElementById('register-modal')
    modal.showModal()
}

export default function Login() {
    return (
        <div className="background">
                <div className="login-container">
                    <h2>Login</h2>
                    <div className="input-container">
                        <label htmlFor='email'>Email Address</label>
                        <input name="email" type='email' placeholder={`Type your email`}></input>
                        <FaUserAlt className='icon' id='user-icon' />
                    </div>
                    <div className="input-container">
                        <label htmlFor='password'>Password</label>
                        <input name="password" type='password' placeholder="Type your password"></input>
                        <FaLock className='icon' id='password-icon' />
                    </div>
                    <p>Forgot Password?</p>
                    <button type="submit">LOGIN</button>
                    <div>
                        <p>Don't have an account?</p>
                        <p> Click <b className='modal-link' onClick={openModal}>Here</b> to signup</p>
                    </div>
                </div>
                <Register />
        </div>
    )
}