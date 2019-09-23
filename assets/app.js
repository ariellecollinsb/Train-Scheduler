var firebaseConfig = {
    apiKey: "AIzaSyASpkC81Ls3tWhQa6lr8UjUgQ-74y_6EcU",
    authDomain: "train-schedule-83763.firebaseapp.com",
    databaseURL: "https://train-schedule-83763.firebaseio.com",
    projectId: "train-schedule-83763",
    storageBucket: "",
    messagingSenderId: "93840598384",
    appId: "1:93840598384:web:b61d438313f467d29e9bb5"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
console.log(database);

var lineName = "";
var destination = "";
var firstArrival = "";
var frequency = 0;

$("#submit").on("click", function (event) {
    event.preventDefault();

    lineName = $("#line-name").val().trim();
    destination = $("#destination").val().trim();
    firstArrival = $("#first-arrival").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        lineName: lineName,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency
    });

    // console.log(snapshot.val());
    console.log(lineName);
    console.log(destination);
    console.log(firstArrival);
    console.log(frequency);
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    
    var cv = childSnapshot.val();


    var firstTimeConverted = moment(cv.firstArrival, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tFrequency = cv.frequency;
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log(diffTime);
   
    $("#schedule").append(`<tr>
        <th scope="row">${cv.lineName}</th>
        <td>${cv.destination}</td>
        <td>${cv.frequency}</td>
        <td>${moment(nextTrain, "HH:mm").format("hh:mm a")}</td>
        <td>${tMinutesTillTrain}</td>
        </tr>`);


    // $("#full-member-list").append("<div class='well'><span class='member-name'> " +
    //         childSnapshot.val().name +
    //         " </span><span class='member-email'> " + childSnapshot.val().email +
    //         " </span><span class='member-age'> " + childSnapshot.val().age +
    //         " </span><span class='member-comment'> " + childSnapshot.val().comment +
    //         " </span></div>");

    $("#lineName-display").text(cv.lineName);
    $("#destination-display").text(cv.destination);
    $("#firstArrival-display").text(cv.firstArrival);
    $("#frequency-display").text(cv.frequency);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

    dataRef.ref().orderByChild("submit").limitToLast(1).on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#lineName-display").text(cv.lineName);
        $("#destination-display").text(cv.destination);
        $("#firstArrival-display").text(cv.firstArrival);
        $("#frequency-display").text(cv.frequency);
    });
});