// @ts-ignore
// import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { MapFeature, MapProperties, Shipwreck, ShipwreckFilters } from "@/interfaces";
import * as clientAPI from "@/clientAPI";
import MobileInterface from "./mobileInterface";
import FiltersComponent from "./components/filters";
import ShipListComponent from "./components/shipList";
import { initializeMap, removeHighlightedMapMarker, setHighlightedMapMarker, updateMapMarkers } from "../map";
import { LoadingMessageComponent } from "./components/loadingMessage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [filtersActive, setFiltersActive] = useState<boolean>(false);
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
	const [searchOpen, setSearchOpen] = useState<boolean>(false);
	const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
	const [shipList, setShipList] = useState<Shipwreck[]>([]);
	const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
	const [shipSelectedId, setShipSelectedId] = useState<number | undefined>(undefined);

	useEffect(() => {
		initializePage();
	}, []);

	const initializePage = async () => {
		const mapProperties = {lng: -85.15, lat: 44.5, zoom: 5.5, hidePopups: isMobileDevice};
		if(window.innerWidth <= 550) {
			setIsMobileDevice(true);
			mapProperties.hidePopups = true;
		};
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		initializeMap(map, mapProperties, mapContainer, newShipList, handleMapMarkerClick).then(() => {
			//@ts-ignore
			map.current.on("load", () => {
				setIsLoading(false);
			})
		})
	}

	const handleMapMarkerClick = (mapFeature: MapFeature, shipList: Shipwreck[]) => {
		const id = mapFeature.id;
		if(shipSelectedId === id) {
			removeHighlightedMapMarker(map);
		} else {
			setShipSelectedId(id);
			setHighlightedMapMarker(map, shipList[id].coordinates.longitude, shipList[id].coordinates.latitude)
		}
	}

	const handleFilterChange = async (filterParams: ShipwreckFilters) => {
		if(!map.current) return
		const newShipList = await clientAPI.getFilteredShipwrecks(filterParams);
		setShipList(newShipList);
		updateMapMarkers(map, newShipList);
	}

	const resetFilters = async () => {
		if(!map.current) return
		setFiltersActive(false);
		setShipSelectedId(undefined);
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
					<div className={styles.titleHeader}>Shipwrecks <span style={{fontSize: '12px'}}>.pro</span></div>
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
									setShipSelectedId={setShipSelectedId}
								></FiltersComponent>
							</div>
						</div>
						<ShipListComponent 
							shipList={shipList} 
							listHeight="calc(100% - 60px)" 
							setShipSelectedId={setShipSelectedId}
							shipSelectedId={shipSelectedId}
							setFiltersOpen={setFiltersOpen}
							map={map}
						></ShipListComponent>
					</div>
				</div>
				<div className={styles.mobileInterface}>
					<MobileInterface
						shipSelectedId={shipSelectedId}
						setShipSelectedId={setShipSelectedId}
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
						map={map}
					></MobileInterface>
				</div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}