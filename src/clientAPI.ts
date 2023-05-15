import { ShipwreckFilters } from "./interfaces";

export const getAllShipwrecks = async () => {
    try {
        const res = await fetch("/api/shipwrecks", { method: "GET" });
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
};

export const getFilteredShipwrecks = async (filterParams: ShipwreckFilters) => {
    const formattedParams = JSON.stringify(filterParams);
    try {
        const res = await fetch(`/api/shipwrecks?filterParams=${formattedParams}`, { method: "GET" });
        const data = await res.json();
        console.log("data:::: ", data)
        return data;
    } catch (err) {
        console.warn(err);
    }
}

export const getCurrentMapboxLoadCount = async () => {
    try {
        const res = await fetch("/api/mapBoxCounter", { method: "GET" });
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
}

export const incrementMapboxLoadCount = async (currentMapboxLoadCount: number) => {
    try {
        const res = await fetch("/api/mapBoxCounter", { method: "POST", body: JSON.stringify({currentMapboxLoadCount: currentMapboxLoadCount})});
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
}