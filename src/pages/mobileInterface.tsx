import ModalComponent from "./components/modal"
import styles from "@/styles/MobileInterface.module.scss"
import React from "react"

interface Props {
    resetFilters: Function,
    setFiltersOpen: Function,
    filtersActive: boolean,
    filtersOpen: boolean
}

const MobileInterface = (props: Props) => {
    return (
    <div>
        {/* <div className={styles.mobileTitle}>
            Shipwrecks<span>.pro</span>
		</div> */}
        <div className={styles.mobileNavPanel}>
            <div className={styles.mobileToolsButtons}>
                <div className={styles.mobileButton}>
                    <img src="search-icon.svg" alt="" />
                    <div>Search</div>
                </div>
                <div className={styles.mobileButton} onClick={() => props.setFiltersOpen(!props.filtersOpen)}>
                    <img src="filter-icon.svg" alt="" />
                    <div>Filter</div>
                </div>
                <div className={styles.mobileButton} style={{pointerEvents: props.filtersActive ? 'auto' : 'none', opacity: props.filtersActive ? '1' : '.5'}} onClick={() => props.resetFilters()}>
                    <img src="reset-icon.svg" alt="" />
                    <div>Reset</div>
                    <div>open - {props.filtersOpen.toString()}</div>
                </div>
            </div>
        </div>
        <div className={props.filtersOpen ? styles.filterModalVisible : styles.filterModalHidden}>
            <div className={styles.mobileTitle}>
            Shipwrecks<span>.pro</span>
		    </div>
            <ModalComponent>
                <div>Test</div>
            </ModalComponent>
        </div>
    </div>
    )
}

export default MobileInterface