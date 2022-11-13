function call_all_airlines_api() {

    console.log("**** [START] call_all_airlines_api() *****")

    const options = {
        method: 'GET',
        url: 'https://iata-and-icao-codes.p.rapidapi.com/airlines',
        headers: {
            'X-RapidAPI-Key': '4f7618f0c7msh976688b82e5bb70p1973d0jsn25598be7fb57',
            'X-RapidAPI-Host': 'iata-and-icao-codes.p.rapidapi.com'
        }
    };

    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back
            let fromdropdown = document.getElementById("airlineF");
            let todropdown = document.getElementById("airlineT");
            //console.log(fromdropdown);
            //console.log(todropdown);
            let arr = [];

            let records = response.data
            for (i = 0; i < records.length; i++) {
                let content = { 'iata_code': records[i].iata_code, 'name': records[i].name }
                arr.push(content);
            }

            arr.sort((a, b) => {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            })

            for (i = 0; i < arr.length; i++) {
                var el = document.createElement("option");
                el.text = arr[i].name;
                el.value = arr[i].iata_code;
                fromdropdown.add(el);
            }
            for (i = 0; i < arr.length; i++) {
                var el1 = document.createElement("option");
                el1.text = arr[i].name;
                el1.value = arr[i].iata_code;
                todropdown.add(el1);
            }
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })


    console.log("**** [END] call_all_airlines_api() *****")
}

function call_hotel_api() {

    let arr = [];

    console.log("**** [START] call_schedule_api() *****")

    let input = document.getElementById("myCityInput").value;
    console.log(input);
    let destid = 0;

    const options = {
        method: 'GET',
        url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
        params: { locale: 'en-gb', name: input },
        headers: {
            'X-RapidAPI-Key': '25c1e79b86msh26ff571ca0896b4p1095cajsn6e8223b65455',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    // 2) Use Axios to call API asynchronously
    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back
            let records = response.data
            console.log(records);
            destid = records[0].dest_id;
            console.log(destid);
            const options1 = {
                method: 'GET',
                url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
                params: {
                    checkout_date: '2022-12-01',
                    units: 'metric',
                    dest_id: destid,
                    dest_type: 'city',
                    locale: 'en-gb',
                    adults_number: '2',
                    order_by: 'popularity',
                    filter_by_currency: 'USD',
                    checkin_date: '2022-11-30',
                    room_number: '1'
                },
                headers: {
                    'X-RapidAPI-Key': '25c1e79b86msh26ff571ca0896b4p1095cajsn6e8223b65455',
                    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                }
            };

            // 2) Use Axios to call API asynchronously
            axios.request(options1)
                .then(function (response) {

                    // Inspect the response.data
                    // Got some response back
                    let records = response.data.result
                    console.log(records);
                    for (i = 0; i < records.length; i++) {
                        let name = records[i].hotel_name;
                        arr.push(name);
                    }
                    console.log(arr);
                })
                .catch(function (error) {
                    // In case of any error, see what it's about
                    console.log(error)
                })
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })

    console.log("**** [END] call_schedule_api() *****")

    return arr;
}

function call_schedule_api() {

    console.log("**** [START] call_schedule_api() *****")

    let dcode = document.getElementById("airlineF").value;
    let departureflightno = dcode + document.getElementById("floatingFrom").value;
    let departuredate = document.getElementById("fromdt").value;

    let result = new Date().toISOString().slice(0, 10);

    const options = {
        method: 'GET',
        url: `https://aerodatabox.p.rapidapi.com/flights/number/${departureflightno}/${result}`,
        headers: {
            'X-RapidAPI-Key': '4f7618f0c7msh976688b82e5bb70p1973d0jsn25598be7fb57',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
    };

    let table = document.getElementById("searchresult");
    table.innerHTML = "";

    // 2) Use Axios to call API asynchronously
    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data
            console.log(records);
            console.log(records[0]);

            let dtime = records[0].departure.scheduledTimeLocal;
            let newdtime = dtime.slice(11, 16);

            let atime = records[0].arrival.scheduledTimeLocal;
            let newatime = atime.slice(11, 16);

            let string = `<tr><td><span id='dd_flight'>${departureflightno}</span></td>
                        <td><span id='dd_airport'>${records[0].departure.airport.name}</span>
                        <span id='dd_time'>${newdtime}</span></td>
                        <td><span id='da_airport'>${records[0].arrival.airport.name}</span>
                        <span id='da_time'>${newatime}</span></td>
                        </tr>`

            call_airlines_schedule_api(string);
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
            document.getElementById("flighterrormsg").style.display = "block";
            document.getElementById("flighterrormsg").innerHTML = "<h4 style='color:red;' class='text-center'>Invalid departure flight number</h4><br><br>";
        })

    console.log("**** [END] call_schedule_api() *****")
}

