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

		// game_background_3
		const game_background_3 = this.add.image(646, 351, "game_background_3");
		game_background_3.scaleX = 0.33820138110542974;
		game_background_3.scaleY = 0.34056805027904374;

		// player1_characters
		const player1_characters = this.add.container(16, -3);

		// unit_4
		const unit_4 = new UnitPrefab(this, 250, 381);
		player1_characters.add(unit_4);

		// unit_3
		const unit_3 = new UnitPrefab(this, 364, 462);
		player1_characters.add(unit_3);

		// unit_2
		const unit_2 = new UnitPrefab(this, 364, 300);
		player1_characters.add(unit_2);

		// unit_1
		const unit_1 = new UnitPrefab(this, 516, 381);
		player1_characters.add(unit_1);

		// player1
		const player1 = this.add.text(271, 157, "", {});
		player1.setStyle({ "fontFamily": "Arial", "fontSize": "30px" });
		player1_characters.add(player1);

		// player2_characters
		const player2_characters = this.add.container(-535, 134);

		// unit_5
		const unit_5 = new UnitPrefab(this, 1257, 244);
		player2_characters.add(unit_5);

		// unit_6
		const unit_6 = new UnitPrefab(this, 1409, 163);
		player2_characters.add(unit_6);

		// unit_8
		const unit_8 = new UnitPrefab(this, 1523, 244);
		player2_characters.add(unit_8);

		// unit_7
		const unit_7 = new UnitPrefab(this, 1409, 325);
		player2_characters.add(unit_7);

		// player2
		const player2 = this.add.text(1531.56103515625, -7.98968505859375, "", {});
		player2.setStyle({ "fontFamily": "Arial", "fontSize": "29px" });
		player2_characters.add(player2);

		// turn
		const turn = this.add.text(570, 27, "", {});
		turn.text = "Player";
		turn.setStyle({ "fontFamily": "Arial", "fontSize": "25px" });

		// attackInfo
		const attackInfo = this.add.text(570, 81, "", {});
		attackInfo.scaleX = 0.8;
		attackInfo.text = "Selected Attacks:";
		attackInfo.setStyle({ "backgroundColor": "#ffffffff", "color": "#eb0202ff", "fontFamily": "Arial", "fontSize": "20px", "fontStyle": "bold", "stroke": "#ffffffff" });

		// attackButton
		const attackButton = this.add.text(570, 157, "", {});
		attackButton.scaleX = 0.6184652628838178;
		attackButton.scaleY = 0.8260079474155231;
		attackButton.text = "Attack!";
		attackButton.setStyle({ "backgroundColor": "#ff0000", "fontFamily": "Arial", "fontSize": "24px", "fontStyle": "bold" });
		attackButton.setPadding({"left":10,"top":5,"right":10,"bottom":5});

		// player1_user
		const player1_user = this.add.text(38, 27, "", {});
		player1_user.scaleY = 2;
		player1_user.text = "P1\n";
		player1_user.setStyle({ "fontFamily": "Arial", "fontStyle": "bold" });

		// player2_user
		const player2_user = this.add.text(1070, 27, "", {});
		player2_user.scaleY = 2;
		player2_user.text = "P2\n";
		player2_user.setStyle({ "fontFamily": "Arial", "fontStyle": "bold" });

		// clearButton
		const clearButton = this.add.text(630, 157, "", {});
		clearButton.scaleX = 0.6184652628838178;
		clearButton.scaleY = 0.8260079474155231;
		clearButton.text = "Clear!";
		clearButton.setStyle({ "backgroundColor": "#cca838ff", "fontFamily": "Arial", "fontSize": "24px", "fontStyle": "bold" });
		clearButton.setPadding({"left":10,"top":5,"right":10,"bottom":5});

		// unit_4 (prefab fields)
		unit_4.unitID = 4;

		// unit_3 (prefab fields)
		unit_3.unitID = 3;

		// unit_2 (prefab fields)
		unit_2.unitID = 2;

		// unit_1 (prefab fields)
		unit_1.unitID = 1;

		// unit_5 (prefab fields)
		unit_5.unitID = 5;

		// unit_6 (prefab fields)
		unit_6.unitID = 6;

		// unit_8 (prefab fields)
		unit_8.unitID = 8;

		// unit_7 (prefab fields)
		unit_7.unitID = 7;

		this.game_background_3 = game_background_3;
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
		this.attackInfo = attackInfo;
		this.attackButton = attackButton;
		this.player1_user = player1_user;
		this.player2_user = player2_user;
		this.clearButton = clearButton;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	game_background_3;
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
	/** @type {Phaser.GameObjects.Text} */
	attackInfo;
	/** @type {Phaser.GameObjects.Text} */
	attackButton;
	/** @type {Phaser.GameObjects.Text} */
	player1_user;
	/** @type {Phaser.GameObjects.Text} */
	player2_user;
	/** @type {Phaser.GameObjects.Text} */
	clearButton;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();

		this.sound.play('arena_music', {loop: true, volume: 0.5})

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

		this.attackButton.setInteractive();

        this.attackButton.on("pointerdown", () => {
	    this.SendAttack();
        });

        this.attackButton.setVisible(false);

		this.clearButton.setInteractive();
        this.clearButton.on("pointerdown", () => {
	    this.ClearSelections();
        });

		this.clearButton.setVisible(false);
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
			unitSprite.setTint(0xff0000);
		} else {
			console.log("Selecting new unit.");
			selectedUnit = unit;
			unitSprite.setTint(0xff0000);
		}
	}else{
		if (!selectedUnit){
			console.log("No unit selected, cannot target.");
			return;
		}

		console.log("Attack " + unitNumber + " with selected unit.");
		this.Attack(selectedUnit.player_unit_id, unit.player_unit_id);
	} 		
}

