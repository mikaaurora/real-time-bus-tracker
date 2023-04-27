let map
let markers = []

async function run() {
  const locations = await getBusLocations()

  markers.forEach((marker) => marker.setMap(null))

  locations.forEach((location) => {
    const marker = new google.maps.Marker({
      position: {
        lat: location.attributes.latitude,
        lng: location.attributes.longitude
      },
      map: map,
      icon: {
        url: 'bus-location.png',
        scaledSize: new google.maps.Size(30, 30)
      }
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `<div class="bus-info"><div>${location.attributes.label}</div><div>${location.relationships.trip.data.id}</div></div>`
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    markers.push(marker)
  })
  setTimeout(run, 15000)
}

// api call for boston bus data
async function getBusLocations() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip'
  const response = await fetch(url)
  const json = await response.json()
  return json.data
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 42.3601, lng: -71.0589 },
    zoom: 13,
    mapId: '4a037a364303d0da'
  })

  run()
}

window.onload = initMap
