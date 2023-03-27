import ModalComponent from "./components/modal";
import styles from "@/styles/MobileInterface.module.scss";
import React, { useState } from "react";
import FiltersComponent from "./components/filters";
import ShipListComponent from "./components/shipList";
import { Shipwreck } from "@/interfaces";

interface Props {
    setShipSelectedId: Function;
    shipSelectedId: number | undefined;
    resetFilters: Function;
    setFiltersOpen: Function;
    setSearchOpen: Function;
    setSettingsOpen: Function;
    filtersActive: boolean;
    filtersOpen: boolean;
    settingsOpen: boolean;
    searchOpen: boolean;
    shipList: Shipwreck[];
    handleFilterChange: Function;
    setFiltersActive: Function;
}

const MobileInterface = (props: Props) => {
    const [bottomModalOpen, setBottomModalOpen] = useState<boolean>(false);
    const [bottomModalTitle, setBottomModalTitle] = useState<string>('');
    const [listOpen, setListOpen] = useState<boolean>(false);
    const modalCloseClicked = () => {
        setBottomModalOpen(false);
        hideAllModalBodies();
    }
    const hideAllModalBodies = () => {
        props.setSearchOpen(false);
        props.setFiltersOpen(false);
        props.setSettingsOpen(false);
        setListOpen(false);
    }
    const toggleBottomModal = (modalName: 'search' | 'list' | 'filters' | 'settings') => {
        setBottomModalOpen(false);
        switch(modalName) {
            //timeouts allows modal content
            //to switch while off screen
            case 'search':
                if(!props.searchOpen){
                    setTimeout(()=> {
                        hideAllModalBodies();
                        setBottomModalTitle('Search');
                        props.setSearchOpen(true)
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    props.setSearchOpen(false);
                }
                break;
            //to switch while off screen
            case 'list':
                if(!listOpen){
                    setTimeout(()=> {
                        hideAllModalBodies();
                        setBottomModalTitle('List');
                        setListOpen(true)
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    setListOpen(false);
                }
                break;
            case 'filters':
                if(!props.filtersOpen){
                    setTimeout(()=> {
                        hideAllModalBodies();
                        setBottomModalTitle('Filters');
                        props.setFiltersOpen(true);
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    props.setFiltersOpen(false);
                }
                break;
            case 'settings':
                if(!props.settingsOpen){
                    setTimeout(()=> {
                        hideAllModalBodies();
                        setBottomModalTitle('Settings');
                        props.setSettingsOpen(true);
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    props.setSettingsOpen(false);
                }
                break;
            default :
            console.warn("unexpected bottomModal state")
        }
    }
    return (
    <div className={styles.body}>
        <div className={styles.title}>
            Shipwrecks<span>.pro</span>
		</div>
        <div className={styles.navPanel}>
            <div className={styles.toolsButtons}>
                <div className={[styles.button, props.searchOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('search')}>
                    <img src="search-icon.svg" alt="" />
                    <div>Search</div>
                </div>
                <div className={[styles.button, listOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('list')}>
                    <img src="list-icon.svg" alt="" />
                    <div>List</div>
                </div>
                <div className={[styles.button, props.filtersOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('filters')}>
                    <img src="filter-icon.svg" alt="" />
                    <div>Filters</div>
                </div>
                <div className={[styles.button, props.settingsOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('settings')}>
                    <img src="settings-icon.svg" alt="" />
                    <div>Settings</div>
                </div>
            </div>
        </div>
        <div className={ props.shipSelectedId === null ? styles.shipInfoModalHidden : styles.shipInfoModalVisible}>
            <ModalComponent
                borderRadius="0 0 12px 12px"
                height="150px"
                top="0px"
                left="0"
                width="100vw"
                closeButtonCallback={() => props.setShipSelectedId(null)}
            >
                <div>Ship ID <span style={{color: 'royalblue'}}>{props.shipSelectedId}</span></div>
                <div>Ship Name <span>{props.shipSelectedId !== undefined ? props.shipList[props.shipSelectedId].name : ''}</span></div>
                <div>Coordinates <span>{props.shipSelectedId !== undefined? props.shipList[props.shipSelectedId].coordinates.latitude?.toString() + " " + props.shipList[props.shipSelectedId].coordinates.longitude?.toString(): ''}</span></div>
            </ModalComponent>
        </div>
        <div className={bottomModalOpen ? styles.bottomModalVisible : styles.bottomModalHidden}>
            <ModalComponent
                borderRadius="12px 12px 0 0"
                height="400px" 
                width="100%" 
                bottom="0" 
                left="0" 
                top="unset" 
                title={bottomModalTitle}
                closeButtonCallback = {modalCloseClicked}
                >
                <div style={{display: props.searchOpen ? 'block' : 'none'}} className={styles.searchContainer}>
                    <div>Search --</div>
                </div>
                <div style={{display: listOpen ? 'block' : 'none'}} className={styles.listContainer}>
                    <ShipListComponent listHeight="345px" shipList={props.shipList}></ShipListComponent>
                </div>
                <div style={{display: props.filtersOpen ? 'block' : 'none'}} className={styles.filterContainer}>
                    <FiltersComponent 
                    formCallback={props.handleFilterChange} 
                    height="330px" 
                    resetButtonCallback={props.resetFilters}
                    setFiltersActive={props.setFiltersActive}
                    filtersActive={props.filtersActive}
                    ></FiltersComponent>
                </div>
                <div style={{display: props.settingsOpen ? 'block' : 'none'}} className={styles.settingsContainer}>
                    <div>Settings --</div>
                </div>
            </ModalComponent>
        </div>
    </div>
    )
}

export default MobileInterface