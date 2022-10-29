import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList,
  faTimesCircle,
  faCheck,
  faEllipsisVertical,
  faTrash,
  faSquarePlus
} from '@fortawesome/free-solid-svg-icons'
import styles from './Category.module.css'
import Notification from '../Notification/Notification'
import Task from '../Task/Task'

export default function Category () {
  const [userCategories, setUserCategories] = useState([])
  const [userInput, setUserInput] = useState('')
  const [errorText, setErrorText] = useState('')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationContent, setNotificationContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [updateCategory, setUpdateCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const taskInput = useRef()

  useEffect(() => {
    setLoading(true);
    // get userID from cookies
    async function getCategories () {
      const res = await fetch('/api/getcategories')
      const data = await res.json()

      setUserCategories(data.data)

      setLoading(false)
    }
    getCategories()
  }, [updateCategory])

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

      // Updating state variable to trigger re-render of Category component
      if (updateCategory === 'true') {
        setUpdateCategory('very true')
      } else {
        setUpdateCategory('true')
      }

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

    console.log(e)

    const taskContent = taskInput.current.value
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

    const responseData = await response.json()

    // Changing state variable to trigger re-render of Category component
    if (updateCategory === 'true') {
      setUpdateCategory('very true')
    } else {
      setUpdateCategory('true')
    }

    // Clear form and close modal on submit
    taskInput.current.value = ''
    const modal = document.getElementById('add-task')
    modal.close()
  }

  function triggerRender () {
    if (updateCategory === 'true') {
      setUpdateCategory('very true')
    } else {
      setUpdateCategory('true')
    }
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
    triggerRender()
    sendNotification(newData.title, newData.body)
    // hide options container
    console.log(e.target.parentNode.classList.toggle('hidden'))
  }

  function showModal () {
    const modal = document.getElementById('add-form')
    modal.showModal()
  }

  function showOptions(e) {
    const optionsContainer = e.target.parentNode.nextElementSibling;

    optionsContainer.classList.toggle('hidden')

    const allOptionContainers = document.querySelectorAll(`[class*="_options_container"]`);
    allOptionContainers.forEach(container => {
      if (!container.classList.contains('hidden') && container !== optionsContainer) {
        container.classList.toggle('hidden')
      }
    })

  }

  return (
    <>
      <div className={`${styles['content-container']} ${styles.bubble}`}>
        {loading === false &&   userCategories.length === 0 &&  (
          <h1>Click Add Category button to get started!</h1>
        )}
        <button className='category-button' onClick={showModal}>
          Add Category
        </button>
        <dialog id='add-form'>
          <button
            className={styles['modal-close-button']}
            onClick={() => {
              const modal = document.getElementById('add-form')
              modal.close()
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <form className={styles['add-form']}>
            <div>
              <FontAwesomeIcon
                className={styles['modal-icon']}
                icon={faClipboardList}
              />
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
        <section className={styles.container}>
          <dialog id='add-task'>
            <button
              className={styles['modal-close-button']}
              onClick={() => {
                const modal = document.getElementById('add-task')
                modal.close()
              }}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
            <form className={styles['add-task-form']}>
              <div>
                <FontAwesomeIcon
                  className={styles['modal-icon']}
                  icon={faCheck}
                />
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
              <div className={styles.column} key={category._id}>
                <div className={styles.header}>
                  <h2>{category.categoryName}</h2>
                  <FontAwesomeIcon
                    className={styles.column_icon}
                    icon={faEllipsisVertical}
                    onClick={event => showOptions(event)}
                  />
                </div>
                <div className={`${styles.options_container} hidden`}>
                  <span
                    className={styles['add-task-button']}
                    data-attr-cid={category._id}
                    onClick={e => {
                      taskInput.current.value = ''
                      const modal = document.getElementById('add-task')
                      modal.showModal()
                      e.target.parentNode.classList.toggle('hidden')
                      setCategoryId(e.target.getAttribute('data-attr-cid'))
                    }}
                  >
                    <FontAwesomeIcon icon={faSquarePlus} /> Add
                  </span>
                  <span
                    className='delete-button'
                    type='submit'
                    onClick={e => handleDelete(e)}
                    data-key={category._id}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </span>
                </div>
                <div className={styles['task-container']}>
                  {category.tasks?.length > 0 ? (
                    <Task
                      taskData={category?.tasks}
                      categoryId={category?._id}
                      sendNotification={sendNotification}
                      triggerRender={triggerRender}
                    />
                  ) : (
                    <h3>Click on plus button to add a task!</h3>
                  )}
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
