
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// player1_characters
		const player1_characters = this.add.container(16, -3);

		// player1
		const player1 = this.add.text(271, 130, "", {});
		player1.setStyle({ "fontFamily": "Roboto", "fontSize": "30px" });
		player1_characters.add(player1);

		// unit1
		const unit1 = this.add.container(0, 0);
		player1_characters.add(unit1);

		// sprite_1
		const sprite_1 = this.add.sprite(414, 382, "_MISSING");
		unit1.add(sprite_1);

		// player1_1hp
		const player1_1hp = new PrefabHpTag(this, 414, 422);
		unit1.add(player1_1hp);

		// unit2
		const unit2 = this.add.container(0, 0);
		player1_characters.add(unit2);

		// sprite_2
		const sprite_2 = this.add.sprite(275, 237, "_MISSING");
		unit2.add(sprite_2);

		// player1_2hp
		const player1_2hp = new PrefabHpTag(this, 275, 276);
		unit2.add(player1_2hp);

		// unit3
		const unit3 = this.add.container(0, 0);
		player1_characters.add(unit3);

		// sprite_3
		const sprite_3 = this.add.sprite(278, 514, "_MISSING");
		unit3.add(sprite_3);

		// player1_3hp
		const player1_3hp = new PrefabHpTag(this, 280, 554);
		unit3.add(player1_3hp);

		// unit4
		const unit4 = this.add.container(0, 0);
		player1_characters.add(unit4);

		// sprite_4
		const sprite_4 = this.add.sprite(135, 381, "_MISSING");
		unit4.add(sprite_4);

		// player1_4hp
		const player1_4hp = new PrefabHpTag(this, 135, 423);
		unit4.add(player1_4hp);

		// player2_characters
		const player2_characters = this.add.container(-535, 134);

		// player2
		const player2 = this.add.text(1531.56103515625, -7.98968505859375, "", {});
		player2.setStyle({ "fontFamily": "Roboto", "fontSize": "30px" });
		player2_characters.add(player2);

		// unit5
		const unit5 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit5);

		// sprite_5
		const sprite_5 = this.add.sprite(828.9999389648438, 381, "_MISSING");
		unit5.add(sprite_5);

		// player2_1hp
		const player2_1hp = new PrefabHpTag(this, 833.9999389648438, 419);
		unit5.add(player2_1hp);

		// unit6
		const unit6 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit6);

		// sprite_6
		const sprite_6 = this.add.sprite(980.9999389648438, 239, "_MISSING");
		unit6.add(sprite_6);

		// player2_2hp
		const player2_2hp = new PrefabHpTag(this, 982.9999389648438, 277);
		unit6.add(player2_2hp);

		// unit7
		const unit7 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit7);

		// sprite_7
		const sprite_7 = this.add.sprite(1113, 385, "_MISSING");
		unit7.add(sprite_7);

		// player2_3hp
		const player2_3hp = new PrefabHpTag(this, 977.9999389648438, 556);
		unit7.add(player2_3hp);

		// unit8
		const unit8 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit8);

		// sprite_8
		const sprite_8 = this.add.sprite(971.9999389648438, 517, "_MISSING");
		unit8.add(sprite_8);

		// player2_4hp
		const player2_4hp = new PrefabHpTag(this, 1116, 423);
		unit8.add(player2_4hp);

		this.player1 = player1;
		this.sprite_1 = sprite_1;
		this.player1_1hp = player1_1hp;
		this.unit1 = unit1;
		this.sprite_2 = sprite_2;
		this.player1_2hp = player1_2hp;
		this.unit2 = unit2;
		this.sprite_3 = sprite_3;
		this.player1_3hp = player1_3hp;
		this.unit3 = unit3;
		this.sprite_4 = sprite_4;
		this.player1_4hp = player1_4hp;
		this.unit4 = unit4;
		this.player1_characters = player1_characters;
		this.player2 = player2;
		this.sprite_5 = sprite_5;
		this.player2_1hp = player2_1hp;
		this.unit5 = unit5;
		this.sprite_6 = sprite_6;
		this.player2_2hp = player2_2hp;
		this.unit6 = unit6;
		this.sprite_7 = sprite_7;
		this.player2_3hp = player2_3hp;
		this.unit7 = unit7;
		this.sprite_8 = sprite_8;
		this.player2_4hp = player2_4hp;
		this.unit8 = unit8;
		this.player2_characters = player2_characters;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	player1;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_1;
	/** @type {PrefabHpTag} */
	player1_1hp;
	/** @type {Phaser.GameObjects.Container} */
	unit1;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_2;
	/** @type {PrefabHpTag} */
	player1_2hp;
	/** @type {Phaser.GameObjects.Container} */
	unit2;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_3;
	/** @type {PrefabHpTag} */
	player1_3hp;
	/** @type {Phaser.GameObjects.Container} */
	unit3;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_4;
	/** @type {PrefabHpTag} */
	player1_4hp;
	/** @type {Phaser.GameObjects.Container} */
	unit4;
	/** @type {Phaser.GameObjects.Container} */
	player1_characters;
	/** @type {Phaser.GameObjects.Text} */
	player2;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_5;
	/** @type {PrefabHpTag} */
	player2_1hp;
	/** @type {Phaser.GameObjects.Container} */
	unit5;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_6;
	/** @type {PrefabHpTag} */
	player2_2hp;
	/** @type {Phaser.GameObjects.Container} */
	unit6;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_7;
	/** @type {PrefabHpTag} */
	player2_3hp;
	/** @type {Phaser.GameObjects.Container} */
	unit7;
	/** @type {Phaser.GameObjects.Sprite} */
	sprite_8;
	/** @type {PrefabHpTag} */
	player2_4hp;
	/** @type {Phaser.GameObjects.Container} */
	unit8;
	/** @type {Phaser.GameObjects.Container} */
	player2_characters;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();

		this.GetMatchState()
    	// setInterval(GetMatchState, 3000)
	}

	GetMatchState() {
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

	UpdateMatchUI(gameState) {

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

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
