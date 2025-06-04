function CheckMatchState(){
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4) {
      var data = JSON.parse(this.responseText); // Adiciona o parse da resposta
      console.log(data)
      if (this.status == 401) {
          // If status is 401 , show a message and a link to the login page
          window.location.href = "/login.html";
          return;
      } 
      if (data.state == "NOT_IN_MATCH"){
          document.getElementById("btn1").style.display = "block";
          document.getElementById("searchingMatch").style.display = "none";
          document.getElementById("btn3").style.display = "none";
          document.getElementById("username").innerHTML = "username: " + data.username
          document.getElementById("history").innerHTML = "match history: " + data.history
      }else if (data.state == "WAITING_MATCH"){
          // decide what to when the player is already waiting for a match. Maybe show a button to quit???
          document.getElementById("searchingMatch").style.display = "block";
          document.getElementById("btn1").style.display = "none";
          document.getElementById("btn3").style.display = "block";
          document.getElementById("username").innerHTML = "username: " + data.username
          document.getElementById("history").innerHTML = "match history: " + data.history
      }else if (data.state == "IN_GAME"){
          window.location.href = "/game/";
      }
    }
  }
  
  request.open("GET", "/checkMatch", true);
  request.send();
}

function GetCurrentTeam() {
   playClickSound();
  console.log("Get current team!");
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (this.readyState == 4) {
        var data = JSON.parse(this.responseText);
        console.log(data);

        data.units.forEach(unit => {
          var slotID = "slot" + unit.slot_id;
          console.log(slotID);
            const element = document.getElementById(slotID);
            console.log(element)
            element.innerHTML =`<img src="./Img/units/${unit.unit_id}.png" alt="${unit.unit_name}"  style="width: 150%; height: 220%; object-fit: cover;" />`;
        });

        document.getElementById("bigsqr").innerHTML = `<img src="./Img/blessings/b${data.blessing.blessing_id}.png" alt="${data.blessing.blessing_name}"style="width: 150%; height: 220%; object-fit: cover;" />`;
    }
  };

  request.open("GET", "/getPlayerUnits", true);
  request.send();
}

function SearchMatch() {
   playClickSound();
  console.log("Search match!");

  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (this.readyState == 4) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        // if (data.message) {
        //   alert(data.message);
        // }
    }
  };
  
  request.open("POST", "/searchMatch", true);
  request.send();
}

function QuitSearch() {
   playClickSound();
  console.log("Quit search!");

  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
      }
    }
  };

  request.open("POST", "/quitSearch", true);

  request.send();
}

function TeamSelectPage() {
  playClickSound();

  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.redirect){
          window.location.href = data.redirect;
        }
      }
    }
  };

  request.open("POST", "/teamSelectPage", true);

  request.send();
}

function playClickSound() {
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.currentTime = 0; 
    sound.play();
  }
}