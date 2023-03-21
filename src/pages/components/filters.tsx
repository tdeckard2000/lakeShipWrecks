import { ShipwreckFilters } from '@/interfaces';
import styles from '@/styles/FiltersComponent.module.scss'
import { useEffect, useState } from 'react';

interface Props {
    children?: any;
    labelFontSize?: string;
    inputFontSize?: string;
    resetButtonCallback?: Function;
    height?: string;
    formCallback: Function;
    setFiltersActive: Function;
    filtersActive: boolean;
}

const FiltersComponent = (props: Props) => {
    const filtersActive = true; //more needed
    
    const [form, setForm] = useState<ShipwreckFilters>
    ({
        hideOffscreen: true,
        wreckDepthMin: 0,
        wreckDepthMax: 0,
        sinkYearMin: 0,
        sinkYearMax: 0,
        weightMin: 0,
        weightMax: 0,
        shipLengthMin: 0,
        shipLengthMax: 0,
        listMissingShips: false,
        sortBy: 'name'
    });
    
    const handleChange = async (event: any) => {
        props.setFiltersActive(true);
        setForm({
            ...form,
            [event.target.id]: event.target.value
        });
    };
    
    useEffect(() => {
        props.formCallback(form);
    }, [form])
    
    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.warn("--- filter submit ---")
    }

    useEffect(() => {
        setForm(
            {
                hideOffscreen: true,
                wreckDepthMin: 0,
                wreckDepthMax: 0,
                sinkYearMin: 0,
                sinkYearMax: 0,
                weightMin: 0,
                weightMax: 0,
                shipLengthMin: 0,
                shipLengthMax: 0,
                listMissingShips: false,
                sortBy: 'name'
            })
    }, [props.filtersActive])

    return (
    <div className={styles.filterBody} style={{height: props.height}}>
        <div>{props.children}</div>
        <form onSubmit={handleSubmit}>
            <div className='styles.filtersContainer'>
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Sort By</span>
                    {/* <input placeholder='name' type="reset" value={form.wreckDepthMin} onChange={handleChange} id='sortBy'/> */}
                    <select name="" value={form.sortBy} onChange={handleChange} id="sortBy">
                        <option value="name">name</option>
                        <option value="depth">depth</option>
                        <option value="yearSank">Year Sank</option>
                    </select>
                </div>
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
                    <input max={9999} inputMode="numeric" placeholder='any' type="number" value={form.shipLengthMax} onChange={handleChange} id='shipLengthMax'/>
                </div>
                <hr />
                {/* <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>List Missing Ships</span>
                    <input max={9999} inputMode="numeric" placeholder='any' type="checkbox" checked={form.listMissingShips} value={form.listMissingShips ? 1 : 0 } onChange={handleChange} id='shipIsMissing'/>
                </div> */}
                {/* <hr />
                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Hide Offscreen Shipwrecks</span>
                    <input type="checkbox" checked={form.hideOffscreen} value={form.hideOffscreen ? 1 : 0} onChange={handleChange} name="" id="hideOffscreen" />
                </div> */}
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