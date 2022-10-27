//map with auto-fill to get long lang and place ID (Google API)
function initMap() {
    
    //auto complete for origin
    let origin = document.getElementById('origin_input')
    const origin_auto = new google.maps.places.Autocomplete(origin, {
        fields: ["place_id", "geometry", "name", "formatted_address"],
      });
    //this line below execute after choosing the autofill option
    origin_auto.addListener("place_changed", () => {
       
    
        const place = origin_auto.getPlace();
        if (!place.place_id) {
          return;
        }
        //stored value in hidden input field
        let to_add = document.getElementById('origin_lat')
        to_add.value =place.geometry.location.lat()
        to_add = document.getElementById('origin_lng')
        to_add.value = place.geometry.location.lng()
        document.getElementById('place_id').value = place.place_id

        //fill on place_info
        fill_info()
        fill_rec()
      })
  }
   window.initMap = initMap;


//get distance by driving (Google API)
function getDistance_Drive(){
    //get value from hidden input field
    let origin_lat = document.getElementById('origin_lat').value 
    let origin_lng = document.getElementById('origin_lng').value 
    let destination_lat = document.getElementById('destination_lat').value 
    let destination_lng = document.getElementById('destination_lng').value 
    if(origin_lat != 'None' && destination_lat != 'None'){
        // Add Distance Matrix here
    const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
    const matrixOptions = {
    origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
    destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    // Call Distance Matrix service
    service.getDistanceMatrix(matrixOptions, callback);

    // Callback function used to process Distance Matrix response
    function callback(response, status) {
    if (status !== "OK") {
        alert("Error with distance matrix");
        return;
    }
    let distance = response.rows[0].elements[0].distance.text //get distance
    let duration = response.rows[0].elements[0].duration.text //get duration
    let to_add = document.getElementById('distance')
    to_add.innerHTML = 'distance = '+distance + ' duration = '+duration
 
    }
    }
    else{
        let to_add = document.getElementById('distance')
        to_add.innerHTML = 'fill the form first!'
    }
    
}

function getDistance_walk(){
  let origin_lat = document.getElementById('origin_lat').value 
  let origin_lng = document.getElementById('origin_lng').value 
  let destination_lat = document.getElementById('destination_lat').value 
  let destination_lng = document.getElementById('destination_lng').value 
  if(origin_lat != 'None' && destination_lat != 'None'){
      // Add Distance Matrix here
  const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
  const matrixOptions = {
  origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
  destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
  travelMode: 'WALKING',
  unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  // Call Distance Matrix service
  service.getDistanceMatrix(matrixOptions, callback);

  // Callback function used to process Distance Matrix response
  function callback(response, status) {
  if (status !== "OK") {
      alert("Error with distance matrix");
      return;
  }
  let distance = response.rows[0].elements[0].distance.text
  let duration = response.rows[0].elements[0].duration.text
  let to_add = document.getElementById('distance')
  to_add.innerHTML = 'distance = '+distance + ' duration = '+duration

  }
  }
  else{
      let to_add = document.getElementById('distance')
      to_add.innerHTML = 'fill the form first!'
  }
  
}

function getDistance_transit(){
  let origin_lat = document.getElementById('origin_lat').value 
  let origin_lng = document.getElementById('origin_lng').value 
  let destination_lat = document.getElementById('destination_lat').value 
  let destination_lng = document.getElementById('destination_lng').value 
  if(origin_lat != 'None' && destination_lat != 'None'){
      // Add Distance Matrix here
  const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
  const matrixOptions = {
  origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
  destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
  travelMode: 'TRANSIT',
  unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  // Call Distance Matrix service
  service.getDistanceMatrix(matrixOptions, callback);

  // Callback function used to process Distance Matrix response
  function callback(response, status) {
  if (status !== "OK") {
      alert("Error with distance matrix");
      return;
  }
  let distance = response.rows[0].elements[0].distance.text
  let duration = response.rows[0].elements[0].duration.text
  let to_add = document.getElementById('distance')
  to_add.innerHTML = 'distance = '+distance + ' duration = '+duration

  }
  }
  else{
      let to_add = document.getElementById('distance')
      to_add.innerHTML = 'fill the form first!'
  }
  
}

function fill_info(){
  let id = document.getElementById('place_id').value
  let lati = document.getElementById('origin_lat').value 
  let lng = document.getElementById('origin_lng').value 
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: Number(lati), lng: Number(lng) },
    zoom: 13,
  })
  let location = new google.maps.LatLng(lati,lng)

  //fill place_info
  var request = {
    placeId: id,
    fields: ['name', 'rating', 'photo']
  };
  
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);
  
  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      if(place.photos[0] != undefined){
        picture_url = place.photos[0].getUrl({
     })
     }

     let name = place.name

     let fill = document.createElement('div')
     fill.innerHTML = `
     <div class="row my-2">
                                <div class="col-8">
                                  ${name}
                                </div>
                                <div class="col-4">
                                  <img src=${picture_url} alt="">
                                </div>
                                <div>-----------------------------</div>
                              </div>
     `
     let parent = document.getElementById('place_info')
     parent.appendChild(fill)
     document.getElementById('origin_input').value = ''
    }
  }
}

