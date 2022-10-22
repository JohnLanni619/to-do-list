import styles from './Notification.module.css'

export default function Notification({title, content}) {
    return (
        <>
            <div id='notification-card' className={`${styles['notification-card']}`}>
                <h3 className={styles['notification-title']}>{title}</h3>
                <p className="notification-body">{content}</p>
            </div>
        </>
    )
}