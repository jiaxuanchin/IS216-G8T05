//map with auto-fill to get long lang and place ID (Google API)
  function fill_origin(){
    let origin_list = document.getElementsByClassName('origin_fill')
    for(origin of origin_list){
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
          track = 0
          for(original of origin_list){
              if(original.value.includes(place.name)){
                document.getElementById('recommended_track').value=track
                fill_info(track)
                fill_rec(track)
              }
              track+=1
          }
          


          let auto_complete_list = document.getElementsByClassName('origin_fill')
          for(item of auto_complete_list){
            item.value = ''
          }
        })
     
    }
  
  }

  function fill_template(){
    let num_date = document.getElementById('result-3')
    for(let i=0; i<num_date.length; i++){
      item = document.createElement('div')
      item.innerHTML = `
      <div class="accordion-item">
              <!-- header -->
              <h2 class="accordion-header" id="flush-headingOne">
                <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  <h4 id="${i}">${num_date[i]} </h4>
            
                </button>
              </h2>

              <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body"> 
                      <div class="row d-flex">
                          <div class="col-12">

                            <!------------- SEARCH BOX ------------->
                            <!--PLACE INFO START-->
                             <div class="place_info">
                              
                            </div>

                            <!--PLACE INFO END-->

                            <!--ADD PLACE INPUT BOX-->
                            <div class="search-box mb-2 ">
                              <input type="text" id="${i}" class="form-control origin_fill" placeholder="Add a place">
                              <br>
                              
                              <div class="row recommend_header"></div>
                              <div class="recommended" ></div>
 
                            </div>

                            <br>                       
                          </div> <!--end col-->
                      </div> <!--end row-->
                  </div> <!--end accordion body-->
              </div> <!--end accordion collaspe-->
            </div> <!--end DAY 1--></div>
      `
      document.getElementById('accordionFlushExample').appendChild(item)
      fill_origin();
     
    }

    
  }

