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
              let category = document.getElementsByClassName('category')[track]
              category.addEventListener('change',fill_rec)
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
  document.getElementById('accordionFlushExample').innerHTML = ''
  let text = document.getElementById('result-3').innerHTML
  date_list = text.split(',')
  for(let i=0; i<date_list.length; i++){
    skip_index = 0
    for(let u=0;u<3;u++){
      skip_index = date_list[i].indexOf(' ',skip_index)
      skip_index += 1
    }
    date_text = date_list[i].slice(0,skip_index)
    item = document.createElement('div')
    item.innerHTML = `
    <div class="accordion-item">
            <!-- header -->
            <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                <h4 id="${i}">${date_text} </h4>
          
              </button>
            </h2>

            <!-- body -->
            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body "> 
                    <div class="row d-flex">
                          <!------------- SEARCH BOX ------------->

                          <!--PLACE INFO START-->
                          <div class="place_info"></div>

                          <!--ADD PLACE INPUT BOX-->
                          <div class="search-box mb-2 ">
                            <input type="text" id="${i}" class="form-control origin_fill" placeholder="Add a place">
                            <br>
                            
                            <div class="row recommend_header"></div>
                            <div class="recommended"></div>

                          </div>
                          <br>
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
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
for(places in distance_list){
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
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
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
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
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
   console.log(id)
   let fill = document.createElement('div');
   id_rep = id.replace('-','_')
   for(let i=0;i<10;i++){
    id_rep = id_rep.replace('-','_')
   }
   console.log(id_rep,"ID REPP EHRE")
   fill.id = id_rep + 'row'
   fill.className = "container";
   fill.innerHTML = `
    <div class="row my-2">
      <div class="col mb-2 rounded p-3 bg-light" >
        <h3>${name}
         <span style='float:right' class='fa fa-trash ' onClick="removePlace(${id_rep+'row'})"></span>
        </h3>
      <div>
    </div>
   <div class="row">
  
    <div class="col-4">
      <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
      <br>
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
          <!------------- Budget ------------------>

        <div class="col-10">
          <div class="input-group mb-3">
              <span class="input-group-text">Budget</span>
              <input type="number" class="form-control" placeholder="Add budget" aria-label="budget" id="${id_rep+'budget'}">
          </div>
        </div>

      </div>

      <div class="row">
        <!------------- Time ------------------>
        <div class="col-10">
          <div class="input-group mb-3 w-80">
            <span class="input-group-text">Time</span>
            <input type="text" class="form-control" placeholder="Add time" aria-label="time" 'time'" id="${id_rep+'time'}">
          </div>
        </div>
      </div>

      <div class="row">
  
        <!------------- NOTE ------------------>
        <div class="col-10 mx-0">
          <div class="d-flex">
          <i class="fa fa-sticky-note"> Add Notes: </i>
            <br>
            <div class="textarea mx-1" id=${id_rep+'notes2'} contenteditable "></div>
          </div><br>
          <br>
        </div>
  
        
        <div hidden class='getAllVal'>${id},${id_rep+'row'},${name},${lati},${lng},${picture_url},${track}</div>
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

  

function removePlace(id){
document.getElementById(id.id).remove()
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
let fill = ""
fill.innerHTML = ''
var indx = 0
var active_status = "active"
let carouselnum = document.getElementById('carousel_num').innerHTML
let id = 'carouselExampleControls'+ carouselnum
let id2 = '#carouselExampleControls'+ carouselnum
fill += `
  <div id=${id} class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
  `
var 
count_of_card = 1

for(item of results){
  
  // Labelling the items
  place_id = item.place_id
  name = item.name
  if(item.photos != undefined){
    photo = item.photos[0].getUrl({})
  }
  
  // Checking the active status
  if(indx !== 0){
    active_status = ""
  }

  if(count_of_card === 1){
    
    //carousel-item "active"
    //card 1
    //count_of_card ++

    fill += `
    <div class="carousel-item ${active_status} mt-2" >
      <div class ="card-group">

      <div class="card border rounded mb-0 h-100 rounded">
      <div class="card-row d-flex g-0 h-100 w-100">
          <div class="col-md-4 p-0">
              <img src="${photo}" class="rounded" alt="...">
          </div>
          <div class="col-md-7 px-2">
              <div class="card-body p-1">
                  <h5 class="card-title text-truncate mb-0">${name}</h5>
                  <button value=${place_id} onclick='add_rec(this,${num},${id})' class="btn btn-primary  btn-sm p-1" style="font-size:10px;position:absolute; type="submit" class="add_recommend">ADD!</button>
              </div>
          </div>
      </div>
    </div>`
  
    count_of_card++
  } else if (count_of_card===2){

    //card 2
    //count_of_card ++
    fill += `
    <div class="card border rounded mb-0 h-100 rounded">
      <div class="card-row d-flex g-0 h-100 w-100">
          <div class="col-md-4 p-0">
              <img src="${photo}" class="rounded" alt="...">
          </div>
          <div class="col-md-7 px-2">
              <div class="card-body p-1">
                  <h5 class="card-title text-truncate mb-0">${name}</h5>
                  <button value=${place_id} onclick='add_rec(this,${num},${id})' class="btn btn-primary  btn-sm  p-1 fs-7" style="font-size:10px;position:absolute; type="submit" class="add_recommend">ADD!</button>
              </div>
          </div>
      </div>
    </div>
    `
    count_of_card++
  } else {
    //card 3
    //End of carousel-item
    //count_of_card =1
    fill += `
        <div class="card border rounded mb-0 h-100 rounded">
          <div class="card-row d-flex g-0 h-100 w-100">
              <div class="col-md-4 p-0">
                  <img src="${photo}" class="rounded" alt="...">
              </div>
              <div class="col-md-7 px-2">
                  <div class="card-body p-1">
                      <h5 class="card-title text-truncate mb-0">${name}</h5>
                      <button value=${place_id} onclick='add_rec(this,${num},${id})' class="btn btn-primary  btn-sm  p-1 fs-7" style="font-size:10px;position:absolute; type="submit" class="add_recommend">ADD!</button>
                  </div>
              </div>
          </div>
      </div>
      <!--Individual card End-->

      </div>
      <!--Card group per slider End-->
    </div>
    `
    count_of_card =1
  }
  indx++
}
fill +=  `
        </div>
        </div>

          <button class="carousel-control-prev" type="button" data-bs-target=${id2} data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target=${id2} data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>

        </div>`
parent.innerHTML = fill
document.getElementById('carousel_num').innerHTML = Number(document.getElementById('carousel_num').innerHTML) + 1
}
}
}



