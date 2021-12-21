// initialize unsplash

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplashApi.search.getPhotos({
        query: "coffee shop",
        perPage: 40,
    });
    const unsplashResults = photos.response?.results || [];
    return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
    // latLong = "43.65267326999575,-79.39545615725015",
    latLong = "25.18451244936472,55.2782629734157",
    limit = '6'
) => {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY,
        }
    };
    const photos = await getListOfCoffeeStorePhotos();
    const response = await fetch(
        getUrlForCoffeeStores(latLong, "coffee stores", limit), options
    );
    const data = await response.json();
    // console.log('data', data);

    return data.results?.map((venue, idx) => {
        return {
            // ...venue,
            id: venue.fsq_id,
            address: venue.location.address || "",
            name: venue.name,
            neighbourhood:
                venue.location.neighborhood || venue.location.crossStreet || "",
            imgUrl: photos[idx],
        };
    }) || [];
};