//get distance by driving (Google API)
function getDistance_Drive(item){
    //get value from hidden input field
    let distance_list = document.getElementsByClassName('get_distance') // list for all days
    distance_list = item.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
    for(places in distance_list){
      console.log(distance_list[places])
      if(distance_list[places].innerHTML != undefined){
        id=distance_list[places].innerHTML.split(',')[0]
      if(id==item.value){
        id_save = id
        origin_lat = distance_list[places].innerHTML.split(',')[1]
        origin_lng = distance_list[places].innerHTML.split(',')[2]
        if((Number(places)+1) <= distance_list.length-1){
       
          destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
          destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]
      
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
    let to_add = document.getElementsByClassName('distance')
    for(item of to_add){
      console.log(item)
      if(item.id == id_save){
        item.innerHTML = 'distance = '+distance + ' duration = '+duration
      }
    }
    }
    }
    
}

function getDistance_walk(item){
  //get value from hidden input field
  let distance_list = document.getElementsByClassName('get_distance') // list for all days
  distance_list = item.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
  for(places in distance_list){
    console.log(distance_list[places])
    if(distance_list[places].innerHTML != undefined){
      id=distance_list[places].innerHTML.split(',')[0]
    if(id==item.value){
      id_save = id
      origin_lat = distance_list[places].innerHTML.split(',')[1]
      origin_lng = distance_list[places].innerHTML.split(',')[2]
      if((Number(places)+1) <= distance_list.length-1){
     
        destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
        destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]
    
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
  let to_add = document.getElementsByClassName('distance')
  for(item of to_add){
    console.log(item)
    if(item.id == id_save){
      item.innerHTML = 'distance = '+distance + ' duration = '+duration
    }
  }
  }
  }
  
}

function getDistance_transit(item){
  //get value from hidden input field
  let distance_list = document.getElementsByClassName('get_distance') // list for all days
  distance_list = item.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
  for(places in distance_list){
    console.log(distance_list[places])
    if(distance_list[places].innerHTML != undefined){
      id=distance_list[places].innerHTML.split(',')[0]
    if(id==item.value){
      id_save = id
      origin_lat = distance_list[places].innerHTML.split(',')[1]
      origin_lng = distance_list[places].innerHTML.split(',')[2]
      if((Number(places)+1) <= distance_list.length-1){
     
        destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
        destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]
    
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
  let to_add = document.getElementsByClassName('distance')
  for(item of to_add){
    console.log(item)
    if(item.id == id_save){
      item.innerHTML = 'distance = '+distance + ' duration = '+duration
    }
  }
  }
  }
  
}

function fill_info(track){
  if(document.getElementsByClassName('recommend_header')[track].innerHTML==''){
    document.getElementsByClassName('recommend_header')[track].innerHTML = `
    <div class="col-8">Recommended places</div>
                              <div class="col-4">
                                <select name="category" class="category">
                                  <option value="restaurant">restaurant</option>
                                  <option value="bar">bar</option>
                                  <option value="museum">museum</option>
                                  <option value="amusement_park">amusement park</option>
                                  <option value="book_store">book_store</option>
                                  <option value="shopping_mall">shopping mall</option>
                                  <option value="night_club">night club</option>
                                  <option value="movie_theater">movie theater</option>
                                </select>
                              </div>
    `
    let category = document.getElementsByClassName('category')[track]
    category.addEventListener('change',fill_rec)
  }

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

     let fill = document.createElement('div');
     fill.className = "container";
     fill.innerHTML = `
      <div class="row my-2">
        <div class="col">
          ${name}
        <div>
      </div>

     <div class="row"> 
      <div class="col-4">
        <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
  
        <div hidden class='get_distance'>${id},${lati},${lng}</div>

        <p>
        <button value=${id} onclick='getDistance_Drive(this)' class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
        <button value=${id} onclick='getDistance_transit(this)' class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
        <button value=${id} onclick='getDistance_walk(this)' class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
      
        <div class="distance" id=${id}></div>
        </p>
      </div>

      <div class="col-8"> 
        <div class="row">
          <div class="col">
            <!------------- NOTE ------------------>
            <button class="btn btn-light" href="#" onClick="addFormField(); return false;">+Note</button>
            <br>
            <form action="#" method="get" id="form1">
              <input type="hidden" id="id" value="1">
              <div id="divTxt"></div>
            </form>
          </div>

          <!-------------CHECKLIST -------------->
          <div class="col">
            <button class="btn btn-light" href="#" onClick="addCheckbox(); return false;">+Checklist</button>
            <br>
            <form action="#" method="get" id="form2">
              <input type="hidden" id="id2" value="1">
              <div id="divCheckBox"></div>
            </form>
          </div>
        </div>
      </div>

    </div>
     `
     let parent = document.getElementsByClassName('place_info')[track]
     parent.appendChild(fill)
    }
  }
}

function fill_rec(){
  let num = document.getElementById('recommended_track').value
  let parent = document.getElementsByClassName('recommended')[num]
  let id = document.getElementById('place_id').value
  let lati = document.getElementById('origin_lat').value 
  let lng = document.getElementById('origin_lng').value 
  let category = document.getElementsByClassName('category')[num].value
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
    type: [category]
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let num = document.getElementById('recommended_track').value
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
        <div id="recommended" >
                              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                  <div class="carousel-item active" style='height: 150px;'>
                                  <div class="card mb-3" style="max-width: 150px;">
                                    <div class="row g-0">

                                      <div class="col-md-6">
                                        <img src="${photo}"  alt="..." style="width:150px; max-height:150px">
                                      </div>

                                      <div class="col-md-6">
                                        <div class="card-body" >
                                            
                                          <p class="card-title">${name}</p>
                                          <button value=${place_id} onclick='add_rec(this,${num})' class="btn btn-primary" style=" right:20%; top:50%; type="submit" class="add_recommend">ADD!</button>
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
                                          <button value=${place_id} onclick='add_rec(this,${num})' class="btn btn-primary" style="position:absolute; right:20%; top:50%; type="submit" class="add_recommend">ADD!</button>
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



function add_rec(place_id,track){
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
        <div class="col">
          ${name}
        <div>
      </div>

     <div class="row"> 
      <div class="col-4">
        <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
  
        <div hidden class='get_distance'>${id},${lati},${lng}</div>

        <p>
        <button value=${id} onclick='getDistance_Drive(this)' class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
        <button value=${id} onclick='getDistance_transit(this)' class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
        <button value=${id} onclick='getDistance_walk(this)' class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
      
        <div class="distance" id=${id}></div>
        </p>
      </div>

      <div class="col-8"> 
        <div class="row">
          <div class="col">
            <!------------- NOTE ------------------>
            <button class="btn btn-light" href="#" onClick="addFormField(); return false;">+Note</button>
            <br>
            <form action="#" method="get" id="form1">
              <input type="hidden" id="id" value="1">
              <div id="divTxt"></div>
            </form>
          </div>

          <!-------------CHECKLIST -------------->
          <div class="col">
            <button class="btn btn-light" href="#" onClick="addCheckbox(); return false;">+Checklist</button>
            <br>
            <form action="#" method="get" id="form2">
              <input type="hidden" id="id2" value="1">
              <div id="divCheckBox"></div>
            </form>
          </div>
        </div>
      </div>

    </div>
     `
     
     //let parent = document.getElementById('place_info')
     let parent = document.getElementsByClassName('place_info')[track]
     parent.appendChild(fill)
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


