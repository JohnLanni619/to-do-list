import { useEffect } from 'react'
import Nav from '../components/Nav'
import Category from '../components/Category/Category'
import '../styles.css'

function App () {

  useEffect( () => {
        
    // Check if user is logged in.
    /* async function getUser() {
        const response = await fetch('/api/test')
        const data = await response.json();
        
        // If user is not logged in, redirect them to the login page
        if (!data?.data?.email) {
            window.location.replace('/login')
        }
    }

    getUser(); */
})
  return (
    <>
      <Nav />
      <Category />
    </>
  )
}

export default App
