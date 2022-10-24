import styles from './Task.module.css';

const taskData = [
    {taskContent: 'test'},
    {taskContent: 'test again'}
]

export default function Task({taskData}) {
    return (
        <>
            {taskData.map(task => {
                return (
                    <>
                        <p key={task._id} className={styles.task}>{task.taskContent}</p>
                        <hr />
                    </>
                    
                )
            })} 
        </>
    )

}