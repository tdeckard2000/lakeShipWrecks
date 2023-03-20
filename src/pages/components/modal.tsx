import styles from '@/styles/ModalComponent.module.scss'

interface Props {
    title?: string;
    children?: any; //Inner HTML
    height?: string;
    bottom?: string;
    left?: string;
    top?: string;
    width?: string;
    zIndex?: string;
}

const ModalComponent = (props: Props) => {
    return (
        <div className={styles.modalOuterContainer} style={{
            bottom: props.bottom,
            height: props.height, 
            left: props.left, 
            top: props.top, 
            width: props.width,
            zIndex: props.zIndex
            }}>
            <div className={styles.modalInnerContainer}>
                <div className={styles.title}>{props.title}</div>
                {props.children}
            </div>
        </div>
    )
}

export default ModalComponent;