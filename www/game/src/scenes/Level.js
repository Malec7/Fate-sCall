
// You can write more code here
var selectedUnit = null;
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

		// unit1
		const unit1 = this.add.container(0, 0);
		player1_characters.add(unit1);

		// sprite_1
		const sprite_1 = this.add.sprite(414, 384, "_MISSING");
		sprite_1.setInteractive(this.input.makePixelPerfect());
		unit1.add(sprite_1);

		// player1_1hp
		const player1_1hp = new PrefabHpTag(this, 414, 422);
		player1_1hp.setStyle({ "fontFamily": "Arial" });
		unit1.add(player1_1hp);

		// unit2
		const unit2 = this.add.container(0, 0);
		player1_characters.add(unit2);

		// sprite_2
		const sprite_2 = this.add.sprite(275, 237, "_MISSING");
		sprite_2.setInteractive(this.input.makePixelPerfect());
		unit2.add(sprite_2);

		// player1_2hp
		const player1_2hp = new PrefabHpTag(this, 275, 276);
		player1_2hp.setStyle({ "fontFamily": "Arial" });
		unit2.add(player1_2hp);

		// unit3
		const unit3 = this.add.container(0, 0);
		player1_characters.add(unit3);

		// sprite_3
		const sprite_3 = this.add.sprite(278, 514, "_MISSING");
		sprite_3.setInteractive(this.input.makePixelPerfect());
		sprite_3.playReverse("");
		unit3.add(sprite_3);

		// player1_3hp
		const player1_3hp = new PrefabHpTag(this, 280, 554);
		player1_3hp.setStyle({ "fontFamily": "Arial" });
		unit3.add(player1_3hp);

		// unit4
		const unit4 = this.add.container(0, 0);
		player1_characters.add(unit4);

		// sprite_4
		const sprite_4 = this.add.sprite(135, 381, "_MISSING");
		sprite_4.setInteractive(this.input.makePixelPerfect());
		unit4.add(sprite_4);

		// player1_4hp
		const player1_4hp = new PrefabHpTag(this, 135, 423);
		player1_4hp.setStyle({ "fontFamily": "Arial", "fontSize": "25px" });
		unit4.add(player1_4hp);

		// player1
		const player1 = this.add.text(271, 130, "", {});
		player1.setStyle({ "fontFamily": "Arial", "fontSize": "30px" });
		player1_characters.add(player1);

		// player2_characters
		const player2_characters = this.add.container(-535, 134);

		// unit5
		const unit5 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit5);

		// sprite_5
		const sprite_5 = this.add.sprite(828.9999389648438, 381, "_MISSING");
		sprite_5.setInteractive(this.input.makePixelPerfect());
		unit5.add(sprite_5);

		// player2_1hp
		const player2_1hp = new PrefabHpTag(this, 833.9999389648438, 419);
		player2_1hp.setStyle({ "fontFamily": "Arial" });
		unit5.add(player2_1hp);

		// unit6
		const unit6 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit6);

		// sprite_6
		const sprite_6 = this.add.sprite(980.9999389648438, 239, "_MISSING");
		sprite_6.setInteractive(this.input.makePixelPerfect());
		unit6.add(sprite_6);

		// player2_2hp
		const player2_2hp = new PrefabHpTag(this, 982.9999389648438, 277);
		player2_2hp.setStyle({ "fontFamily": "Arial" });
		unit6.add(player2_2hp);

		// unit7
		const unit7 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit7);

		// sprite_7
		const sprite_7 = this.add.sprite(1113, 385, "_MISSING");
		sprite_7.setInteractive(this.input.makePixelPerfect());
		unit7.add(sprite_7);

		// player2_3hp
		const player2_3hp = new PrefabHpTag(this, 977.9999389648438, 556);
		player2_3hp.setStyle({ "fontFamily": "Arial" });
		unit7.add(player2_3hp);

		// unit8
		const unit8 = this.add.container(550.5610961914062, -136.98968505859375);
		player2_characters.add(unit8);

		// sprite_8
		const sprite_8 = this.add.sprite(971.9999389648438, 517, "_MISSING");
		sprite_8.setInteractive(this.input.makePixelPerfect());
		unit8.add(sprite_8);

		// player2_4hp
		const player2_4hp = new PrefabHpTag(this, 1116, 423);
		player2_4hp.setStyle({ "fontFamily": "Arial" });
		unit8.add(player2_4hp);

		// player2
		const player2 = this.add.text(1531.56103515625, -7.98968505859375, "", {});
		player2.setStyle({ "fontFamily": "Arial", "fontSize": "29px" });
		player2_characters.add(player2);

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
		this.player1 = player1;
		this.player1_characters = player1_characters;
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
		this.player2 = player2;
		this.player2_characters = player2_characters;

		this.events.emit("scene-awake");
	}

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
	/** @type {Phaser.GameObjects.Text} */
	player1;
	/** @type {Phaser.GameObjects.Container} */
	player1_characters;
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
	/** @type {Phaser.GameObjects.Text} */
	player2;
	/** @type {Phaser.GameObjects.Container} */
	player2_characters;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();

		this.GetMatchState()
    	setInterval(() => {
			this.GetMatchState();
		}, 3000)

		this.sprite_1.on('pointerdown', () => {
			this.UnitClick(1);
		});
		this.sprite_2.on('pointerdown', () => {
			this.UnitClick(2);
		});
		this.sprite_3.on('pointerdown', () => {
			this.UnitClick(3);
		});
		this.sprite_4.on('pointerdown', () => {
			this.UnitClick(4);
		});
		this.sprite_5.on('pointerdown', () => {
			this.UnitClick(5);
		});
		this.sprite_6.on('pointerdown', () => {
			this.UnitClick(6);
		});
		this.sprite_7.on('pointerdown', () => {
			this.UnitClick(7);
		});
		this.sprite_8.on('pointerdown', () => {
			this.UnitClick(8);
		});
	}

	UnitClick(unitNumber) {

		console.log("Clicked on unit " + unitNumber);
		var unit = this[`unit${unitNumber}`];

		if (selectedUnit && selectedUnit !== unit) {
			var oldUnitSprite = selectedUnit.list[0];
			oldUnitSprite.setTint(0xffffff); // Reset color to white
		}

		selectedUnit = unit;
		var unitSprite = unit.list[0];
		unitSprite.setTint(0xff0000); // Change color to red on click
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
        gameState.player_units.player1.forEach((unit, index) => {
			console.log(unit)
			var slotID = unit.slot_id - 1
			var container = this.player1_characters.list[slotID]
			var characterSprite = container.list[0]
			var characterText = container.list[1]

			// characterText.text = unit.unit_id
			characterSprite.setTexture("dino")
            this[`player1_${index + 1}hp`].setText(`HP: ${unit.curr_unit_hp}`);
			var unitContainer = this[`unit${index + 1}`];
            unitContainer.setVisible(unit.curr_unit_hp > 0);
            if (unit.curr_unit_hp > 0) {
                unitContainer.setInteractive().on('pointerdown', () => this.Attack(unit.player_unit_id));
            }
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
            this[`player2_${index + 1}hp`].setText(`HP: ${unit.curr_unit_hp}`);
			var unitContainer = this[`unit${index + 5}`];
            unitContainer.setVisible(unit.curr_unit_hp > 0);
            if (unit.curr_unit_hp > 0) {
                unitContainer.setInteractive().on('pointerdown', () => this.Attack(unit.player_unit_id));
            }
        });
        // Check for game over
        if (gameState.game_state === 1) {
            alert("Game over! Returning to main menu!");
            window.location.href = "/mainMenu.html"; 
            return;
        }
        // Update turn indicator
        console.log(`Current Turn: ${gameState.current_turn}`);
        this.UpdateTurnIndicator(gameState.current_turn);
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
