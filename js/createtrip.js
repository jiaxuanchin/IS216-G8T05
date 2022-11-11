console.log("I'm in airlines.js")

let tripfromdate = document.getElementById("fromdate");
let triptodate = document.getElementById("todate");

let flightfromdate = document.getElementById("fromdt");
let hotelfromdate = document.getElementById("fromstay");

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("fromdate").setAttribute("min", today);
document.getElementById("todate").setAttribute("min", today);
document.getElementById("fromdt").setAttribute("min", today);
document.getElementById("todt").setAttribute("min", today);
document.getElementById("fromstay").setAttribute("min", today);
document.getElementById("tostay").setAttribute("min", today);

function checkCalendar(original, target) {
    let date = document.getElementById(original);
    document.getElementById(target).setAttribute("min", date.value);
}

tripfromdate.onchange = function () {
    checkCalendar("fromdate", "todate");
}

flightfromdate.onchange = function () {
    checkCalendar("fromdt", "todt");
}

hotelfromdate.onchange = function () {
    checkCalendar("fromstay", "tostay");
}


function call_all_airlines_api() {

    console.log("**** [START] call_all_airlines_api() *****")

    const options = {
        method: 'GET',
        url: 'https://iata-and-icao-codes.p.rapidapi.com/airlines',
        headers: {
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
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

function call_schedule_api() {

    console.log("**** [START] call_schedule_api() *****")

    let dcode = document.getElementById("airlineF").value;
    let departureflightno = dcode + document.getElementById("floatingFrom").value;
    let departuredate = document.getElementById("fromdt").value;

    let acode = document.getElementById("airlineT").value;
    let arrivalflightno = acode + document.getElementById("floatingTo").value;
    let arrivaldate = document.getElementById("todt").value;
    console.log(departureflightno);
    console.log(arrivalflightno);

    let result = new Date().toISOString().slice(0, 10);

    const options = {
        method: 'GET',
        url: `https://aerodatabox.p.rapidapi.com/flights/number/${departureflightno}/${result}`,
        headers: {
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
    };

    const options1 = {
        method: 'GET',
        url: `https://aerodatabox.p.rapidapi.com/flights/number/${arrivalflightno}/${result}`,
        headers: {
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
    };

    myFunction();
    let table = document.getElementById("searchresult");
    table.innerHTML = "";
    table.innerHTML += `<tr>
                <th> Flight Number</th>
                <th>Departure Airport & Time</th>
                <th>Arrival Airport & Time</th>
                </tr> `;


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

            table.innerHTML += `<tr><td><span id='dd_flight'>${departureflightno}</span></td>
                        <td><span id='dd_airport'>${records[0].departure.airport.name}</span>
                        <span id='dd_time'>${newdtime}</span></td>
                        <td><span id='da_airport'>${records[0].arrival.airport.name}</span>
                        <span id='da_time'>${newatime}</span></td>
                        </tr>`
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })

    axios.request(options1)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data

            let dtime = records[0].departure.scheduledTimeLocal;
            let newdtime = dtime.slice(11, 16);

            let atime = records[0].arrival.scheduledTimeLocal;
            let newatime = atime.slice(11, 16);

            table.innerHTML += `<tr><td><span id='rd_flight'>${arrivalflightno}</span></td>
                        <td><span id='rd_airport'>${records[0].departure.airport.name}</span> 
                        <span id='rd_time'>${newdtime}</span></td>
                        <td><span id='ra_airport'>${records[0].arrival.airport.name}</span> 
                        <span id='ra_time'>${newatime}</span></td>
                        </tr>`
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })



    console.log("**** [END] call_schedule_api() *****")
}

function country_list() {
    console.log("**** [START] call_all_airlines_api() *****")

    let arr = [];

    const options = {
        method: 'GET',
        url: 'https://city-list.p.rapidapi.com/api/getCountryList',
        headers: {
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
            'X-RapidAPI-Host': 'city-list.p.rapidapi.com'
        }
    };

    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data
            console.log(records);
            console.log(records[0][0].iso);
            console.log(records[0][0].cname);
            for (i = 0; i < records[0].length; i++) {
                let result = records[0][i].cname + "(" + records[0][i].iso + ")";
                arr.push(result);
            }
            console.log(arr);
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })

    return arr;

    console.log("**** [END] call_all_airlines_api() *****")
}

