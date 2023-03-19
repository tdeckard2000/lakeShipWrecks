import styles from '@/styles/ModalComponent.module.scss'

interface Props {
    title?: string,
    children?: any, //Inner HTML
    height?: string
    width?: string,
}

const ModalComponent = (props: Props) => {
    return (
        <div className={styles.modalBody}>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default ModalComponent;