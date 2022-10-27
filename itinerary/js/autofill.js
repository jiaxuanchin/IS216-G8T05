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
function getDistance_Drive(item){
    //get value from hidden input field
    let distance_list = document.getElementsByClassName('get_distance')
    for(places in distance_list){
      if(distance_list[places].innerHTML != undefined){
        id=distance_list[places].innerHTML.split(',')[0]
      if(id==item.value){
        origin_lat = distance_list[places].innerHTML.split(',')[1]
        origin_lng = distance_list[places].innerHTML.split(',')[2]
        if((Number(places)+1) <= distance_list.length-1){
          destination_lat = distance_list[Number(places+1)].innerHTML.split(',')[1]
          destination_lng = distance_list[Number(places+1)].innerHTML.split(',')[2]
        }
        else{
          console.log('out of bound')
        }
      }
      }
    }
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
    console.log(distance)
 
    }
    }
    else{
        let to_add = document.getElementById('distance')
        to_add.innerHTML = 'fill the form first!'
    }
    
}

function getDistance_walk(){
  //get value from hidden input field
  let distance_list = document.getElementsByClassName('get_distance')
  for(places in distance_list){
    if(distance_list[places].innerHTML != undefined){
      id=distance_list[places].innerHTML.split(',')[0]
    if(id==item.value){
      origin_lat = distance_list[places].innerHTML.split(',')[1]
      origin_lng = distance_list[places].innerHTML.split(',')[2]
      if((Number(places)+1) <= distance_list.length-1){
        destination_lat = distance_list[Number(places+1)].innerHTML.split(',')[1]
        destination_lng = distance_list[Number(places+1)].innerHTML.split(',')[2]
      }
      else{
        console.log('out of bound')
      }
    }
    }
  }
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
  let distance = response.rows[0].elements[0].distance.text //get distance
  let duration = response.rows[0].elements[0].duration.text //get duration
  let to_add = document.getElementById('distance')
  to_add.innerHTML = 'distance = '+distance + ' duration = '+duration
  console.log(distance)

  }
  }
  else{
      let to_add = document.getElementById('distance')
      to_add.innerHTML = 'fill the form first!'
  }
  
}

function getDistance_transit(){
  //get value from hidden input field
  let distance_list = document.getElementsByClassName('get_distance')
  for(places in distance_list){
    if(distance_list[places].innerHTML != undefined){
      id=distance_list[places].innerHTML.split(',')[0]
    if(id==item.value){
      origin_lat = distance_list[places].innerHTML.split(',')[1]
      origin_lng = distance_list[places].innerHTML.split(',')[2]
      if((Number(places)+1) <= distance_list.length-1){
        destination_lat = distance_list[Number(places+1)].innerHTML.split(',')[1]
        destination_lng = distance_list[Number(places+1)].innerHTML.split(',')[2]
      }
      else{
        console.log('out of bound')
      }
    }
    }
  }
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
  let distance = response.rows[0].elements[0].distance.text //get distance
  let duration = response.rows[0].elements[0].duration.text //get duration
  let to_add = document.getElementById('distance')
  to_add.innerHTML = 'distance = '+distance + ' duration = '+duration
  console.log(distance)

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
                                  <div>
                                  <br>
                                  <!-------------BUTTONS --------------->
                                  <p>
                                    <button class="btn btn-light" href="#" onClick="addFormField(); return false;">+Note</button>
                                    <button class="btn btn-light" href="#" onClick="addCheckbox(); return false;">+Checklist</button>
                                  </p>
      
                                  <!------------- NOTE ------------------>
                                  <form action="#" method="get" id="form1">
                                    <input type="hidden" id="id" value="1">
                                    <div id="divTxt"></div>
                                  </form>
                                  
                                  <!-------------CHECKLIST -------------->
                                  <form action="#" method="get" id="form2">
                                    <input type="hidden" id="id2" value="1">
                                    <div id="divCheckBox"></div>
                                  </div>

                                  </form>

                                <div hidden class='get_distance'>${id},${lati},${lng}</div>

                                  <button value=${id} onclick='getDistance_Drive(this)' class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
                                  <button value=${id} onclick='getDistance_transit(this)' class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
                                  <button value=${id} onclick='getDistance_walk(this)' class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
                                
                                  <div id="distance"></div>
                                </div>

                                <div class="col-4">
                                  <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
                                </div>
                                
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
      place_id = item.place_id
      name = item.name
      if(item.photos != undefined){
        photo = item.photos[0].getUrl({
     })
    }
      if(track==1){
        track += 1
        fill = `
        recommended places 
        <div id="recommended" >
                              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                  <div class="carousel-item active" style='height:150px'>
                                  <div class="card mb-3" style="max-width: 250px;">
                                    <div class="row g-0">
                                      <div class="col-md-6">
                                        <img src="${photo}"  alt="..." style="width:150px; max-height:150px">
                                      </div>
                                      <div class="col-md-6">
                                        <div class="card-body" >
                                          <p class="card-title">${name}</p>
                                          <button value=${place_id} onclick='add_rec(this)' class="btn btn-primary" style="position:absolute; right:20%; top:50%; type="submit" class="add_recommend">ADD!</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
        `
      }
      else{
        fill += `<div class="carousel-item" style='height:150px'>
                                  <div class="card mb-3" style="max-width: 300px;">
                                    <div class="row g-0">
                                      <div class="col-md-6">
                                        <img src="${photo}"  alt="..." style="width:150px;max-height:150px">
                                      </div>
                                      
                                      <div class="col-md-6">
                                        <div class="card-body">
                                          <p class="card-title">${name}</>
                                          <button value=${place_id} onclick='add_rec(this)' class="btn btn-primary" style="position:absolute; right:20%; top:50%; type="submit" class="add_recommend">ADD!</button>
                                        </div>
                                      </div>
                                    </div>
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



function add_rec(place_id){
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
    placeId: place_id.value,
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
                                  <div>
                                  <br>
                                  <!-------------BUTTONS --------------->
                                  <p>
                                    <button class="btn btn-light" href="#" onClick="addFormField(); return false;">+Note</button>
                                    <button class="btn btn-light" href="#" onClick="addCheckbox(); return false;">+Checklist</button>
                                  </p>
      
                                  <!------------- NOTE ------------------>
                                  <form action="#" method="get" id="form1">
                                    <input type="hidden" id="id" value="1">
                                    <div id="divTxt"></div>
                                  </form>
                                  
                                  <!-------------CHECKLIST -------------->
                                  <form action="#" method="get" id="form2">
                                    <input type="hidden" id="id2" value="1">
                                    <div id="divCheckBox"></div>
                                  </div>

                                  </form>

                                  <button class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
                                  <button class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
                                  <button class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
                                
                                  <div id="distance"></div>
                                </div>

                                <div class="col-4">
                                  <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
                                </div>
                                
                              </div>
     `
     let parent = document.getElementById('place_info')
     parent.appendChild(fill)
     document.getElementById('origin_input').value = ''
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

