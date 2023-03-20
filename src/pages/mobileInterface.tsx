import ModalComponent from "./components/modal"
import styles from "@/styles/MobileInterface.module.scss"
import React from "react"

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

    const toggleBottomModal = (modalName: 'search' | 'filters' | 'settings') => {
        switch(modalName) {
            case 'search':
                props.setSearchOpen(!props.searchOpen)
                props.setFiltersOpen(false);
                props.setSettingsOpen(false);
                break;
            case 'filters':
                props.setSearchOpen(false)
                props.setFiltersOpen(!props.filtersOpen);
                props.setSettingsOpen(false);
                break;
            case 'settings':
                props.setSearchOpen(false)
                props.setFiltersOpen(false);
                props.setSettingsOpen(!props.settingsOpen);
                break;
        }
    }

    return (
    <div className={styles.body}>
        <div className={styles.title}>
            Shipwrecks<span>.pro</span>
		</div>
        <div className={styles.navPanel}>
            <div className={styles.toolsButtons}>
                <div className={styles.button} onClick={() => toggleBottomModal('search')}>
                    <img src="search-icon.svg" alt="" />
                    <div>Search</div>
                </div>
                <div className={styles.button} onClick={() => toggleBottomModal('filters')}>
                    <img src="filter-icon.svg" alt="" />
                    <div>Filter</div>
                </div>
                <div className={styles.button} onClick={() => toggleBottomModal('settings')}>
                    <img src="settings-icon.svg" alt="" />
                    <div>Settings</div>
                </div>
            </div>
        </div>
        <div className={props.filtersOpen || props.settingsOpen || props.searchOpen ? styles.bottomModalVisible : styles.bottomModalHidden}>
            <ModalComponent>
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