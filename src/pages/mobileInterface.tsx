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
        <div className={styles.title}>
            Shipwrecks<span>.pro</span>
		</div>
        <div className={styles.navPanel}>
            <div className={styles.toolsButtons}>
                <div className={styles.button}>
                    <img src="search-icon.svg" alt="" />
                    <div>Search</div>
                </div>
                <div className={styles.button} onClick={() => props.setFiltersOpen(!props.filtersOpen)}>
                    <img src="filter-icon.svg" alt="" />
                    <div>Filter</div>
                </div>
                <div className={styles.button} style={{pointerEvents: props.filtersActive ? 'auto' : 'none', opacity: props.filtersActive ? '1' : '.5'}} onClick={() => props.resetFilters()}>
                    <img src="reset-icon.svg" alt="" />
                    <div>Reset</div>
                </div>
            </div>
        </div>
        <div className={props.filtersOpen ? styles.filterModalVisible : styles.filterModalHidden}>
            <ModalComponent>
                <div>Filter Component</div>
                <div>Goes Here</div>
                <div>: )</div>
            </ModalComponent>
        </div>
    </div>
    )
}

export default MobileInterface