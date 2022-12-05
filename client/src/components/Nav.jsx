import { Link } from "react-router-dom"

export default function Nav({ isLoggedIn }) {
    async function logout() {
        const res = await fetch('/api/logout', {
            method: "POST"
        })

        const data = await res.json();

        if (data.data.status === 'SUCCESS') {
            alert('Logout Successful!')
            window.location.replace('/')
        }
    }

    return (
        <div className="nav-background">
            <div className="nav-container">
                <h1>To Do List</h1>
                <nav>
                    {/* <Link to='/home'>Home</Link> */}
                    {/* <Link to='/profile'>Profile</Link> */}
                    {isLoggedIn===true ?
                    <button onClick={logout}>Logout</button> :
                    <button onClick={ () => window.location.replace('/')}>Login</button>
                    }
                </nav>
            </div>
        </div>
    )
}