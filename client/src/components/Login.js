import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <div className="background">
            {/* <div className="center"> */}
                <div className="login-container">
                    <h2>Login</h2>
                    <div className="input-container">
                        <label for='email'>Email Address</label>
                        <input name="email" type='email' placeholder={`Type your email`}></input>
                        <FaUserAlt className='icon' id='user-icon' />
                    </div>
                    <div className="input-container">
                        <label for='password'>Password</label>
                        <input name="password" type='password' placeholder="Type your password"></input>
                        <FaUserAlt className='icon' id='password-icon' />
                    </div>
                    <p>Forgot Password?</p>
                    <button type="submit">LOGIN</button>
                    <div>
                        <p>Don't have an account?</p>
                        <p> Click <Link to='/signup'>Here</Link> to signup</p>
                    </div>
                    
                </div>
            {/* </div> */}
        </div>
    )
}