function add_rec(place_id,track){
  if(place_id.value == undefined){
    console.log('fail to retrieve API')
    return 
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
placeId: place_id.value,
fields: ['name', 'rating', 'photo','place_id','geometry']
};

service = new google.maps.places.PlacesService(map);
service.getDetails(request, callback);

function callback(place, status) {
  lati = place.geometry.location.lat()
  lng = place.geometry.location.lng()
  id = place.place_id
  console.log(id)
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    if(place.photos[0] != undefined){
      picture_url = place.photos[0].getUrl({
   })
   }
   id_rep = id.replace('-','_')
   for(let i=0;i<10;i++){
    id_rep = id_rep.replace('-','_')
   }
   console.log(id_rep, "id rep here2 ")
   let name = place.name
   let fill = document.createElement('div');
   fill.id = id_rep + 'row'
   fill.className = "container";
   fill.innerHTML = `
    <div class="row my-2">
    <div class="col mb-2 rounded p-3 bg-light" >
      <h3>${name}
        <span style='float:right' class='fa fa-trash ' onClick="removePlace(${id_rep+'row'})"></span>
      </h3>
    <div>
  </div>
  <div class="row">

  <div class="col-4">
    <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
    <br>
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
        <!------------- Budget ------------------>

      <div class="col-10">
        <div class="input-group mb-3">
            <span class="input-group-text">Budget</span>
            <input type="number" class="form-control" placeholder="Add budget" aria-label="budget" id="${id_rep+'budget'}">
        </div>
      </div>

    </div>

    <div class="row">
      <!------------- Time ------------------>
      <div class="col-10">
        <div class="input-group mb-3 w-80">
          <span class="input-group-text">Time</span>
          <input type="text" class="form-control" placeholder="Add time" aria-label="time" id="${id_rep}time">
        </div>
      </div>
    </div>

    <div class="row">

    <!------------- NOTE ------------------>
        <div class="col-10 mx-0">
          <div class="d-flex">
          <i class="fa fa-sticky-note"> Add Notes: </i>
            <br>
            <div class="textarea mx-1" id=${id_rep+'notes2'} contenteditable "></div>
          </div><br>
          <br>
        </div>

      
      <div hidden class='getAllVal'>${id},${id_rep+'row'},${name},${lati},${lng},${picture_url},${track}</div>
    </div>
  </div>
  </div>
  </div>
  `
   //let parent = document.getElementById('place_info')
   let parent = document.getElementsByClassName('place_info')[track]
   console.log(parent)
   parent.appendChild(fill)
  }
  
  }
  }

