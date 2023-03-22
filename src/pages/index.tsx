// @ts-ignore
// import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { MapProperties, Shipwreck, ShipwreckFilters } from "@/interfaces";
import * as clientAPI from "@/clientAPI";
import MobileInterface from "./mobileInterface";
import FiltersComponent from "./components/filters";
import ShipListComponent from "./components/shipList";
import { initializeMap, updateMapMarkers } from "./components/map";
import { LoadingMessageComponent } from "./components/loadingMessage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [filtersActive, setFiltersActive] = useState<boolean>(false);
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
	const [searchOpen, setSearchOpen] = useState<boolean>(false);
	const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
	const [shipList, setShipList] = useState<Shipwreck[]>([]);
	const [mapProperties, setMapProperties] = useState<MapProperties>({lng: -85.15, lat: 44.5, zoom: 5.5})

	useEffect(() => {
		console.log("init page")
		initializePage();
	}, []);

	const initializePage = async () => {;
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		initializeMap(map, mapProperties, mapContainer, newShipList).then(() => {
			//@ts-ignore
			map.current.on("load", () => {
				setIsLoading(false);
			})
		})
	}

	const handleFilterChange = async (filterParams: ShipwreckFilters) => {
		if(!map.current) return
		console.log("filter change triggered")
		const newShipList = await clientAPI.getFilteredShipwrecks(filterParams);
		setShipList(newShipList);
		updateMapMarkers(map, newShipList);
	}

	const resetFilters = async () => {
		if(!map.current) return
		setFiltersActive(false);
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		updateMapMarkers(map, newShipList);
	}

	return (
		<>
			<Head>
				<title>Shipwrecks.pro</title>
				<meta name="description" content="Interactive Shipwreck Map" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div style={{display: isLoading? 'flex' : 'none'}}>
					<LoadingMessageComponent></LoadingMessageComponent>
				</div>
				<div className={styles.navigationPanel}>
					<div className={styles.titleHeader}>Shipwrecks<span style={{fontSize: '12px'}}>.pro</span></div>
					<div className={styles.navigationBody}>
						<div className={[styles.toolsContainer, filtersOpen ? styles.toolsContainerOpened : ""].join(" ")}>
							<div className={styles.toolsButtons}>
								<div className={styles.button}>
									<img src="search-icon.svg" alt="" />
									<div>Search</div>
								</div>
								<div className={styles.button} onClick={() => setFiltersOpen(!filtersOpen)}>
									<img src="filter-icon.svg" alt="" />
									<div>Filter</div>
								</div>
								<div className={styles.button} style={{pointerEvents: filtersActive ? 'auto' : 'none', opacity: filtersActive ? '1' : '.5'}} onClick={resetFilters}>
									<img src="reset-icon.svg" alt="" />
									<div>Reset</div>
								</div>
							</div>
							<div className={[styles.filtersContainer, filtersOpen ? styles.filtersContainerOpened : ""].join(" ")} >
								<FiltersComponent
									formCallback={handleFilterChange}
									resetButtonCallback={resetFilters}
									setFiltersActive={setFiltersActive}
									filtersActive={filtersActive}
								></FiltersComponent>
							</div>
						</div>
						<ShipListComponent shipList={shipList} listHeight="calc(100% - 60px)"></ShipListComponent>
					</div>
				</div>
				<div className={styles.mobileInterface}>
					<MobileInterface 
						setFiltersOpen={setFiltersOpen}
						setSearchOpen={setSearchOpen}
						setSettingsOpen={setSettingsOpen}
						resetFilters={resetFilters}
						filtersActive={filtersActive}
						filtersOpen={filtersOpen}
						searchOpen={searchOpen}
						settingsOpen={settingsOpen}
						shipList={shipList}
						handleFilterChange={handleFilterChange}
						setFiltersActive={setFiltersActive}
					></MobileInterface>
				</div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}


// function updateMapMarkers(newShipList: any) {
// 	throw new Error("Function not implemented.");
// }
// function updateMapMarkers(newShipList: any) {
// 	throw new Error("Function not implemented.");
// }
// function updateMapMarkers(newShipList: any) {
// 	throw new Error("Function not implemented.");
// }

