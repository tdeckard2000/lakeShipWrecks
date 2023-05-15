// @ts-ignore
// import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { MapFeature, Shipwreck, ShipwreckFilters } from "@/interfaces";
import * as clientAPI from "@/clientAPI";
import MobileInterface from "./mobileInterface";
import FiltersComponent from "./components/filters";
import ShipListComponent from "./components/shipList";
import { initializeMap, removeHighlightedMapMarker, setHighlightedMapMarker, updateMapMarkers } from "../map";
import { LoadingMessageComponent } from "./components/loadingMessage";
import ModalComponent from "./components/modal";

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
		const mapProperties = {lng: -89.15, lat: 46.5, zoom: 6, hidePopups: isMobileDevice};
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
		const shipObjectId = mapFeature.properties['id'];
		if(shipSelectedId && shipList[shipSelectedId]._id.toString() === shipObjectId) {
			removeHighlightedMapMarker(map);
			setShipSelectedId(undefined);
		} else {
			setShipSelectedId(mapFeature.id);
			const shipCoordinates = (shipList.find(ship => ship._id.toString() === shipObjectId))?.coordinates;
			setHighlightedMapMarker(map, shipCoordinates?.longitude, shipCoordinates?.latitude);
		}
	}

	const handleFilterChange = async (filterParams: ShipwreckFilters) => {
		if(!map.current) return
		const newShipList = await clientAPI.getFilteredShipwrecks(filterParams);
		setShipList(newShipList);
		removeHighlightedMapMarker(map);
		updateMapMarkers(map, newShipList);
	}

	const resetFilters = async () => {
		if(!map.current) return
		setFiltersActive(false);
		setShipSelectedId(undefined);
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		removeHighlightedMapMarker(map);
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
				<div className={ shipSelectedId === undefined || isMobileDevice ? styles.shipInfoModalHidden : styles.shipInfoModalVisible}>
					<ModalComponent
						borderRadius="12px 12px 0px 0px"
						height="180px"
						top="0px"
						left="0"
						width="750px"
						closeButtonCallback={() => {setShipSelectedId(undefined); removeHighlightedMapMarker(map);}}
						title={shipSelectedId !== undefined ? shipList[shipSelectedId].name : ''}
					>
						<div className={styles.infoModalFlexbox}>
							<div className={styles.imageContainer}>
								<img src={shipSelectedId !== undefined ? shipList[shipSelectedId].linkImage : ''} alt="" />
							</div>
							<div className={styles.infoContainer}>
								<div><span className={styles.statLabels}>Length: </span>{shipSelectedId != undefined && shipList[shipSelectedId].stats.length != undefined ? shipList[shipSelectedId].stats.length?.toString() : '?'} ft</div>
								<div><span className={styles.statLabels}>Beam: </span>{shipSelectedId != undefined && shipList[shipSelectedId].stats.beam != undefined ? shipList[shipSelectedId].stats.beam?.toString() : '?'} ft</div>
								<div><span className={styles.statLabels}>Weight: </span>{shipSelectedId != undefined && shipList[shipSelectedId].stats.grossTons != undefined ? shipList[shipSelectedId].stats.grossTons?.toString() : '?'} gt</div>
								<div><span className={styles.statLabels}>Min Depth: </span>{shipSelectedId != undefined && shipList[shipSelectedId].stats.waterDepth != undefined ? shipList[shipSelectedId].stats.waterDepth?.toString() : '?'} ft</div>
								<div><span className={styles.statLabels}>Coords: </span><span>{shipSelectedId !== undefined? shipList[shipSelectedId].coordinates.latitude?.toString().slice(0, 6) + " " + shipList[shipSelectedId].coordinates.longitude?.toString().slice(0, 7): ''}</span></div>
								<div><span className={styles.statLabels}>ID: </span>{shipSelectedId !== undefined? shipList[shipSelectedId]._id.toString().slice(18) : ''}</div>
								<a target="_blank" href={shipSelectedId !== undefined? shipList[shipSelectedId].linkWiki : ''}>Wikipedia</a>|
								<a target="_blank" href={`https://maps.google.com/?q=${shipSelectedId !== undefined? shipList[shipSelectedId].coordinates.latitude: ''},${shipSelectedId !== undefined? shipList[shipSelectedId].coordinates.longitude : ''}`}>Google Maps</a>
							</div>
							<div className={styles.infoContainer}>
								<div><span className={styles.statLabels}>Launched: </span>{shipSelectedId != undefined && shipList[shipSelectedId].dateLaunched != undefined ? shipList[shipSelectedId].dateLaunched?.toString().slice(4,6) + "/" + shipList[shipSelectedId].dateLaunched?.toString().slice(6,8) + "/" + shipList[shipSelectedId].dateLaunched?.toString().slice(0,4) : '?'}</div>
								<div><span className={styles.statLabels}>Sank: </span>{shipSelectedId != undefined && shipList[shipSelectedId].dateSunk != undefined ? shipList[shipSelectedId].dateSunk?.toString().slice(4,6) + "/" + shipList[shipSelectedId].dateSunk?.toString().slice(6,8) + "/" + shipList[shipSelectedId].dateSunk?.toString().slice(0,4) : '?'}</div>
								<div><span className={styles.statLabels}>Boat Type: </span>{shipSelectedId != undefined && shipList[shipSelectedId].boatType != undefined ? shipList[shipSelectedId].boatType : '?'}</div>
								<div><span className={styles.statLabels}>Location: </span>{shipSelectedId != undefined && shipList[shipSelectedId].location != undefined ? shipList[shipSelectedId].location : '?'}</div>
							</div>
							<div className={styles.infoContainer}>
								<div><span style={{overflow: 'auto'}} className={styles.statLabels}>Notes: </span>{shipSelectedId !== undefined && shipList[shipSelectedId].notes !== undefined ? shipList[shipSelectedId].notes : ''}</div>
							</div>
						</div>
						{/* <div className={styles.expandedShipInfoVisible}>
							<div>More Info Here</div>
						</div> */}
					</ModalComponent>
				</div>
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
							filtersOpen={filtersOpen}
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