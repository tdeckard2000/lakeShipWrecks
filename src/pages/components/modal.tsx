import styles from '@/styles/ModalComponent.module.scss'

interface Props {
    title?: string;
    children?: any; //Inner HTML
    height?: string;
    hideCloseButton?: boolean;
    bottom?: string;
    left?: string;
    top?: string;
    width?: string;
    zIndex?: string;
    borderRadius?: string;
    closeButtonCallback?: Function;
}

const ModalComponent = (props: Props) => {
    
    return (
        <div className={styles.modalOuterContainer} style={{
            bottom: props.bottom,
            borderRadius: props.borderRadius,
            height: props.height, 
            left: props.left, 
            top: props.top, 
            width: props.width,
            zIndex: props.zIndex
            }}>
            <div className={styles.modalInnerContainer}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>{props.title}</div>
                    <div style={{opacity: props.hideCloseButton ? '0' : 'flex'}} 
                    className={styles.closeButton}
                    onClick={() => props.closeButtonCallback?  props.closeButtonCallback() : ''}
                    ><img src="close-icon.svg" alt="" /></div>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default ModalComponent;