GetMatchState() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			var data = JSON.parse(request.responseText);
			console.log("data--------")
			console.log(data)

			if (request.status == 401) {
				window.location.href = "/login.html";
				return;
			}

			if (request.status == 200) {
				const gameState = data.game_state;

				this.currentPlayerId = gameState.player_id; 
				this.UpdateMatchUI(gameState);
				this.currentMatchState = gameState;

			this.player1_user.setText(`Player 1: ${gameState.player1_username}`);
	        this.player2_user.setText(`Player 2: ${gameState.player2_username}`);

				if (gameState.game_status === 1) {

					const winnerId = gameState.game_winner;


					if (winnerId === this.currentPlayerId) {
						alert("You win!");
					} else {
						alert("You lost!");
					}
					window.location.href = "/mainMenu.html";
					return;
				}
			} else {
				console.error(data.message);
			}
		}
	};
	request.open("GET", "/getMatchState", true);
	request.send();
}

UpdateMatchUI(gameState) {
	console.log(gameState)
	gameState.player_units.player1.forEach((unit, index) => {
		var slotID = unit.slot_id - 1
		var container = this.player1_characters.list[slotID]
		var characterSprite = container.list[0]
		var characterText = container.list[1]

	 	let animKey = "";
		if (unit.curr_unit_hp <= 0) {
			animKey = `Unit_${unit.unit_id}_dead`;
		} else if (container.prevHP && unit.curr_unit_hp < container.prevHP) {
			animKey = `Unit_${unit.unit_id}_hurt`;
		} else if (container.wasJustAttacked) {
			animKey = `Unit_${unit.unit_id}_attack`;
		} else {
			animKey = `Unit_${unit.unit_id}_idle`;
		}

		if (this.anims.exists(animKey)) {
			characterSprite.play(animKey);
			characterSprite.setScale(2);
     } else {
		console.warn(`Missing animation for unit_id=${unit.unit_id}:`, animKey);
		characterSprite.setTexture("dino"); 
		characterSprite.setScale(1);
  	}

		container["hp"].text = "HP: " + unit.curr_unit_hp;
		container["atk"].text = "ATK: " + unit.curr_unit_atk;
		container["name"].text = unit.unit_name;
		container.setVisible(unit.curr_unit_hp >= 0);
		container.isPlayerUnit = unit.player_unit;
		container.player_unit_id = unit.player_unit_id;
		container.prevHP = unit.curr_unit_hp;
		container.wasJustAttacked = false;
	});

	gameState.player_units.player2.forEach((unit, index) => {
		var slotID = unit.slot_id - 1
		var container = this.player2_characters.list[slotID]
		var characterSprite = container.list[0]
		var characterText = container.list[1]

	 	let animKey = "";
		if (unit.curr_unit_hp <= 0) {
			animKey = `Unit_${unit.unit_id}_dead`;
		} else if (container.prevHP && unit.curr_unit_hp < container.prevHP) {
			animKey = `Unit_${unit.unit_id}_hurt`;
		} else if (container.wasJustAttacked) {
			animKey = `Unit_${unit.unit_id}_attack`;
		} else {
			animKey = `Unit_${unit.unit_id}_idle`;
		}

		if (this.anims.exists(animKey)) {
			characterSprite.play(animKey);
			characterSprite.setScale(-2, 2);
      } else {
	  console.warn(`Missing animation for unit_id=${unit.unit_id}:`, animKey);
	  characterSprite.setTexture("dino"); 
}

		container["hp"].text = "HP: " + unit.curr_unit_hp;
		container["atk"].text = "ATK: " + unit.curr_unit_atk;
		container["name"].text = unit.unit_name;
		container.setVisible(unit.curr_unit_hp >= 0);
		container.isPlayerUnit = unit.player_unit;
		container.player_unit_id = unit.player_unit_id;
		container.prevHP = unit.curr_unit_hp;
		container.wasJustAttacked = false;
	});

	if (gameState.game_state === 1) {
		alert("Game over! Returning to main menu!");
		window.location.href = "/mainMenu.html"; 
		return;
	}
	this.turn.setText(gameState.current_turn === "Player 1" ? "Player 1's Turn" : "Player 2's Turn");
	console.log(`Current Turn: ${gameState.current_turn}`);

}

