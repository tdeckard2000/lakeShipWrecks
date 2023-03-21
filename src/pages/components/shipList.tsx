import styles from '@/styles/ShipListComponent.module.scss'
import { shipwreck } from '@/types';

interface Props {
    listHeight?: string;
    shipList: shipwreck[];
    children?: any;
}

const ShipListComponent = (props: Props) => {
    return (
    <div className={styles.listContainer} style={{height: props.listHeight}}>
        {props.shipList.map((ship, index) => (
            <div key={index} className={styles.listItem}>
                <div className={styles.shipName}>{ship.name}</div>
                <div className={styles.statsContainer}>
                    <div className={styles.shipStat}>
                        <img src="calendar-icon.svg" alt="" /> 
                        <div>{ship.dateSunk?.toString().substring(0, 4)}</div>
                    </div>
                    <div className={styles.shipStat}>
                        <img src="length-icon.svg" alt="" /> 
                        <div>{ship.stats.length}ft</div>
                    </div>
                    <div className={styles.shipStat}>
                        <img src="water-icon.svg" alt="" /> 
                        <div>{ship.stats.waterDepth}ft</div>
                    </div>
                </div>
            </div>
        ))}
        <div>{props.children}</div>
    </div>
    )
}

export default ShipListComponent;