// function addFormField(id) {
//     console.log(id)
//     id_origin = id
//     id = id.id
//     id2 = id.slice(0,id.length-1) +'2'
//     to_add = document.createElement('div')
//     to_add.className = 'input_field' + id_origin.id
    
//     current_input = document.getElementsByClassName('input_field' + id_origin.id)
//     if(current_input.length == 0){
//       to_add.id = 'input_field'+ id_origin.id + 1
//     }
//     else{
//       cur_num_class = current_input[current_input.length-1].id
//       cur_num = cur_num_class[cur_num_class.length - 1]
//       console.log(cur_num)
//       to_add.id =  'input_field' + id_origin.id + (Number(cur_num)+1)
//     }
//     to_add.innerHTML = `<div class="d-flex">
//             <span class="textarea" contenteditable "></span>
//             </div><br>`
//     div_element = document.getElementById(id2)
//     div_element.appendChild(to_add)
//   }

// function removeFormField(id) {
//   document.getElementById(id.id).remove()
// }


// note  on enter
let el = document.querySelector(".input-wrap .input");
let widthMachine = document.querySelector(".input-wrap .width-machine");
el.addEventListener("keyup", () => {
  widthMachine.innerHTML = el.value;
});

// Dealing with Textarea Height
function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  // min-height + lines x line-height + padding + border
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
  return newHeight;
}

let textarea = document.querySelector(".resize-ta");
textarea.addEventListener("keyup", () => {
  textarea.style.height = calcHeight(textarea.value) + "px";
});

//side bar
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled-2");
  $('#menu ul').hide();
});

function initMenu() {
  $('#menu ul').hide();
  $('#menu ul').children('.current').parent().show();
  //$('#menu ul:first').show();
  $('#menu li a').click(
     function() {
        var checkElement = $(this).next();
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
           return false;
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
           $('#menu ul:visible').slideUp('normal');
           checkElement.slideDown('normal');
           return false;
        }
     }
  );
}
$(document).ready(function() {
  initMenu();
});



//add
function saveData(){
  obj = {}
  let places_list = document.getElementsByClassName('place_info')
  for(item of places_list){
    console.log(item)
    places = item.getElementsByClassName('container')
    for(place of places){
      let val = place.getElementsByClassName('getAllVal')[0].innerHTML
      let val_list = val.split(',')
      let id = val_list[0]
      let id_rep = val_list[1]
      let id_notes = id_rep.slice(0,id_rep.length-3) + 'notes2'
      console.log(document.getElementById(id_notes).innerHTML)
      let note_text = document.getElementById(id_notes).innerHTML
      console.log(note_text)

      let name = val_list[2]
      let lati = val_list[3]
      let lng = val_list[4]
      let picture_url = val_list[5]
      let tracker = val_list[6]
      console.log(id_rep)
      console.log(id_rep.slice(0,id_rep.length-3)+"budget")
      console.log(document.getElementById(id_rep.slice(0,id_rep.length-3)+"budget"))
      let budget = document.getElementById(id_rep.slice(0,id_rep.length-3)+"budget").value
      let time = document.getElementById(id_rep.slice(0,id_rep.length-3)+"time").value
  
      if(obj[tracker] != undefined){
        obj[tracker].push({
          id : id,
          id_rep : id_rep,
          name : name,
          lati: lati,
          lng : lng,
          picture_url : picture_url,
          tracking : tracker,
          budget: budget,
          time: time,
          note_text : note_text
        })
        
      }
      else{
        obj[tracker] = [{
          id : id,
          id_rep : id_rep,
          name : name,
          lati: lati,
          lng : lng,
          picture_url : picture_url,
          tracking : tracker,
          budget: budget,
          time: time,
          note_text : note_text
        }]
      }   
      }
    }
    console.log(obj)
    firebase.database().ref('users/' + localStorage.getItem('uid') + '/trip/' + '/'+trip_id+'/' + '/destination_info/').set( obj, function (error) {
      if (error) {
          console.log("Add Data Failed!");
      } else {
          console.log("Add Data Done!");
      }
  });
  }


//get name,id,id_rep,track_num(track the accordion position)
// <div hidden class='getAllVal'>${id},${id_rep+'row'},${name},${lati},${lng},${picture_url},${track}</div>


function empty(){
  firebase.database().ref('users/' + localStorage.getItem('uid') + '/trip/' + '/'+trip_id+'/' + '/destination_info').set({})
}
function getData(){
  console.log(document.getElementsByClassName('place_info'))
}

//logout 
let logout = document.getElementById('logout') 
logout.addEventListener('click', logout1) 
function logout1() { 
    localStorage.removeItem('uid') 
    sessionStorage.setItem('logout', true) 
    window.location.href = '../index.html' 
};