Attack(unitId, targetId) {
	console.log(`Attacking from ${unitId} → ${targetId}`);

	const isPlayer1Turn = this.currentMatchState.current_turn === "Player 1";
	const validUnits = isPlayer1Turn ? this.currentMatchState.player_units.player1 : this.currentMatchState.player_units.player2;

	console.log("Current Turn:", this.currentMatchState.current_turn);
	console.log("Valid Units for this player:", validUnits.map(u => `${u.player_unit_id} (HP: ${u.curr_unit_hp})`));
	console.log("Unit trying to attack:", unitId);

	if (!validUnits.some(unit => unit.player_unit_id === unitId && unit.curr_unit_hp > 0)) {
		alert("You can only attack with your own living units!");
		return;
	}

	if (this.attackingUnits.some(entry => entry.unit_id === unitId)) {
		alert("This unit has already been assigned a target.");
		return;
	}

	if (this.attackingUnits.length >= 2) {
		alert("You can only choose 2 units per turn.");
		return;
	}

	const enemyUnits = isPlayer1Turn ? this.currentMatchState.player_units.player2 : this.currentMatchState.player_units.player1;
	const validTarget = enemyUnits.find(unit => unit.player_unit_id === targetId && unit.curr_unit_hp > 0);
	if (!validTarget) {
		alert("Invalid target. Choose a living enemy.");
		return;
	}

	this.attackingUnits.push({ unit_id: unitId, target_id: targetId });
	this.UpdateAttackDisplay();

	selectedUnit.sprite.clearTint();
	selectedUnit = null;
}

  UpdateAttackDisplay() {
	let text = "Selected Attacks:\n";

	this.attackingUnits.forEach(entry => {
		let attackerName = "Unknown";
		let targetName = "Unknown";

		// Search in both teams
		const allUnits = [
			...this.currentMatchState.player_units.player1,
			...this.currentMatchState.player_units.player2
		];

		const attacker = allUnits.find(u => u.player_unit_id === entry.unit_id);
		const target = allUnits.find(u => u.player_unit_id === entry.target_id);

		if (attacker) attackerName = attacker.unit_name;
		if (target) targetName = target.unit_name;

		text += `${attackerName} → ${targetName}\n`;
	});

	this.attackInfo.setText(text);

	if (this.attackingUnits.length >= 1) {
		this.attackButton.setVisible(true);
		this.clearButton.setVisible(true);
	}
}

ClearSelections() {
	this.attackingUnits = [];
	this.targetUnits = [];

	// Clear selected units for player 1 units
	for (let container of this.player1_characters.list) {
		if (container && container.list && container.list[0]) {
	       container.list[0].clearTint();
         }
	}

	// Clear selected units for player 2 units
	for (let container of this.player2_characters.list) {
		if (container && container.list && container.list[0]) {
	    container.list[0].clearTint();
        }
	}

	selectedUnit = null;
	selectedTarget = null;

	// Clear and hide buttons
	if (this.attackInfo) {
		this.attackInfo.setText("");
	}

	this.attackButton.setVisible(false);
	this.clearButton.setVisible(false);
}

    SendAttack() {
         
	for (let entry of this.attackingUnits) {
	for (let container of this.player1_characters.list) {
		if (container && container.player_unit_id === entry.unit_id) {
			container.wasJustAttacked = true;
		}
	}
	for (let container of this.player2_characters.list) {
		if (container && container.player_unit_id === entry.unit_id) {
		container.wasJustAttacked = true;
	    }
	  }
    }

	const request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState == 4) {
			const data = JSON.parse(request.responseText);
			console.log(data);

			this.CheckForGameOver()
		}
	};
	request.open("PUT", "/attack", true);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify({ attackingUnits: this.attackingUnits }));
}

CheckForGameOver() {
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
				this.attackInfo.setText("");
				this.attackButton.setVisible(false);
			}
		}
	};
	request.open("GET", "/gameOver", true);
	request.send();
}

/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here