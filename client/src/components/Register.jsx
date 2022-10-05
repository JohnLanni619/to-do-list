import { useState } from 'react'
import { FaUserAlt, FaLock } from 'react-icons/fa'

function checkPasswords (e) {
  const errorContainer = document.getElementById('password-error')
  const success = document.querySelectorAll('.success')

  if (e.target.value.length < 8) {
    errorContainer.textContent =
      'Password must be at least 8 characters in length'
    if (!success[1].classList.contains('hidden')) {
      success[1].classList.toggle('hidden')
    }
  } else {
    errorContainer.textContent = ''
    if (success[1].classList.contains('hidden')) {
      success[1].classList.toggle('hidden')
    }
  }
}

export default function Register () {
  const [passwordValid, setPasswordValid] = useState('false')
  const [emailValid, setEmailValid] = useState('false')

  function validatePassword (e) {
    const errorContainer = document.getElementById('confirm-error')
    const password = document.getElementById('password').value
    const confirmPassword = e.target.value
    const success = document.querySelectorAll('.success')

    if (password === confirmPassword && e.target.value.length >= 8) {
      if (success[2].classList.contains('hidden')) {
        success[2].classList.toggle('hidden')
      }
      errorContainer.textContent = ''
      if (passwordValid === 'false') {
        setPasswordValid('true')
      }
    } else {
      errorContainer.textContent = 'Password do not match'
      if (!success[2].classList.contains('hidden')) {
        success[2].classList.toggle('hidden')
      }
      if (passwordValid === 'true') {
        setPasswordValid('false')
      }
    }
  }

  async function handleSubmit (e) {
    console.log(e)
    e.preventDefault()
    if (passwordValid === 'true' && emailValid === 'true') {
      // target password field
      const password = document.getElementById('register-password').value
      const email = document.getElementById('register-email').value

      try {
        const values = {
            email,
            password
        }

        console.log('values',values)

        await fetch('/api/register', {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-type": "application/json; charset=UTF-8"}
        })
        
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('invalid')
    }
  }

  function validateEmail (e) {
    // const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    const success = document.querySelectorAll('.success')
    const errorMessage = document.getElementById('email-error')

    if (e.target.value.match(format)) {
      errorMessage.textContent = ''
      if (success[0].classList.contains('hidden')) {
        success[0].classList.toggle('hidden')
      }
      if (emailValid === 'false') {
        setEmailValid('true')
      }
    } else {
      // hide green checkmark if it's showing
      if (!success[0].classList.contains('hidden')) {
        success[0].classList.toggle('hidden')
      }
      if (emailValid === 'true') {
        setEmailValid('false')
      }
      errorMessage.textContent = 'Please enter a valid email address'
    }
  }

  return (
    <dialog id='register-modal'>
      <h2>Register</h2>
      <form className='register-form'>
        <div className='input-field'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            onBlur={event => validateEmail(event)}
            id='register-email'
            name='email'
            placeholder='Type in your email'
          />
          <FaUserAlt className='icon' id='password-icon' />
          <p className='success hidden' id='success'>
            ✓
          </p>
          <p className='error-message' id='email-error'></p>
        </div>
        <div className='input-field'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            onBlur={event => checkPasswords(event)}
            minLength={8}
            placeholder='Type in your password'
          />
          <FaLock className='icon' id='password-icon' />
          <p className='success hidden' id='success'>
            ✓
          </p>
          <p className='error-message' id='password-error'></p>
        </div>
        <div className='input-field'>
          <label htmlFor='password-confirm'>Re-enter Password</label>
          <input
            type='password'
            minLength={8}
            onBlur={event => validatePassword(event)}
            id='register-password'
            name='password-confirm'
            placeholder='Passwords must match'
          />
          <FaLock className='icon' id='password-icon' />
          <p className='success hidden' id='success'>
            ✓
          </p>
          <p className='error-message' id='confirm-error'></p>
        </div>
        <button onClick={event => handleSubmit(event)}>REGISTER</button>
        <div className='password-requirements'>
          <h4>Password Requirements</h4>
          <ul>
            <li>Password must contain at least 8 characters</li>
            <li>Can be any combination of letters, symbols, and numbers</li>
            <li>Both password fields must match</li>
          </ul>
        </div>
      </form>
    </dialog>
  )
}
