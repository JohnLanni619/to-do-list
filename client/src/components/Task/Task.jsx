import styles from './Task.module.css';

async function handleCheck(e) {
    const parent = e.target.parentNode;
    const taskId = parent.getAttribute('data-attr-tid');

    let isCompleted

    if(e.target.checked === true) {
        isCompleted = true
    } else if (e.target.checked === false) {
        isCompleted = false
    }

    const post_data = {
        taskId,
        isCompleted
    }
  
    const response = await fetch('/api/updatetask', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post_data)
    })

    const responseData = await response.json()
    console.log(responseData)    
}

export default function Task({taskData}) {
    return (
        <>
            {taskData.map(task => {
                return (
                    <>
                        <p key={task._id} data-attr-tid={task._id} className={styles.task}>
                            <input 
                                onChange={event => handleCheck(event)} 
                                type="checkbox" name="is-completed" id="task-status"
                                defaultChecked={task.isCompleted}
                            />
                            {task.taskContent}
                        </p>
                        <hr />
                    </>
                    
                )
            })} 
        </>
    )

}