function city_list() {
    console.log("**** [START] call_all_airlines_api() *****")

    let arr = [];
    let text = document.getElementById("myCountryInput").value;
    let first = text.indexOf("(");
    let second = text.indexOf(")");
    let city = text.slice(first + 1, second);

    const options = {
        method: 'GET',
        url: 'https://city-list.p.rapidapi.com/api/getCity/' + city,
        headers: {
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
            'X-RapidAPI-Host': 'city-list.p.rapidapi.com'
        }
    };

    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data
            console.log(records);
            for (i = 0; i < records[0].length; i++) {
                let result = records[0][i].name;
                //let id = records[0][i].id;
                //let data = {'id': id, 'name' : result};
                //console.log(data);
                arr.push(result);
            }
            console.log(arr);
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })

    return arr;

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
            'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
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
                    'X-RapidAPI-Key': '890cb1b4c6mshcd940a491c340d9p1ab5a5jsn14faf23b9e1f',
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

const firebaseConfig = {
    apiKey: "AIzaSyCLWmg-X8gl75JxCVz57jOIekeqSUk6XUY",
    authDomain: "adventuretime-934a2.firebaseapp.com",
    databaseURL: "https://adventuretime-934a2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "adventuretime-934a2",
    storageBucket: "adventuretime-934a2.appspot.com",
    messagingSenderId: "168230082500",
    appId: "1:168230082500:web:6fbd2239d875c99c467691",
    measurementId: "G-MXMNLZZLM8"
}

firebase.initializeApp(firebaseConfig);

function insertTripDetails() {
    let country = document.getElementById("myCountryInput").value;
    let city = document.getElementById("myCityInput").value;
    let startdate = document.getElementById("fromdate").value;
    let enddate = document.getElementById("todate").value;

    let depature_details = "";
    let arrival_details = "";
    let hotellist = "";

    if (document.getElementById("flightstatus").innerText == "Added") {
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

        depature_details = {
            'departure-airlines': airlinesfrom, 'departure-flight-number': flightfrom, 'departure-date': fromdate,
            'depart-airport': rd_airport, 'depart-time': rd_time, 'arrival-airport': ra_airport, 'arrival-time': ra_time
        };

        arrival_details = {
            'arrival-airlines': airlinesto, 'arrival-flight-number': flightto, 'arrival-date': todate,
            'depart-airport': dd_airport, 'depart-time': dd_time, 'arrival-airport': da_airport, 'arrival-time': da_time
        };
    }

    if (document.getElementById("hotelstatus").innerText == "Added") {
        let hotel = document.getElementById("myHotelInput").value;
        let fromhoteldate = document.getElementById("fromstay").value;
        let tohoteldate = document.getElementById("tostay").value;

        hotellist = { 'hotel': hotel, 'start-date': fromhoteldate, 'end-date': tohoteldate };
    }

    let id = startdate + country.slice(0, 3) + city.slice(0, 3);

    writeUserDataWithCompletion(id, country, city, startdate, enddate, depature_details, arrival_details, hotellist);
    sessionStorage.setItem("country", country);
}

//The following writes the data
function writeUserDataWithCompletion(id, selected_country, selected_city, start_date, end_date, departure_flight, arrival_flight, hotel) {
    firebase.database().ref('users/' + localStorage.getItem('uid') + '/trip/' + id).set({
        country: selected_country,
        city: selected_city,
        startdate: start_date,
        enddate: end_date,
        departureflight: arrival_flight,
        arrivalflight: departure_flight,
        hotel: hotel,
    }, function (error) {
        if (error) {
            console.log("Add Data Failed!");
        } else {
            console.log("Add Data Done!");
            window.location.href = 'restrictions.html'
        }
    });
}