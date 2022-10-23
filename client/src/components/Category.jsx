import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faClipboardList,
  faTimesCircle,
  faCheck,  
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Notification from './Notification/Notification'
import Task from './Task/Task'

export default function Category () {
  const [userCategories, setUserCategories] = useState([])
  const [userInput, setUserInput] = useState('')
  const [errorText, setErrorText] = useState('')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationContent, setNotificationContent] = useState('')
  const [categoryId, setCategoryId] = useState('');
  const taskInput = useRef();

  useEffect(() => {
    // get userID from cookies
    async function getCategories () {
      const res = await fetch('/api/getcategories')
      const data = await res.json()

      setUserCategories(data.data)
    }
    getCategories()

  }, [userCategories.length])

  function sendNotification (title, content) {
    setNotificationTitle(title)
    setNotificationContent(content)

    const notificationCard = document.getElementById('notification-card')
    notificationCard.style.marginLeft = '6rem'

    let timer

    const startTimer = function () {
      clearTimeout(timer)
      timer = setTimeout(
        () => (notificationCard.style.marginLeft = '-1000px'),
        4000
      )
    }

    startTimer()
  }

  // create function that takes previous array and adds object at the end
  function setArray (prevArray, object) {
    return [...prevArray, object]
  }

  async function handleCategorySubmit (e) {
    e.preventDefault()

    setErrorText('')

    const data = {
      userInput
    }

    if (userInput.length > 0) {
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
      // Close modal
      const modal = document.getElementById('add-form')
      modal.close()
      setUserInput('')
    } else {
      setErrorText('Input field cannot be empty')

      let timer

      const startTimer = function () {
        clearTimeout(timer)
        timer = setTimeout(() => setErrorText(''), 4000)
      }

      startTimer()
    }
  }

  async function handleTaskSubmit (e) {
    e.preventDefault()

    const taskContent = taskInput.current.value;
    const categoryId = e.target.getAttribute('data-attr-cid')

    const post_data = {
      taskContent,
      categoryId
    }

    const response = await fetch('/api/createtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data)
    })

    const responseData = await response.json();
    const { taskId } = responseData;
    
    // Pushing dummy to userCategories to change length and trigger a re-render
    setUserCategories(setArray(userCategories, 're-render'))

    // Clear form and close modal on submit
    taskInput.current.value = '';
    const modal = document.getElementById('add-task')
    modal.close()

  }

  async function handleDelete (e) {
    e.preventDefault()
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

    const filtered = userCategories.filter(function (value, index, arr) {
      if (value._id !== newData.categoryId) {
        return value
      }
    })

    setUserCategories(filtered)

    sendNotification(newData.title, newData.body)
  }

  function showModal () {
    const modal = document.getElementById('add-form')
    modal.showModal()
  }

  return (
    <>
      <div className='content-container'>
        {userCategories.length === 0 && (
          <h1>Click Add Category button to get started!</h1>
        )}
        <button className='category-button' onClick={showModal}>
          Add Category
        </button>
        <dialog id='add-form'>
          <button
            className='modal-close-button'
            onClick={() => {
              const modal = document.getElementById('add-form')
              modal.close()
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <form className='add-form'>
            <div>
              <FontAwesomeIcon className='modal-icon' icon={faClipboardList} />
              <h2>New Category</h2>
            </div>
            <div>
              <label htmlFor='category'>Category Name </label>
              <input
                id='category-input'
                type='text'
                onChange={e => setUserInput(e.target.value)}
              />
            </div>
            <p className='modal-error-message'>{errorText}</p>
            <div>
              <button
                className='add-button'
                type='submit'
                onClick={e => handleCategorySubmit(e)}
              >
                Submit
              </button>
            </div>
          </form>
        </dialog>
        <section className='container'>
          <dialog id='add-task'>
            <button
              className='modal-close-button'
              onClick={() => {
                const modal = document.getElementById('add-task')
                modal.close()
              }}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
            <form className='add-task-form'>
              <div>
                <FontAwesomeIcon className='modal-icon' icon={faCheck} />
                <h2>New Task</h2>
              </div>
              <div>
                <textarea
                  name='task'
                  id='task-input'
                  placeholder='enter task information here'
                  ref={taskInput}
                  cols='40'
                  rows='5'
                ></textarea>
              </div>
              <p className='modal-error-message'>{errorText}</p>
              <div>
                <button
                  className='add-button'
                  type='submit'
                  data-attr-cid={categoryId}
                  data-attr-index={'hi'}
                  onClick={e => handleTaskSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </form>
          </dialog>
          {userCategories.map(category => {
            return (
              <div className='column' key={category._id}>
                <button
                  className='delete-button'
                  type='submit'
                  onClick={e => handleDelete(e)}
                  data-key={category._id}
                >
                  <FontAwesomeIcon className='delete-icon' icon={faXmark} />
                </button>
                <div>
                  <h2>{category.categoryName}</h2>
                </div>
                <button
                    className=' /*task-button*/ add-task-button'
                    data-attr-cid={category._id}
                    onClick={(e) => {
                      taskInput.current.value='';
                      const modal = document.getElementById('add-task')
                      modal.showModal()
                      setCategoryId(e.target.getAttribute('data-attr-cid'))
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <div className='task-container'>
                  {category.tasks?.length > 0 ? <Task taskData={category?.tasks}/> : <h3>Click on plus button to add a task!</h3>}
                </div>
              </div>
            )
          })}
        </section>
      </div>
      <Notification title={notificationTitle} content={notificationContent} />
    </>
  )
}
