const position = {};

export const successCallback = (pos) => {
    position.longitude = pos.coords.longitude;
    position.latitude = pos.coords.latitude;
};

async function doGPSFetch() {
    const response = await fetch("https://geolocation-db.com/json/", {
        method: 'GET'
    });
    return response.json();
}

export const errorCallback = (error) => {
    doGPSFetch()
    .then((data) => {
        position.longitude = data.longitude;
        position.latitude = data.latitude;
    });
};

export default position;