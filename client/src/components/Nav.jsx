import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Nav() {
    const [userStatus, setUserStatus] = useState(false)

    useEffect( () => {
        async function checkIfLoggedIn() {
            const response = await fetch('/api/getuser')
            const data = await response.json()
            
            if (data?.data?.email) {
                setUserStatus(true)
            } else {
                setUserStatus(false)
            }
        }

        checkIfLoggedIn();

    },[userStatus])

    async function logout() {
        const res = await fetch('/api/logout', {
            method: "POST"
        })

        const data = await res.json();

        if (data.data.status === 'SUCCESS') {
            alert('Logout Successful!')
            setUserStatus(false)
            window.location.replace('/login')
        }
        
    }

    return (
        <div className="nav-background">
            <div className="nav-container">
                <h1>To Do List</h1>
                <nav>
                    <Link to='/'>Home</Link>
                    <Link to='/profile'>Profile</Link>
                    {userStatus===true ?
                    <button onClick={logout}>Logout</button> :
                    <button onClick={ () => window.location.replace('/login')}>Login</button>
                    }
                </nav>
            </div>
        </div>
    )
}