function call_airlines_schedule_api(depart_result) {

    console.log("**** [START] call_schedule_api2() *****")

    let table = document.getElementById("searchresult");
    let acode = document.getElementById("airlineT").value;
    let arrivalflightno = acode + document.getElementById("floatingTo").value;

    let result = new Date().toISOString().slice(0, 10);

    const options1 = {
        method: 'GET',
        url: `https://aerodatabox.p.rapidapi.com/flights/number/${arrivalflightno}/${result}`,
        headers: {
            'X-RapidAPI-Key': '4f7618f0c7msh976688b82e5bb70p1973d0jsn25598be7fb57',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
    };
    console.log(table);

    axios.request(options1)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data

            let dtime = records[0].departure.scheduledTimeLocal;
            let newdtime = dtime.slice(11, 16);

            let atime = records[0].arrival.scheduledTimeLocal;
            let newatime = atime.slice(11, 16);

            //myFunction();
            document.getElementById("result").style.display = "block";
            table.innerHTML += `<tr>
                <th>Flight Number</th>
                <th>Departure Airport & Time</th>
                <th>Arrival Airport & Time</th>
                </tr> `;

            table.innerHTML += depart_result;

            table.innerHTML += `<tr><td><span id='rd_flight'>${arrivalflightno}</span></td>
                        <td><span id='rd_airport'>${records[0].departure.airport.name}</span> 
                        <span id='rd_time'>${newdtime}</span></td>
                        <td><span id='ra_airport'>${records[0].arrival.airport.name}</span> 
                        <span id='ra_time'>${newatime}</span></td>
                        </tr>`
            console.log(table.innerHTML);
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
            document.getElementById("flighterrormsg").style.display = "block";
            document.getElementById("flighterrormsg").innerHTML = "<h4 style='color:red;' class='text-center'>Invalid return flight number</h4><br><br>";
        })

    console.log("**** [END] call_schedule_api2() *****")
}

function updateFlight() {
    let userId = localStorage.getItem('uid');
    let airlinesfrom = document.getElementById("airlineF").value;
    let flightfrom = document.getElementById("dd_flight").innerText;
    let fromdate = document.getElementById("fromdt").value;
    let rd_airport = document.getElementById("rd_airport").innerText;
    let ra_airport = document.getElementById("ra_airport").innerText;
    let rd_time = document.getElementById("rd_time").innerText;
    let ra_time = document.getElementById("ra_time").innerText;

    let airlinesto = document.getElementById("airlineT").value;
    let flightto = document.getElementById("rd_flight").innerText;
    let todate = document.getElementById("todt").value;
    let dd_airport = document.getElementById("dd_airport").innerText;
    let da_airport = document.getElementById("da_airport").innerText;
    let dd_time = document.getElementById("dd_time").innerText;
    let da_time = document.getElementById("da_time").innerText;

    let depature_details = {
        'arrival_airlines': airlinesfrom, 'arrival_flight_number': flightfrom, 'arrival_date': todate,
        'depart_airport': rd_airport, 'depart_time': rd_time, 'arrival_airport': ra_airport, 'arrival_time': ra_time
    };

    let arrival_details = {
        'departure_airlines': airlinesto, 'departure_flight_number': flightto, 'departure_date': fromdate,
        'depart_airport': dd_airport, 'depart_time': dd_time, 'arrival_airport': da_airport, 'arrival_time': da_time
    };

    var updates = {};
    updates['/users/' + userId + "/trip/" + sessionStorage.getItem("tripId") + "/departureflight/"] = arrival_details;
    updates['/users/' + userId + "/trip/" + sessionStorage.getItem("tripId") + "/arrivalflight/"] = depature_details;
    firebase.database().ref().update(updates);
    checkHotelFlight();
}

