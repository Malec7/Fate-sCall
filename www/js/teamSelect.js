currentSelectedSlot = undefined
currentSelectedIndex = -1
slotSelected = false

function GetTeamState() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            console.log(data)
            if (this.status == 401) {
                window.location.href = "/login.html";
                return;
            }
            if (this.status == 404) {
                document.getElementById("username").innerHTML = "username: " + data.username
                document.getElementById("history").innerHTML = "Team: " + data.history
                
            }
            if (this.status == 200) {
                document.getElementById("username").innerHTML = "username: " + data.username
                document.getElementById("history").innerHTML = "Team: " + data.history
                document.getElementById("bigsqr").innerHTML = `<img src="./Img/blessings/b${data.blessing.blessing_id}.png"  alt="${data.blessing.blessing_name}" style="width: 100%; height: 100%; object-fit: cover;" />`;

                data.units.forEach(unit => {
                    var element = document.getElementById("slot" + unit.slot_id)
                    element.innerHTML = `<img src="./Img/units/${unit.unit_id}.png" alt="${unit.unit_name}"  style="width: 150%; height: 200%; object-fit: cover;" />`;
                    
                })
            }
        }
    }

    request.open("GET", "/getTeamState", true);

    request.send();
}

function selectBlessing(blessingId){
    playClickSound();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            console.log(data)

            const blessingName = data.blessing_name
            document.getElementById("bigsqr").innerHTML = `<img src="./Img/blessings/b${blessingId}.png"alt="${blessingName}"style="width: 80%; height: 100%; object-fit: cover;" />`;
    
        }
    };

    request.open("GET", "/setBlessing/" + blessingId, true);
    request.send();
}

function selectUnit(unitId) {
    playClickSound();
    if (currentSelectedIndex == -1){
        console.log("no slot selected");
        return
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            const data = JSON.parse(this.responseText);
            console.log(data)
            if (data.message) {
                alert(data.message);
            }
            currentSelectedSlot.innerHTML = ` <img src="./Img/units/${data.unit_id}.png" alt="${data.unit_name}" style="width: 150%; height: 200%; object-fit: cover;" />`;
            console.log(data.unit_name)
            currentSelectedSlot.classList.remove("square2selected");
            currentSelectedSlot.classList.add("square2");
            slotSelected = false
        }
    };

    request.open("GET", "/slot/" + currentSelectedIndex + "/setUnit/" + unitId, true);
    request.send();
}

function SelectSlot(element, slotID) {
    playClickSound();
    console.log(currentSelectedSlot)
    if (slotSelected){
        currentSelectedSlot.classList.remove("square2selected");
        currentSelectedSlot.classList.add("square2");
    }

    currentSelectedIndex = slotID
    currentSelectedSlot = element
    currentSelectedSlot.classList.remove("square2");
    currentSelectedSlot.classList.add("square2selected");
    slotSelected = true
}

function Return() {
    playClickSound();
    window.location.href = "mainMenu.html";
}

function playClickSound() {
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.currentTime = 0; 
    sound.play();
  }
}

function showPreview(imgSrc, event) {
  const preview = document.getElementById("zoomPreview");
  preview.src = imgSrc;
  preview.style.left = (event.pageX + 20) + "px";
  preview.style.top = (event.pageY - 20) + "px";
  preview.style.display = "block";
}

function hidePreview() {
  document.getElementById("zoomPreview").style.display = "none";
}