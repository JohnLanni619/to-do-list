import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
export default function Category () {
  const [userCategories, setUserCategories] = useState([])
  const [userInput, setUserInput] = useState('')

  useEffect(() => {
    // get userID from cookies
    async function getCategories () {
      const res = await fetch('/api/getcategories')
      const data = await res.json()

      setUserCategories(data.data)
    }
    getCategories()
  }, [userCategories.length])

  // create function that takes previous array and adds object at the end
  function setArray (prevArray, object) {
    return [...prevArray, object]
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const data = {
      userInput
    }

    const response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const newData = await response.json()

    // pushing new category to userCategories to trigger component rerender
    setUserCategories(setArray(userCategories, newData))

    // Clear input field
    const categoryInput = document.getElementById('category-input')
    categoryInput.value = ''
  }

  async function handleDelete(e) {
    e.preventDefault();
    // get category id
    const categoryId = e.target.getAttribute('data-key')
    console.log(categoryId)
    // make request to category-delete api

    // remove deleted category from userCategories to trigger re-render of component

  }

  if (userCategories.length > 0) {
    return (
      <>
        <form>
          <label htmlFor='category'>Please Enter Category Name</label>
          <input
            id='category-input'
            type='text'
            onChange={e => setUserInput(e.target.value)}
          />
          <button type='submit' onClick={e => handleSubmit(e)}>
            submit
          </button>
        </form>
        <section className='container'>
          {userCategories.map(category => {
            return (
              <div className='column' key={category._id}>
                <button className='delete-button' type='submit' onClick={ e => handleDelete(e) } data-key={category._id}>
                <FontAwesomeIcon className='delete-icon' icon={faXmark} />
                </button>
                <h2>{category.categoryName}</h2>
                <p>{category._id}</p>
              </div>
            )
          })}
        </section>
      </>
    )
  } else {
    return (
        <h1>Click Add Category button to get started!</h1>
    )
  }
}
