
// You can write more code here

/* START OF COMPILED CODE */

class UnitPrefab extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		this.setInteractive(new Phaser.Geom.Rectangle(-20.5, -16, 39, 67), Phaser.Geom.Rectangle.Contains);

		// sprite
		const sprite = scene.add.sprite(0, 0, "_MISSING");
		sprite.setInteractive(this.scene.input.makePixelPerfect());
		this.add(sprite);

		// hp
		const hp = new PrefabHpTag(scene, -8, 96);
		hp.scaleX = 0.8;
		hp.scaleY = 0.8;
		hp.setStyle({ "backgroundColor": "#30b43fff", "fontFamily": "Arial", "fontSize": "20px" });
		this.add(hp);

		// atk
		const atk = scene.add.text(-35, 106, "", {});
		atk.scaleX = 0.8;
		atk.scaleY = 0.8;
		atk.text = "ATK: ";
		atk.setStyle({ "backgroundColor": "#b9152aff", "color": "#ffffffff", "fontFamily": "Arial", "fontSize": "20px" });
		this.add(atk);

		// name
		const name = scene.add.text(-82, 123, "", {});
		name.scaleX = 0.8;
		name.scaleY = 0.8;
		name.text = "Name";
		name.setStyle({ "backgroundColor": "#000000ff", "fontFamily": "Arial", "fontSize": "18px", "fontStyle": "bold" });
		this.add(name);

		this.sprite = sprite;
		this.hp = hp;
		this.atk = atk;
		this.name = name;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Sprite} */
	sprite;
	/** @type {PrefabHpTag} */
	hp;
	/** @type {Phaser.GameObjects.Text} */
	atk;
	/** @type {Phaser.GameObjects.Text} */
	name;
	/** @type {boolean} */
	isPlayerUnit = false;
	/** @type {number} */
	unitID = 0;

	/* START-USER-CODE */



	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