function fill_rec(){
  let id = document.getElementById('place_id').value
  let lati = document.getElementById('origin_lat').value 
  let lng = document.getElementById('origin_lng').value 
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: Number(lati), lng: Number(lng) },
    zoom: 13,
  })
  let location = new google.maps.LatLng(lati,lng)

  //fill place_info
  var request = {
    placeId: id,
    fields: ['name', 'rating', 'photo']
  };

  service = new google.maps.places.PlacesService(map)
  var request = {
    location: location,
    radius: '500',
    type: ['restaurant']
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    document.getElementById('recommended').innerHTML = ''
    let parent = document.getElementById('recommended')
    let name = ''
    let photo = ''
    let fill = document.createElement('div')
    fill.innerHTML = ''
    let track = 1
    for(item of results){
      name = item.name
      console.log(item.photos)
      if(item.photos != undefined){
        photo = item.photos[0].getUrl({
     })
    }
      if(track==1){
        track += 1
        fill = `
        recommended places 
        <div id="recommended" style="height: 200px">
                              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                  <div class="carousel-item active">
                                    <img src="${photo}" class="d-block" alt="..." style="width:20%; max-height: 180px">
                                    <div class="carousel-caption d-none d-md-block">
                                      <h5>${name}</h5>
                                  
                                    </div>
                                  </div>
        `
      }
      else{
        fill += `<div class="carousel-item">
        <img src="${photo}" class="d-block" alt="..." style="width:20%; max-height: 180px">
        <div class="carousel-caption d-none d-md-block">
                                      <h5>${name}</h5>
                              
                                      </div>
      </div>`
      }
    }
    fill += `</div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</div>`
parent.innerHTML = fill
  }
}
}


function addFormField() {
  var id = document.getElementById("id").value;
  $("#divTxt").append(
    "<p id='row" + id +"'><label for='txt" + id +"'> &nbsp;&nbsp;<input type='text' size='20' name='txt[]' id='txt'"+
      id +
      "'>&nbsp;&nbsp<a href='#' onClick='removeFormField(\"#row" +
      id +
      "\"); return false;'><i class='fa fa-trash'></i></a><p>"
  );
  id = id - 1 + 2;
  document.getElementById("id").value = id;
}

function removeFormField(id) {
  $(id).remove();
}

function addCheckbox() {
  var id2 = document.getElementById("id2").value;
  $("#divCheckBox").append(
    "<p id='row" + id2 +"'><label for='txt" + id2 +"'> &nbsp;&nbsp;<input type='checkbox' size='40' name='CheckBox[]' id='CheckBox'"+ id2 + "'> <input type='text' size='15' name='txt[]' id='txt'"+
      id2 +
      "'>&nbsp;&nbsp<a href='#' onClick='removeCheckBox(\"#row" +
      id2 +
      "\"); return false;'><i class='fa fa-trash'></i></a><p>"
  );
  id2 = id2 - 1 + 2;
  document.getElementById("id2").value = id2;
}

function removeCheckBox(id2) {
  $(id2).remove();
}

var j=1;
function addPlace() {
  var node = document.createElement("li"); 
  node.innerHTML = "<input id='origin_input" + j +"' placeholder='Add a place" + j + "' onFocus='geolocate()' type='text' />";               
  document.getElementById("divPlace").appendChild(node);
  j++; 
}