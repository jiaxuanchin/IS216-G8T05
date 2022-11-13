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

retrieveProfile();
retrieveTrip();

function retrieveProfile() {
    //let username = document.getElementById("username");
    //let usernameedit = document.getElementById("usernameedit");
    //let name = document.getElementById("name");
    let email = document.getElementById("email");

    var user = firebase.database().ref('users/' + localStorage.getItem('uid'));
    console.log(localStorage.getItem('uid'));
    console.log(user);
    user.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let response = snapshot.val();
            //username.innerText = "@" + response.username;
            //name.innerText = response.name;
            email.innerText = response.email;
            //usernameedit.innerText = "Username : @" + response.username;
            //document.getElementById("newname").value = response.Name;
            document.getElementById("newemail").value = response.email;
            if (response.photo != undefined) {
                document.getElementById("profile").src = response.photo;
            }
            else {
                document.getElementById("profile").src = "https://www.pngkey.com/png/detail/765-7656718_avatar-blank-person.png";
            }
            //console.log(snapshot.val());
        }
        else {
            document.getElementById("status").innerText = "Error exists";
        }
    });
}

function updateProfile() {
    //var userId = document.getElementById("id").value;
    let userId = localStorage.getItem('uid');
    //var name = document.getElementById("newname").value;
    var email = document.getElementById("newemail").value;
    //var file = document.getElementById("files").files[0];
    //console.log(document.getElementById("files").files.length);
    var updates = {};
    if (document.getElementById("files").files.length != 0) {
        //updates['/users/' + userId + "/" + 'Name'] = name;
        updates['/users/' + userId + "/" + 'email'] = email;
        firebase.database().ref().update(updates);
        uploadFile();
    }
    else {
        //updates['/users/' + userId + "/" + 'Name'] = name;
        updates['/users/' + userId + "/" + 'email'] = email;
        firebase.database().ref().update(updates);
        retrieveProfile();
        document.getElementById("edit").style.display = "none";
        document.getElementById("normalprofile").style.display = "block";
    }
}

function uploadFile() {
    // Created a Storage Reference with root dir
    var storageRef = firebase.storage().ref();
    // Get the file from DOM
    var file = document.getElementById("files").files[0];
    //console.log(file);

    //dynamically set reference to the file name
    var thisRef = storageRef.child("profileimg").child(localStorage.getItem('uid'));

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        //alert("File Uploaded")
        //console.log('Uploaded a blob or file!');
        //console.log(snapshot);

        thisRef.getDownloadURL()
            .then((url) => {
                // Insert url into an <img> tag to "download"
                //document.getElementById("profile").src = url;
                let userId = localStorage.getItem('uid');
                var updates = {};
                updates['/users/' + userId + "/" + 'photo'] = url;
                //console.log(url);

                firebase.database().ref().update(updates);
                retrieveProfile();
                document.getElementById("edit").style.display = "none";
                document.getElementById("normalprofile").style.display = "block";
            })
    });
}

function editProfile() {
    document.getElementById("edit").style.display = "block";
    document.getElementById("normalprofile").style.display = "none";
}

function retrieveTrip() {
    var user = firebase.database().ref('users/' + localStorage.getItem('uid') + '/trip/');
    user.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById("currenttrip").innerHTML = "";
            let response = snapshot.val();
            //console.log(response);
            for (item in response) {
                //console.log(item);
                retrieveTripDetails(item);
            }
        }
        else {
            console.log("Error exists");
        }
    });
}

function retrieveTripDetails(item) {
    var user = firebase.database().ref('users/'+ localStorage.getItem('uid') + '/trip/' + item);
    user.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            let response = snapshot.val();
            //console.log(response);
            let list = document.getElementById("currenttrip");
            let indexcountry = response.country.indexOf("(");
            let newcountry = response.country.slice(0, indexcountry);
            let city = response.city;

            let startdate = new Date(response.startdate);
            let enddate = new Date(response.enddate);

            let currentdate = new Date();

            if (currentdate > enddate) {
                list = document.getElementById("pasttrip");
                document.getElementById("past-trip-list").style.display = "block";
            }

            const formattedstartDate = startdate.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            }).replace(/ /g, ' ');

            const formattedendDate = enddate.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            }).replace(/ /g, ' ');

            let img = `https://firebasestorage.googleapis.com/v0/b/adventuretime-934a2.appspot.com/o/countryimg%2F${response.country}.jpg?alt=media&token=424a7755-5b93-495b-b7ac-ec2b8c26b72c`;
            let string = `<div class="student-seat col-md-6">
                            <div class="card item">
                                <div id="seeitinerary"><img src="${img}" class="card-img-top img-card" alt="${newcountry}">
                                    <div class="card-body">
                                        <p class="card-text">
                                            <h3 onclick="openItinerary()" style='color:blue;text-decoration: underline;'>${city}, ${newcountry}</h3>
                                            <p onclick="openItinerary()" style='color:blue;text-decoration: underline;'>${formattedstartDate} - ${formattedendDate}</p>
                                        </p>
                                        <p id='tripId' style='display:none;'>${item}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            list.innerHTML += string;
        }
        else {
            console.log("Error exists");
        }
    });
}