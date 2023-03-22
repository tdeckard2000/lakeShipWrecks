import styles from '@/styles/LoadingMessageComponent.module.scss'

export const LoadingMessageComponent = () => {
    return (
    <div className={styles.body}>
        <div className={styles.container}>
            Loading
            <div className={styles.loadWrap}>
                <div className={styles.load}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default LoadingMessageComponent;