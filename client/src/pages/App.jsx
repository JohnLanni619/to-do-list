import { useEffect } from 'react'
import Nav from '../components/Nav'
import Category from '../components/Category'
import '../styles.css'

// Where should button to add a category go?
// I want it to save the category to the database and then I want the category component to re-render

function App () {
  useEffect( () => {
        
    // Check if user is logged in.
    async function getUser() {
        const response = await fetch('/api/test')
        const data = await response.json();
        
        // If user is not logged in, redirect them to the login page
        if (!data?.data?.email) {
            window.location.replace('/login')
        }
    }

    // getUser();
})
  return (
    <>
      <Nav />
      <Category />
    </>
  )
}

export default App
