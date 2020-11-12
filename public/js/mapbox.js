/* eslint-disable */
export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoibm11ZGQwMzciLCJhIjoiY2toMzUxajEzMGI4cjJ5cXJnamxqeXJraSJ9.8ofikYDO57agDc314y-cOg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/nmudd037/ckh36tmen017019ryf51igjwh',
        scrollZoom: false
        // center: [-116.024311, 51.581435],
        // zoom: 10,
        // interactive: false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        //Create Marker
        const el = document.createElement('div');
        el.className = 'marker';
        
        //Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
    
        //Add Popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
    
        //Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    
    //To fit the map to the bounds
    map.fitBounds(bounds, {
        padding: {
           top: 200,
           bottom: 150,
           left: 100,
           right: 100
        }
    });
};

