import styles from '@/styles/FiltersComponent.module.scss'

interface Props {
    children?: any;
    labelFontSize?: string;
    inputFontSize?: string;
    resetButtonCallback?: Function;
    height?:string;
}

const FiltersComponent = (props: Props) => {
    const filtersActive = true; //more needed


    return (
    <div className={styles.filterBody} style={{height: props.height}}>
        <div>{props.children}</div>
        <div className='styles.filtersContainer'>
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Hide Offscreen Shipwrecks</span>
                <input type="checkbox" defaultChecked={true} name="" id="" />
            </div>
            <hr />
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Wreck Depth Min (ft)</span>
                <input max={99999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Wreck Depth Max (ft)</span>
                <input max={99999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <hr />
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Sink Year Min</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Sink Year Max</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <hr />
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Weight Min (gt)</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Weight Max (gt)</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <hr />
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Ship Length Min (ft)</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Ship Length Max (ft)</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="number" />
            </div>
            <hr />
            <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Ship is Missing</span>
                <input max={9999} inputMode="numeric" placeholder='any' type="checkbox" />
            </div>
        </div>
        <div className={styles.resetButton} 
            style={{pointerEvents: filtersActive ? 'auto' : 'none', opacity: filtersActive ? '1' : '.5'}} 
            onClick={() => props.resetButtonCallback ? props.resetButtonCallback() : ''}>
            <img src="reset-icon.svg" alt="" />
        </div>
    </div>
    )
}

export default FiltersComponent