function updateHotel() {
    let userId = localStorage.getItem('uid');
    let hotel = document.getElementById("myHotelInput").value;
    let fromhoteldate = document.getElementById("fromstay").value;
    let tohoteldate = document.getElementById("tostay").value;

    let hotellist = { 'hotel': hotel, 'start_date': fromhoteldate, 'end_date': tohoteldate };

    var updates = {};
    updates['/users/' + userId + "/trip/" + sessionStorage.getItem("tripId") + "/hotel/"] = hotellist;
    firebase.database().ref().update(updates);
    checkHotelFlight();
}

function checkHotelFlight() {
    let table = document.getElementById("existsearchresult");
    table.innerHTML = "";
    var user = firebase.database().ref('users/' + localStorage.getItem('uid') + "/trip/" + sessionStorage.getItem("tripId") + "/departureflight/");
    user.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let response = snapshot.val();
            if (response != "") {
                let str = "";
                str += `<tr>
                        <td><span id='dd_flight'>${response.departure_flight_number}</span></td>
                        <td><span id='dd_flight'>${response.departure_date}</span></td>
                        <td><span id='dd_airport'>${response.depart_airport}</span>
                        <span id='dd_time'>${response.depart_time}</span></td>
                        <td><span id='da_airport'>${response.arrival_airport}</span>
                        <span id='da_time'>${response.arrival_time}</span></td>
                        </tr>`
                callReturnFlight(str);
            }
            //console.log(response);
            //console.log(response.arrival_time);
        }
    });

    let hoteltable = document.getElementById("existhotelresult");
    hoteltable.innerHTML = "";
    hoteltable.innerHTML += `<tr>
                <th>Check-In Date</th>
                <th>Check-Out Date</th>
                <th>Hotel Name</th>
                </tr> `;
    var hotel = firebase.database().ref('users/' + localStorage.getItem('uid') + "/trip/" + sessionStorage.getItem("tripId") + "/hotel/");
    hotel.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let response = snapshot.val();
            if (response != "") {
                document.getElementById("hotelnotexist").style.display = "none";
                document.getElementById("hotelexist").style.display = "block";
                hoteltable.innerHTML += `<tr>
                        <td>${response.start_date}</td>
                        <td>${response.end_date}</td>
                        <td>${response.hotel}</td>
                        </tr>`
            }
        }
    });
}

function callReturnFlight(str) {
    let table = document.getElementById("existsearchresult");
    var user1 = firebase.database().ref('users/' + localStorage.getItem('uid') + "/trip/" + sessionStorage.getItem("tripId") + "/arrivalflight/");
    user1.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let response = snapshot.val();
            if (response != "") {
                table.innerHTML += `<tr>
                                        <th>Flight Number</th>
                                        <th>Date</th>
                                        <th>Departure Airport & Time</th>
                                        <th>Arrival Airport & Time</th>
                                    </tr> `;
                table.innerHTML += str;
                table.innerHTML += `<tr>
                        <td><span id='dd_flight'>${response.arrival_flight_number}</span></td>
                        <td><span id='dd_flight'>${response.arrival_date}</span></td>
                        <td><span id='dd_airport'>${response.depart_airport}</span>
                        <span id='dd_time'>${response.depart_time}</span></td>
                        <td><span id='da_airport'>${response.arrival_airport}</span>
                        <span id='da_time'>${response.arrival_time}</span></td>
                        </tr>`
                document.getElementById("noflightexists").style.display = "none";
                document.getElementById("flightexists").style.display = "block";
            }
        }
    });
}