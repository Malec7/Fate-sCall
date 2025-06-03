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
                document.getElementById("history").innerHTML = "match history: " + data.history
            }
            if (this.status == 200) {
                document.getElementById("username").innerHTML = "username: " + data.username
                document.getElementById("history").innerHTML = "match history: " + data.history
                document.getElementById("bigsqr").innerHTML = `<img src="./Img/blessings/b${data.blessing.blessing_id}.png"  alt="${data.blessing.blessing_name}" style="width: 100%; height: 100%; object-fit: cover;" />`;

                data.units.forEach(unit => {
                    var element = document.getElementById("slot" + unit.slot_id)
                    element.innerHTML = `<img src="./Img/units/${unit.unit_id}.png" alt="${unit.unit_name}"  style="width: 100%; height: 100%; object-fit: cover;" />`;
                    
                })
            }
        }
    }

    request.open("GET", "/getTeamState", true);

    request.send();
}

function selectBlessing(blessingId){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            console.log(data)

            const blessingName = data.blessing_name
            document.getElementById("bigsqr").innerHTML = `<img src="./Img/blessings/b${blessingId}.png"alt="${blessingName}"style="width: 100%; height: 100%; object-fit: cover;" />`;
            // if (this.status == 200) {
            //     var unitData = JSON.parse(this.responseText);
            //     var unitName = unitData.unit_name;
            //     var blessingData = JSON.parse(this.responseText);
            //     var blessingName = blessingData.blessing_name;

            //     if (document.getElementById("sqr18").value === "") {
            //         document.getElementById("sqr18").value = unitName;
            //     } else if (document.getElementById("sqr16").value === "") {
            //         document.getElementById("sqr16").value = unitName;
            //     } else if (document.getElementById("sqr19").value === "") {
            //         document.getElementById("sqr19").value = unitName;
            //     } else if (document.getElementById("sqr17").value === "") {
            //         document.getElementById("sqr17").value = unitName;
            //     } else if (document.getElementById("bigsqr").value === "") {
            //         document.getElementById("bigsqr").value = blessingName;
            //     } else {
            //         alert("All slots are filled!");
            //     }
            // } else {
            //     console.error("Error getting units/blessing details:", this.statusText);
            // }
        }
    };

    request.open("GET", "/setBlessing/" + blessingId, true);
    request.send();
}

function selectUnit(unitId) {
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
            currentSelectedSlot.innerHTML = ` <img src="./Img/units/${data.unit_id}.png" alt="${data.unit_name}" style="width: 100%; height: 100%; object-fit: cover;" />`;
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
    window.location.href = "mainMenu.html";
}