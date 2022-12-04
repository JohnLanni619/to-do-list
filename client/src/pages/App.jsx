import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Category from '../components/Category/Category'
import '../styles.css'

function App () {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)

  useEffect( () => {

    // check if user is logged in
    async function getUser() {
      const request = await fetch('api/getuser')
      const response = await request.json();
      if (response?.data?.email?.address.length > 0) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }

    getUser();
})
  return (
    <>
      <div className="layout">
        <Nav isLoggedIn={isLoggedIn} />
        <Category />
        <Footer />
      </div>
    </>
  )
}

export default App
