import styles from '@/styles/ShipListComponent.module.scss'
import { Shipwreck } from '@/interfaces';
import { useEffect } from 'react';

interface Props {
    shipList: Shipwreck[];
    setShipSelectedId: Function;
    listHeight?: string;
    children?: any;
    shipSelectedId: number | undefined;
    setFiltersOpen: Function;
}


const ShipListComponent = (props: Props) => {
    
    useEffect(() => {
        //scroll selected item into view on list
        if(props.shipSelectedId !== undefined) {
            const listItem = document.getElementById(`item${props.shipSelectedId}`);
            if(itemIsInViewport(listItem)) {
                return;
            } else {
                props.setFiltersOpen(false);
                listItem?.scrollIntoView({behavior: 'smooth'});
                console.log("new ", listItem)
            }
        }
    }, [props.shipSelectedId])
    
    const listItemClicked = (props: Props, index: number) => {
        if(index === props.shipSelectedId) {
            props.setShipSelectedId(undefined);
        } else {
            props.setShipSelectedId(index);
        }
    };

    const itemIsInViewport = (element: any) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 200 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight - 80 || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      };

    return (
    <div className={styles.listContainer} style={{height: props.listHeight}}>
        {props.shipList ? props.shipList.map((ship, index) => (
            <div id={`item${index}`} key={index} className={[styles.listItem, index === props.shipSelectedId ? styles.highlighted : ''].join(' ')} onClick={() => listItemClicked(props, index)}>
                <div className={styles.shipName}>{ship.name}</div>
                <div className={styles.statsContainer}>
                    <div className={styles.shipStat}>
                        <img src="calendar-icon.svg" alt="" /> 
                        <div>{ship.dateSunk ? ship.dateSunk.toString().substring(0, 4) : '?'}</div>
                    </div>
                    <div className={styles.shipStat}>
                        <img src="length-icon.svg" alt="" /> 
                        <div>{ship.stats.length ? Math.trunc(ship.stats.length) : '?'} ft</div>
                    </div>
                    <div className={styles.shipStat}>
                        <img src="water-icon.svg" alt="" /> 
                        <div>{ship.stats.waterDepth != null ? Math.trunc(ship.stats.waterDepth) : '?'} ft</div>
                    </div>
                </div>
            </div>
        )) : ''}
        <div>{props.children}</div>
    </div>
    )
}

export default ShipListComponent;