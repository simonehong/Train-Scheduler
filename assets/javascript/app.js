 // Initialize Firebase
var config = {
    apiKey: "AIzaSyCOA7PzYqDuB2XssxDxisdSVplY17h0i9o",
    authDomain: "train-scheduler-64190.firebaseapp.com",
    databaseURL: "https://train-scheduler-64190.firebaseio.com",
    projectId: "train-scheduler-64190",
    storageBucket: "",
    messagingSenderId: "291802898014"

};
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  //Adding new trains upon submit to firebase
  $("#add-train-btn").on("click", function(){
      event.preventDefault();
  
      //Grabbing input
      var trainName = $("#train-name-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var firstTrain = $("#first-train-input").val().trim();
      var trainFrequency = $("#frequency-input").val().trim();
  
      //create a local "temp" object for holding new trains added
  
      var newTrain = {
          name: trainName,
          destination: trainDestination,
          time: firstTrain,
          frequency: trainFrequency
      };
  
      //Uploading new train info to firebase database
      database.ref().push(newTrain);
  
      //Testing input with console logs
      // console.log(newTrain.name);
      // console.log(newTrain.destination);
      // console.log(newTrain.time);
      // console.log(newTrain.frequency);
  
      //Alerting the user their new train has been "added"
      alert("Train added");
  
      //Clears all input boxes upon submit to database
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");
  });
  
  //Creating Firebase even for adding new trains to the database and a row in the html when a train is added
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey){
  
      console.log(childSnapshot.val());
  
      //stores everything into firebase variable
      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var firstTrain = childSnapshot.val().time;
      var trainFrequency = childSnapshot.val().frequency;
  
      // console.log(trainName);
      // console.log(trainDestination);
      // console.log(firstTrain);
      // console.log(trainFrequency);
  
  //Train time calulation
      //First Train Time (pushed back 1 yr to make sure it comes before current time)
      var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
      // console.log(firstTrainConverted);
  
      //current time
      var currentTime = moment();
          // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
          // console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart (remainder)
      var trainTimeRemainder = diffTime % trainFrequency;
          // console.log(trainTimeRemainder);
  
    //Calculation of how main minutes away the train is
      var trainXminsAway = trainFrequency - trainTimeRemainder;
          // console.log(trainXminsAway);
  
      //Calculation of next arrival store in variable.
      var nextTrainArrival = moment().add(trainXminsAway, "minutes").format("hh:mm A");
          // console.log(nextTrainArrival);
  
  
  //End of train time calculations
  
      //Add each train's data into the table
      $("#train-table > tbody").append(
          `<tr id="train-table-body">
               <td> ${trainName} </td>
               <td> ${trainDestination} </td>
               <td> ${trainFrequency} </td>
               <td> ${nextTrainArrival} </td>
               <td> ${trainXminsAway} </td>
           </tr>
          `
      );
  
  //Handles the errors
  }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
  });