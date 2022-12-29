import styles from './Task.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEllipsisVertical,
    faPencil,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

// Add in animation or some type of pop up that happens when you complete a task

export default function Task({taskData, categoryId, sendNotification, triggerRender}) {
    async function handleCheck(e) {
        const parent = e.target.parentNode;
        const taskId = parent.getAttribute('data-attr-tid');
        const taskContent = e.target.nextElementSibling.textContent;
    
        let isCompleted
    
        if(e.target.checked === true) {
            isCompleted = true
        } else if (e.target.checked === false) {
            isCompleted = false
        }
    
        const post_data = {
            taskId,
            isCompleted,
            taskContent
        }
      
        await fetch('/api/updatetask', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        }) 
    }
    
    function showOptions(e) {
        e.stopPropagation()
        const optionsContainer = e.target.nextElementSibling;

        window.addEventListener('click', () => {
            if (!optionsContainer.classList.contains('hidden')) {
              optionsContainer.classList.toggle('hidden')
            }
          }, {once: true})
        
        optionsContainer.classList.toggle('hidden');
    
        const otherContainers = document.querySelectorAll(`[class*="_options_container"]`)
        otherContainers.forEach(container => {
            if (!container.classList.contains('hidden') && container !== optionsContainer) {
                container.classList.toggle('hidden');
            }
        })
    
    }
    
    function handleEdit(e) {
        const editField = e.target.parentNode.previousElementSibling.previousElementSibling;
        editField.setAttribute("contenteditable","true")
        if (editField.style.pointerEvents === 'none') {
            editField.style.pointerEvents = 'all';
            editField.style.cursor = 'text';
        }
        editField.parentNode.setAttribute('draggable', 'false')
        editField.focus()
    }
    
    async function handleFocusLoss(e) {
        const checkbox = e.target.previousElementSibling;
    
        let isCompleted;
    
        if(checkbox.checked === true) {
            isCompleted = true
        } else if (checkbox.checked === false) {
            isCompleted = false
        }
    
        if (e.target.getAttribute('contenteditable') === "true") {
            // Set attribute equal to false
            e.target.setAttribute('contenteditable', "false")
            
            // If the task is not empty, save change to database
            if (e.target.textContent.length > 0) {
                const taskContent = e.target.textContent;
                // get taskID
                const taskId = e.target.parentNode.getAttribute('data-attr-tid');
    
                const post_data = {
                    taskContent,taskId,isCompleted
                }
    
                await fetch('/api/updatetask', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(post_data)
                }) 
            }
        }

        // make parent div draggable again
        e.target.parentNode.setAttribute('draggable', 'true')
        e.target.style.pointerEvents = 'none';
    
    }
    
    async function handleDelete(e) {
        e.preventDefault();
    
        const taskContainer = e.target.parentNode.parentNode;
        
        const taskId = taskContainer.getAttribute('data-attr-tid');
        const categoryId = taskContainer.getAttribute('data-attr-cid');
    
        const post_data = {
            taskId, categoryId
        }
    
        const response = await fetch('/api/deletetask', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        })

        const deletedTask = await response.json();

        triggerRender()

        sendNotification(deletedTask.title, deletedTask.body)
    }

    function handleMouseEnter() {
        const addButtons = document.querySelectorAll(`[class*="Category_add-task-button"]`)
        addButtons.forEach( button => {
            const style = getComputedStyle(button);

            if (style.opacity !== 0) {
                button.style.opacity = 0;
            }

        })

    }

    function handleMouseLeave() {
        const addButtons = document.querySelectorAll(`[class*="Category_add-task-button"]`)
        addButtons.forEach( button => {
            if (button.getAttribute('style')) {
                button.removeAttribute('style');
            }

        })

    }

    function dragStart (e) {
        e.dataTransfer.setData('text/plain', e.target.id)
        setTimeout(() => {
          e.target.classList.add('hide')
        }, 0)
    }

    function dragEnd(e) {
        if (e.target.classList.contains('hide')) {
            e.target.classList.toggle('hide')
        }
    }

    return (
        <>
            {taskData.map( task => {
                return (
                    <>
                        <div 
                            key={task._id} 
                            data-attr-tid={task._id}
                            data-attr-cid={categoryId}
                            className={`${styles.task} task`}
                            draggable = "true"
                            onDragStart={event => dragStart(event)}
                            onDragEnd={event => dragEnd(event)}
                            id={task._id}
                        >
                            <input 
                                onChange={event => handleCheck(event)} 
                                type="checkbox" name="is-completed" id="task-status"
                                defaultChecked={task.isCompleted}
                                draggable = "false"
                            />
                            <p 
                                onBlur={event => handleFocusLoss(event)} 
                                draggable="false"
                                style={{pointerEvents:'none'}}
                            
                            >{task.taskContent}</p>
                            <button 
                                className={styles.task_button}
                                onClick={event => showOptions(event)}
                                draggable="false"
                            >
                                <FontAwesomeIcon 
                                    className={styles.task_icon} 
                                    icon={faEllipsisVertical}
                                    draggable="false"
                                />
                            </button>
                            <div 
                                draggable = "false"
                                className={`${styles.options_container} hidden`}
                                onMouseOver={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className='edit-button' onClick={event => handleEdit(event)}> <FontAwesomeIcon icon={faPencil} /> Edit </button>
                                <button className='delete-button' onClick={event => handleDelete(event)}> <FontAwesomeIcon icon={faTrash} /> Delete </button>
                            </div>
                        </div>
                            {/* <hr draggable="false" /> */}


                    </>
                )
            })} 
        </>
    )

}