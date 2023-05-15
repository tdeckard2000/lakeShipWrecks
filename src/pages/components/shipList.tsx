import styles from '@/styles/ShipListComponent.module.scss'
import { Shipwreck } from '@/interfaces';
import { MutableRefObject, useEffect } from 'react';
import { removeHighlightedMapMarker, setHighlightedMapMarker } from '@/map';

interface Props {
    shipList: Shipwreck[];
    setShipSelectedId: Function;
    listHeight?: string;
    children?: any;
    shipSelectedId: number | undefined;
    filtersOpen: boolean;
    setFiltersOpen: Function;
    map: any
}


const ShipListComponent = (props: Props) => {
    
    useEffect(() => {
        //scroll selected item into view on list
        if(props.shipSelectedId !== undefined) {
            const listItem = document.getElementById(`item${props.shipSelectedId}`);
            if(itemIsInViewport(listItem)) {
                return;
            } else {
                if(!props.filtersOpen) {
                    listItem?.scrollIntoView({behavior: 'smooth'});
                }
            }
        }
    }, [props.shipSelectedId])
    
    const listItemClicked = (index: number) => {
        //if already selected, deselect
        if(index === props.shipSelectedId) {
            props.setShipSelectedId(undefined);
            removeHighlightedMapMarker(props.map);
        } else {
            //Otherwise, highlight
            const ship = props.shipList[index];
            props.setShipSelectedId(index);
            setHighlightedMapMarker(props.map, ship?.coordinates.longitude, ship?.coordinates.latitude);
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
            <div id={`item${index}`} key={index} className={[styles.listItem, index === props.shipSelectedId ? styles.highlighted : ''].join(' ')} onClick={() => listItemClicked(index)}>
                <div className={styles.shipName}>{ship.name} {ship.isMissing || !ship.coordinates.latitude || !ship.coordinates.longitude? <span style={{color: '#e18e8e'}}>Missing</span> : ""}</div>
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