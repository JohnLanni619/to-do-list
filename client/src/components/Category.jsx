import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Category () {
  const [userCategories, setUserCategories] = useState([])
  const [userInput, setUserInput] = useState('')
  const [buttonText, setButtonText] = useState('Add Category')

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

    const data = {
      categoryId
    }

    // make request to category-delete api
    const response = await fetch('/api/deletecategory', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const newData = await response.json()

    const filtered = userCategories.filter(function(value, index, arr) {
      if (value._id != newData.categoryId) {
        return value
      }
    })

    setUserCategories(filtered)

    alert(newData.status)

  }

  function toggleAddForm() {
    const addForm = document.getElementById('add-form')
    addForm.classList.toggle('hidden')

    if (addForm.classList.contains('hidden')) {
      setButtonText('Add Category')
    } else {
      setButtonText('-')
    }

  }

  if (userCategories.length > 0) {
    return (
      <div className='content-container'>
        <div className='form-container'>
          <button onClick={toggleAddForm}>{buttonText}</button>
          <form id='add-form' className='add-form hidden'>
            <label htmlFor='category'>Please Enter Category Name:</label>
            <input
              id='category-input'
              type='text'
              onChange={e => setUserInput(e.target.value)}
            />
            <button type='submit' onClick={e => handleSubmit(e)}>
              Submit
            </button>
          </form>
        </div>
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
      </div>
    )
  } else {
    return (
      <div className='content-container'>
        <h1>Click Add Category button to get started!</h1>

        <div className='form-container'>
          <button onClick={toggleAddForm}>{buttonText}</button>
          <form id='add-form' className='add-form hidden'>
            <label htmlFor='category'>Please Enter Category Name:</label>
            <input
              id='category-input'
              type='text'
              onChange={e => setUserInput(e.target.value)}
            />
            <button type='submit' onClick={e => handleSubmit(e)}>
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }
}
