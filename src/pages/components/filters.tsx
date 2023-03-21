import { shipwreckFilters } from '@/interfaces';
import styles from '@/styles/FiltersComponent.module.scss'
import { useState } from 'react';

interface Props {
    children?: any;
    labelFontSize?: string;
    inputFontSize?: string;
    resetButtonCallback?: Function;
    height?:string;
}

const FiltersComponent = (props: Props) => {
    const filtersActive = true; //more needed
    const [form, setForm] = useState<shipwreckFilters>
    ({
        hideOffscreen: true,
        wreckDepthMin: 0,
        wreckDepthMax: 36201,
        sinkYearMin: 0,
        sinkYearMax: new Date().getFullYear(),
        weightMin: 0,
        weightMax: 403342,
        shipLengthMin: 0,
        shipLengthMax: 1504,
        shipIsMissing: false
    });
    const handleChange = (event: any) => {
        console.log("eventID: ", event.target.id)
        console.log("eventValue: ", event.target.value)
        setForm({
            ...form,
            [event.target.id]: event.target.value
        })
    };
    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log("--- submit ---")
    }

    return (
    <div className={styles.filterBody} style={{height: props.height}}>
        <div>{props.children}</div>
        <form onSubmit={handleSubmit}>
            <div className='styles.filtersContainer'>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Hide Offscreen Shipwrecks</span>
                    <input type="checkbox" checked={form.hideOffscreen} value={form.hideOffscreen ? 1 : 0} onChange={handleChange} name="" id="hideOffscreen" />
                </div>
                <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Wreck Depth Min (ft)</span>
                    <input max={99999} inputMode="numeric" placeholder='any' type="number" value={form.wreckDepthMin} onChange={handleChange} id='wreckDepthMin'/>
                </div>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Wreck Depth Max (ft)</span>
                    <input max={99999} inputMode="numeric" placeholder='any' type="number" value={form.wreckDepthMax} onChange={handleChange} id='wreckDepthMax'/>
                </div>
                <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Sink Year Min</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.sinkYearMin} onChange={handleChange} id='sinkYearMin'/>
                </div>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Sink Year Max</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.sinkYearMax} onChange={handleChange} id='sinkYearMax'/>
                </div>
                <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Weight Min (gt)</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.weightMin} onChange={handleChange} id='weightMin'/>
                </div>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Weight Max (gt)</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.weightMax} onChange={handleChange} id='weightMax'/>
                </div>
                <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Ship Length Min (ft)</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.shipLengthMin} onChange={handleChange} id='shipLengthMin'/>
                </div>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Ship Length Max (ft)</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.wreckDepthMin} onChange={handleChange} id='shipLengthMax'/>
                </div>
                <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Ship is Missing</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="checkbox" checked={form.shipIsMissing} value={form.shipIsMissing ? 1 : 0 } onChange={handleChange} id='shipIsMissing'/>
                </div>
            </div>
        </form>
        <div className={styles.resetButton} 
            style={{pointerEvents: filtersActive ? 'auto' : 'none', opacity: filtersActive ? '1' : '.5'}} 
            onClick={() => props.resetButtonCallback ? props.resetButtonCallback() : ''}>
            <img src="reset-icon.svg" alt="" />
        </div>
    </div>
    )
}

export default FiltersComponent