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
import Search from '../Search'

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
    setLoading(true)
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
      await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

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

    const taskContent = taskInput.current.value
    const categoryId = e.target.getAttribute('data-attr-cid')

    const post_data = {
      taskContent,
      categoryId
    }

    await fetch('/api/createtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data)
    })

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
  }

  function showModal () {
    const modal = document.getElementById('add-form')
    modal.showModal()
    const categoryInput = document.getElementById('category-input')
    categoryInput.focus()
  }

  function showOptions (e) {
    e.stopPropagation();
    const optionsContainer = e.target.parentNode.nextElementSibling
    
    window.addEventListener('click', () => {
      if (!optionsContainer.classList.contains('hidden')) {
        optionsContainer.classList.toggle('hidden')
      }
    }, {once: true})

    optionsContainer.classList.toggle('hidden')

    const allOptionContainers = document.querySelectorAll(
      `[class*="_options_container"]`
    )
    allOptionContainers.forEach(container => {
      if (
        !container.classList.contains('hidden') &&
        container !== optionsContainer
      ) {
        container.classList.toggle('hidden')
      }
    })
  }

  // Drag Event Start

  function dragEnter (e) {
    e.preventDefault()
    if (
      (e.target.nodeName === 'DIV' &&
      e.target.classList.contains('task')) 
      || (e.target.classList.contains('task-container'))
    ) {
      e.target.classList.add('drag-over')
    }
  }

  function dragOver (e) {
    e.preventDefault()

    if (
      e.target.nodeName === 'DIV' &&
      e.target.classList.contains('task-container')
    ) {
      e.target.classList.add('drag-over')
    }
  }

  function dragLeave (e) {
    e.target.classList.remove('drag-over')
  }

  async function drop (e) {
    e.target.classList.remove('drag-over')

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain')
    const draggable = document.getElementById(id)

    // only append if it's a div with a class of Task_task
    if (
      e.target.nodeName === 'DIV' &&
      e.target.classList.contains('task')
    ) {
      e.target.parentNode.insertBefore(draggable, e.target)
    }

    if (
      e.target.nodeName === 'DIV' &&
      e.target.classList.contains('task-container')
    ) {
      e.target.insertBefore(draggable, e.target.lastElementChild)
    }

    // display the draggable element
    draggable.classList.remove('hide')

    // Get category id
    const categoryContainer = draggable.parentNode
    const originalCategoryId = draggable.getAttribute('data-attr-cid')
    const destinationCategoryId = categoryContainer.getAttribute(
      'data-attr-cid'
    )
    const targetTaskId = draggable.getAttribute('id')

    // Get all task ids of category
    const taskIds = []
    categoryContainer.childNodes.forEach(task => {
      if (task.getAttribute('data-attr-tid') != null) {
        taskIds.push(task.getAttribute('data-attr-tid'))
      }
    })

    const post_data = {
      originalCategoryId,
      destinationCategoryId,
      targetTaskId,
      taskIds
    }

    // Make fetch request to endpoint to update current category's task list with new task order
    const response = await fetch('/api/updatecategory', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post_data)
    })

    await response.json();

    // change data-attr-cid to on draggable element to match parent container
    draggable.setAttribute('data-attr-cid', destinationCategoryId);

  }

  return (
    <>
      <div className={`${styles['content-container']} ${styles.bubble}`}>
        {loading === false && userCategories.length === 0 && (
          <h1>Click Add Category button to get started!</h1>
        )}
        <div className={styles['main-options-container']}>
          <Search />
          <button className='category-button' onClick={showModal}>
            Add Category
          </button>
        </div>
        
        <dialog id='add-form' className={styles['add-form-modal']}>
          <form className={styles['add-form']}>
            <div className={styles['form-header']}>
              <FontAwesomeIcon
                className={styles['modal-icon']}
                icon={faClipboardList}
              />
              <h2>New Category</h2>
              <button
            className={styles['modal-close-button']}
            onClick={() => {
              const modal = document.getElementById('add-form')
              modal.close()
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
            </div>
            <div className='label-container'>
              <label htmlFor='category'>Category Name </label>
              <input
                id='category-input'
                type='text'
                className='form-input'
                onChange={e => setUserInput(e.target.value)}
              />
            </div>
            <p className='modal-error-message'>{errorText}</p>
            <div className={styles['form-footer']}>
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
        <section 
          className={styles.container}
          id='category-container'
        >
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
              <div className={styles['add-task-header']}>
                <FontAwesomeIcon
                  className={styles['modal-icon']}
                  icon={faCheck}
                />
                <h2>New Task</h2>
              </div>
              <div className={styles['add-task-content']}>
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
                  <button 
                    className={styles.column_button}
                    onClick={event => showOptions(event)}
                  >
                    <FontAwesomeIcon
                      className={styles.column_icon}
                      icon={faEllipsisVertical}
                    />
                  </button>
                </div>
                <div 
                  className={`${styles.options_container} hidden`}
                >
                  <button
                    className='delete-button'
                    type='submit'
                    onClick={e => handleDelete(e)}
                    data-key={category._id}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
                <div
                  className={`${styles['task-container']} task-container`}
                  onDragEnter={event => dragEnter(event)}
                  onDragOver={event => dragOver(event)}
                  onDragLeave={event => dragLeave(event)}
                  onDrop={event => drop(event)}
                  data-attr-cid={category?._id}
                >
                  <Task
                    taskData={category?.tasks}
                    categoryId={category?._id}
                    sendNotification={sendNotification}
                    triggerRender={triggerRender}
                  />
                  <button
                    className={styles['add-task-button']}
                    data-attr-cid={category._id}
                    onClick={e => {
                      taskInput.current.value = ''
                      const modal = document.getElementById('add-task')
                      modal.showModal()
                      setCategoryId(e.target.getAttribute('data-attr-cid'))
                      // focus on textarea
                      const textArea = document.getElementById('task-input');
                      textArea.focus();
                    }}
                    draggable="false"
                  >
                    <FontAwesomeIcon icon={faSquarePlus} />
                  </button>
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
