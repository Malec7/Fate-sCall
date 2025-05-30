// You can write more code here
var selectedUnit = null;
var selectedTarget = null;
let attackingUnits = [];
/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
        this.currentTurn = null;
        this.currentMatchState = null;
        this.attackingUnits = [];
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// player1_characters
		const player1_characters = this.add.container(16, -3);

		// unit_4
		const unit_4 = new UnitPrefab(this, 98, 381);
		player1_characters.add(unit_4);

		// unit_3
		const unit_3 = new UnitPrefab(this, 288, 516);
		player1_characters.add(unit_3);

		// unit_2
		const unit_2 = new UnitPrefab(this, 288, 246);
		player1_characters.add(unit_2);

		// unit_1
		const unit_1 = new UnitPrefab(this, 440, 381);
		player1_characters.add(unit_1);

		// player1
		const player1 = this.add.text(271, 157, "", {});
		player1.setStyle({ "fontFamily": "Arial", "fontSize": "30px" });
		player1_characters.add(player1);

		// player2_characters
		const player2_characters = this.add.container(-535, 134);

		// unit_5
		const unit_5 = new UnitPrefab(this, 1371, 247);
		player2_characters.add(unit_5);

		// unit_6
		const unit_6 = new UnitPrefab(this, 1523, 112);
		player2_characters.add(unit_6);

		// unit_8
		const unit_8 = new UnitPrefab(this, 1675, 247);
		player2_characters.add(unit_8);

		// unit_7
		const unit_7 = new UnitPrefab(this, 1523, 379);
		player2_characters.add(unit_7);

		// player2
		const player2 = this.add.text(1531.56103515625, -7.98968505859375, "", {});
		player2.setStyle({ "fontFamily": "Arial", "fontSize": "29px" });
		player2_characters.add(player2);

		// turn
		const turn = this.add.text(570, 81, "", {});
		turn.text = "Player";
		turn.setStyle({ "fontFamily": "Arial", "fontSize": "25px" });

		this.unit_4 = unit_4;
		this.unit_3 = unit_3;
		this.unit_2 = unit_2;
		this.unit_1 = unit_1;
		this.player1 = player1;
		this.player1_characters = player1_characters;
		this.unit_5 = unit_5;
		this.unit_6 = unit_6;
		this.unit_8 = unit_8;
		this.unit_7 = unit_7;
		this.player2 = player2;
		this.player2_characters = player2_characters;
		this.turn = turn;

		this.events.emit("scene-awake");
	}

	/** @type {UnitPrefab} */
	unit_4;
	/** @type {UnitPrefab} */
	unit_3;
	/** @type {UnitPrefab} */
	unit_2;
	/** @type {UnitPrefab} */
	unit_1;
	/** @type {Phaser.GameObjects.Text} */
	player1;
	/** @type {Phaser.GameObjects.Container} */
	player1_characters;
	/** @type {UnitPrefab} */
	unit_5;
	/** @type {UnitPrefab} */
	unit_6;
	/** @type {UnitPrefab} */
	unit_8;
	/** @type {UnitPrefab} */
	unit_7;
	/** @type {Phaser.GameObjects.Text} */
	player2;
	/** @type {Phaser.GameObjects.Container} */
	player2_characters;
	/** @type {Phaser.GameObjects.Text} */
	turn;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();

		this.GetMatchState()
    	setInterval(() => {
			this.GetMatchState();
		}, 3000)

		this.unit_1.unitID = 1;
		this.unit_1["sprite"].on('pointerdown', () => {
			this.UnitClick(1);
		});

		this.unit_2.unitID = 2;
		this.unit_2["sprite"].on('pointerdown', () => {
			this.UnitClick(2);
		});

		this.unit_3.unitID = 3;
		this.unit_3["sprite"].on('pointerdown', () => {
			this.UnitClick(3);
		});

		this.unit_4.unitID = 4;
		this.unit_4["sprite"].on('pointerdown', () => {
			this.UnitClick(4);
		});

		this.unit_5.unitID = 5;
		this.unit_5["sprite"].on('pointerdown', () => {
			this.UnitClick(5);
		});

		this.unit_6.unitID = 6;
		this.unit_6["sprite"].on('pointerdown', () => {
			this.UnitClick(6);
		});

		this.unit_7.unitID = 7;
		this.unit_7["sprite"].on('pointerdown', () => {
			this.UnitClick(7);
		});

		this.unit_8.unitID = 8;
		this.unit_8["sprite"].on('pointerdown', () => {
			this.UnitClick(8);
		});
	}

	UnitClick(unitNumber) {
		console.log("Clicked on unit " + unitNumber);
		var unit = this[`unit_${unitNumber}`];

		if (unit.isPlayerUnit) {
			console.log("This is a player unit.");
			var unitSprite = unit['sprite']

			if (selectedUnit === unit){
				console.log("Unit already selected, deselecting.");
				unitSprite.clearTint()
				selectedUnit = null;
			}else if (selectedUnit && selectedUnit !== unit) {
				console.log("Deselecting previous unit and selecting new one.");
				selectedUnit['sprite'].clearTint();
				selectedUnit = unit;
				unitSprite.setTint(0xff0000); // Change color to red on click
			} else {
				console.log("Selecting new unit.");
				selectedUnit = unit;
				unitSprite.setTint(0xff0000); // Change color to red on click
			}
		}else{
			if (!selectedUnit){
				console.log("No unit selected, cannot target.");
				return;
			}

			console.log("Attack " + unitNumber + " with selected unit.");
			this.Attack(selectedUnit.unitID, unitNumber)
		}		
	}



	GetMatchState() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                var data = JSON.parse(request.responseText);
                console.log(data);
                if (request.status == 401) {
                    window.location.href = "/login.html";
                    return;
                }
                if (request.status == 200) {
                    this.UpdateMatchUI(data.game_state);
                    this.currentMatchState = data.game_state;
                } else {
                    console.error(data.message);
                }
            }
        };
        request.open("GET", "/getMatchState", true);
		request.send();
    }

	UpdateMatchUI(gameState) {
        // Update Player 1 units
		console.log(gameState)
        gameState.player_units.player1.forEach((unit, index) => {
			console.log(unit)
			var slotID = unit.slot_id - 1
			var container = this.player1_characters.list[slotID]
			var characterSprite = container.list[0]
			var characterText = container.list[1]

			// characterText.text = unit.unit_id
			characterSprite.setTexture("dino")
			container["hp"].text = "HP: " + unit.curr_unit_hp;
			console.log(container)
            container.setVisible(unit.curr_unit_hp > 0);
			container.isPlayerUnit = unit.player_unit
            // if (unit.curr_unit_hp > 0) {
            //     container.setInteractive().on('pointerdown', () => this.Attack(unit.player_unit_id));
            // }
        });

        // Update Player 2 units
        gameState.player_units.player2.forEach((unit, index) => {
			console.log(unit)
			var slotID = unit.slot_id - 1
			var container = this.player2_characters.list[slotID]
			var characterSprite = container.list[0]
			var characterText = container.list[1]

			// characterText.text = unit.unit_id
			characterSprite.setTexture("dino")
			container["hp"].text = "HP: " + unit.curr_unit_hp;
            container.setVisible(unit.curr_unit_hp > 0);
			container.isPlayerUnit = unit.player_unit
            // if (unit.curr_unit_hp > 0) {
            //     container.setInteractive().on('pointerdown', () => this.Attack(unit.player_unit_id));
            // }
        });
        // Check for game over
        if (gameState.game_state === 1) {
            alert("Game over! Returning to main menu!");
            window.location.href = "/mainMenu.html"; 
            return;
        }
        console.log(`Current Turn: ${gameState.current_turn}`);
    }

	Attack(unitId, targetId) {
		console.log("Attacking with unit " + unitId + " on target " + targetId);
		return

		const isPlayer1Turn = this.currentMatchState.current_turn === "Player 1";
		const validUnits = isPlayer1Turn ? this.currentMatchState.player_units.player1 : this.currentMatchState.player_units.player2;

		// Check if the unit is from the current player's team
		if (!validUnits.some(unit => unit.player_unit_id === unitId && unit.curr_unit_hp > 0)) {
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

		// Set up targeting for enemy units
		const enemyUnits = isPlayer1Turn ? this.currentMatchState.player_units.player2 : this.currentMatchState.player_units.player1;

		enemyUnits.forEach((enemyUnit, index) => {
			const targetUnit = this[`unit${index + (isPlayer1Turn ? 5 : 1)}`];
			// targetUnit.setInteractive().on('pointerdown', () => {
			// 	this.TargetClick(enemyUnit.player_unit_id, unitId);
			// });
		});

		// Check if the target is valid
		const validTarget = enemyUnits.find(unit => unit.player_unit_id == targetId && unit.curr_unit_hp > 0);
		if (!validTarget) {
			alert("Invalid target. Choose an enemy alive.");
			return;
		}

		// Add the attacking unit and target to the list
		attackingUnits.push({ unit_id: unitId, target_id: targetId });

		// alterar
		var element = this("attackers");
		element.innerHTML = "";
		attackingUnits.forEach(attacker => {
			element.innerHTML += attacker.unit_id + " --> " + attacker.target_id + "<br/>";
		});

		if (attackingUnits.length <= 2 && attackingUnits.length > 0) {
			element.innerHTML += "<button onclick='SendAttack()'>Attack!</button>";
		}

		selectedUnit = null;
		selectedTarget = null;
	}

	SendAttack() {
		const request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				const data = JSON.parse(request.responseText);
				console.log(data);
				if (data.message === "Game Over") {
					alert(`${data.winner} wins!`);
					alert(`${data.loser} loses!`);
					window.location.href = "/mainMenu.html";
				} else {
					this.attackingUnits = [];
				}
			}
		};

		request.open("PUT", "/attack", true);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify({ attackingUnits: this.attackingUnits }));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here