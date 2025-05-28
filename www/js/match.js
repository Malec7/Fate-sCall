var currentTurn

function UpdateTurnIndicator(turn) {
    currentTurn = turn
    const circle = document.getElementById("turnIndicator");
    if (!circle){
        console.log("turnIndicator don't exist");
        return;
    }

    if (turn === "Player 1") {
        circle.style.backgroundColor = "blue";
    } else if (turn === "Player 2") {
        circle.style.backgroundColor = "red";
    } else {
        circle.style.backgroundColor = "gray";
    }
}

function GetMatchState() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            console.log(data);

            if (this.status == 401) {
                window.location.href = "/login.html";
                return;
            }

            if (this.status == 200) {
                // Update the UI based on the match state
                UpdateMatchUI(data.game_state);
                // Store the current match state
                currentMatchState = data.game_state;
            } else {
                console.error(data.message);
            }
        }
    };

    request.open("GET", "/getMatchState", true);
    request.send();
}

function UpdateMatchUI(gameState) {
    // Clear previous unit states
    for (let i = 1; i <= 8; i++) {
        document.getElementById(`sqr${i}`).innerHTML = ""; // Clear squares
        document.getElementById(`sqr${i}`).onclick = null; // Remove previous onclick events
    }

    // Update squares for Player 1
    gameState.player_units.player1.forEach((unit, index) => {
        const square = document.getElementById(`sqr${index + 1}`);
        square.innerHTML = `ID: ${unit.player_unit_id} <br> HP: ${unit.curr_unit_hp} <br> ATK: ${unit.curr_unit_atk}`;
        square.style.backgroundColor = unit.curr_unit_hp > 0 ? "lightgreen" : "lightcoral"; // Green if alive, red if dead

        // Add onclick event for attacking
        if (unit.curr_unit_hp > 0) {
            square.onclick = () => Attack(unit.player_unit_id);
        }
    });

    // Update squares for Player 2
    gameState.player_units.player2.forEach((unit, index) => {
        const square = document.getElementById(`sqr${index + 5}`);
        square.innerHTML = `ID: ${unit.player_unit_id} <br> HP: ${unit.curr_unit_hp} <br> ATK: ${unit.curr_unit_atk}`;
        square.style.backgroundColor = unit.curr_unit_hp > 0 ? "lightgreen" : "lightcoral"; // Green if alive, red if dead

        if (unit.curr_unit_hp > 0) {
            square.onclick = () => Attack(unit.player_unit_id);
        }
    });

    //When Game Over go back to the main menu 
    if (gameState.game_state === 1) {
        alert("Game over! Returning to main menu!");
        window.location.href = "/mainMenu.html"; 
        return;
    }


    // Display whose turn it is
    console.log(`Current Turn: ${gameState.current_turn}`);
    UpdateTurnIndicator(gameState.current_turn);
}

let attackingUnits = []; // Array to hold the attacking units and their targets

function Attack(unitId) {
    if ((currentMatchState.current_turn === 1 && req.session.playerID !== currentMatchState.player_units.player1[0].player_id) ||
        (currentMatchState.current_turn === 2 && req.session.playerID !== currentMatchState.player_units.player2[0].player_id)) {
        alert("It's not your turn!");
        return;
    }

        // Check if the unit is from the current player's team
        let validUnit = false;
        if (currentMatchState.current_turn === "Player 1") {
            validUnit = currentMatchState.player_units.player1.some(unit => unit.player_unit_id === unitId && unit.curr_unit_hp > 0);
        } else if (currentMatchState.current_turn === "Player 2") {
            validUnit = currentMatchState.player_units.player2.some(unit => unit.player_unit_id === unitId && unit.curr_unit_hp > 0);
        }
    
        if (!validUnit) {
            alert("You can only attack with your own units!");
            return;
        }
    

    // Check if the unit is already selected
    if (attackingUnits.some(unit => unit.unit_id === unitId)) {
        alert("This unit has already chosen a target.");
        return;
    }

    if (attackingUnits.length >= 2) {
        alert("Only choose 2 units.");
        return;
    }

    // Get the target unit from the user
    const targetId = prompt("Enter the ID of the enemy unit to attack:");

    if (!targetId) {
        alert("No target selected.");
        return;
    }

    const isPlayer1Turn = currentMatchState.current_turn === "Player 1";

    const enemyUnits = isPlayer1Turn
    ? currentMatchState.player_units.player2
    : currentMatchState.player_units.player1;

    const validTarget = enemyUnits.find(unit => unit.player_unit_id == targetId && unit.curr_unit_hp > 0);

    

    if (!validTarget) {
    alert("Invalid target. Choose an enemy alive.");
    return;
     }

    // Check if the target is alive
    // if (!IsTargetAlive(targetId)) {
    //     alert("Cannot target a dead enemy.");
    //     return;
    // }

    // Add the attacking unit and its target to the array
    attackingUnits.push({ unit_id: unitId, target_id: targetId });

    // Check if all 2/1 units have chosen a target
    var element = document.getElementById("attackers");
    element.innerHTML = "";
    attackingUnits.forEach(attacker => {
        element.innerHTML += attacker.unit_id + " --> " + attacker.target_id + "<br/>"
    })
    if (attackingUnits.length <= 2 && attackingUnits.length > 0 ){
        element.innerHTML += "<button onclick='SendAttack()'>Attack!</button>"
    }
}

function SendAttack(){
    console.log("Called SendAttack()")
    var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log("Got answer from SendAttack()")
                var data = JSON.parse(this.responseText);
                console.log(data);

                if (data.message === "Game Over") {
                alert(`${data.winner} wins!`);
                alert(`${data.loser} loses!`);
                window.location.href = "/mainMenu.html";
            }
              
            }
        };

        request.open("PUT", "/attack", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ attackingUnits }));
}

function IsTargetAlive(targetId) {
    // This function should check if the target is alive
    console.log(currentMatchState)

    currentMatchState.player_units.player1.forEach(unit => {
        console.log(unit.unit_id + " == " + targetId)
        if (unit.unit_id == targetId)
            return true
    });

    currentMatchState.player_units.player2.forEach(unit => {
        console.log(unit.unit_id + " == " + targetId)
        if (unit.unit_id == targetId)
            return true
    });
    // return currentMatchState.player_units.player2.some(unit => unit.unit_id == targetId && unit.curr_unit_hp > 0);
}

function AldrabrarIstoTudo(){
    Attack(5);
    Attack(6);
    Attack(7);
    Attack(8);
}