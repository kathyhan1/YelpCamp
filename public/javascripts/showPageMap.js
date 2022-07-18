const campground1 = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground1.geometry.coordinates, // starting position [lng, lat]
zoom: 8, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

const marker = new mapboxgl.Marker()
.setLngLat(campground1.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground1.title}</h3><p>${campground1.location}</p>`
    )
)
marker.addTo(map);