
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
		const hp = new PrefabHpTag(scene, -1, 37);
		hp.setStyle({ "fontFamily": "Arial" });
		this.add(hp);

		// atk
		const atk = scene.add.text(-21, 56, "", {});
		atk.text = "ATK: ";
		atk.setStyle({ "color": "#ff9900", "fontSize": "25px" });
		this.add(atk);

		this.sprite = sprite;
		this.hp = hp;
		this.atk = atk;

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
