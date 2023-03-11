export const getAllShipwrecks = async () => {
    try {
        const res = await fetch("/api/shipwrecks", { method: "GET" });
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
};

export const getShipwrecksBySinkYearRange = async (fromYear: number, toYear: number) => {
    try {
        const res = await fetch(
            `/api/shipwrecks?getBySinkYear=${fromYear},${toYear}`,
            { method: "GET" }
        );
        const data = await res.json();
        return data
    } catch (err) {
        console.warn(err);
    }
};

export const getShipwrecksByLocation = async () => {
    try {
        const res = await fetch("/api/shipwrecks?getByLocation=Lake Superior", {
            method: "GET",
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
};