import ModalComponent from "./components/modal"
import styles from "@/styles/MobileInterface.module.scss"
import React, { useState } from "react"

interface Props {
    resetFilters: Function;
    setFiltersOpen: Function;
    setSearchOpen: Function;
    setSettingsOpen: Function;
    filtersActive: boolean;
    filtersOpen: boolean;
    settingsOpen: boolean;
    searchOpen: boolean;
}

const MobileInterface = (props: Props) => {
    const [bottomModalOpen, setBottomModalOpen] = useState<boolean>(false);
    const [bottomModalTitle, setBottomModalTitle] = useState<string>('')
    const toggleBottomModal = (modalName: 'search' | 'filters' | 'settings') => {
        setBottomModalOpen(false);
        switch(modalName) {
            //timeouts allows modal content
            //to switch while off screen
            case 'search':
                if(!props.searchOpen){
                    setTimeout(()=> {
                        setBottomModalTitle('Search');
                        props.setSearchOpen(true)
                        props.setFiltersOpen(false);
                        props.setSettingsOpen(false);
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    props.setSearchOpen(false);
                }
                break;
            case 'filters':
                if(!props.filtersOpen){
                    setTimeout(()=> {
                        setBottomModalTitle('Filters');
                        props.setSearchOpen(false)
                        props.setFiltersOpen(true);
                        props.setSettingsOpen(false);
                        setBottomModalOpen(true);
                    }, 150)
                } else {
                    props.setFiltersOpen(false);
                }
                break;
            case 'settings':
                if(!props.settingsOpen){
                    setTimeout(()=> {
                        setBottomModalTitle('Settings');
                        props.setSearchOpen(false)
                        props.setFiltersOpen(false);
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
                <div className={[styles.button, props.filtersOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('filters')}>
                    <img src="filter-icon.svg" alt="" />
                    <div>Filter</div>
                </div>
                <div className={[styles.button, props.settingsOpen? styles.buttonSelected: ''].join(' ')} onClick={() => toggleBottomModal('settings')}>
                    <img src="settings-icon.svg" alt="" />
                    <div>Settings</div>
                </div>
            </div>
        </div>
        <div className={bottomModalOpen ? styles.bottomModalVisible : styles.bottomModalHidden}>
            <ModalComponent height="300px" width="100%" bottom="0" left="0" top="unset" title={bottomModalTitle}>
                <div style={{display: props.searchOpen ? 'block' : 'none'}} className={styles.searchContainer}>
                    <div>Search --</div>
                </div>
                <div style={{display: props.filtersOpen ? 'block' : 'none'}} className={styles.filterContainer}>
                    <div>Filter --</div>
                        <div>
                            <div className={styles.button} style={{pointerEvents: props.filtersActive ? 'auto' : 'none', opacity: props.filtersActive ? '1' : '.5'}} onClick={() => props.resetFilters()}>
                            <img src="reset-icon.svg" alt="" />
                            <div>Reset</div>
                        </div>
                    </div>
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