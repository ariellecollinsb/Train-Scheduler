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

$("#submit").on("click", function (event) {
    event.preventDefault();

    var lineName = $("#line-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstArrival = $("#first-arrival").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
        lineName: lineName,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency,

    });

        $("#line-name").val("");
        $("#destination").val("");
        $("#first-arrival").val("");
        $("#frequency").val("");
        

});
database.ref().on("child_added", function (childSnapshot) {

    var cv = childSnapshot.val();
    
    
    var key = childSnapshot.key; 
    var firstTimeConverted = moment(cv.firstArrival, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tFrequency = cv.frequency;
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    $("#schedule").append(`<tr id="row-${key}">
        <th scope="row">${cv.lineName}</th>
        <td>${cv.destination}</td>
        <td>${cv.frequency}</td>
        <td>${moment(nextTrain, "HH:mm").format("hh:mm a")}</td>
        <td>${tMinutesTillTrain}</td>
        <td><button id="remove-${key}" class="remove" data-key=${key}>Delete</button></td>
        </tr>`);
console.log(key);
  $(`#remove-${key}`).on("click", function() {

     database.ref().child(key).remove();


  });
    

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);


});

database.ref().on("child_removed", function(removeChild) {
    $(`#row-${removeChild.key}`).remove();

});