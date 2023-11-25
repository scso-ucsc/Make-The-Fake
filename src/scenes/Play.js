class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    create(){
        this.add.text(0, 0, "playScene");
        this.mighty = new Mighty(this, 50, 50, "mighty", 0, "right"); //Adding Mighty

        //Enabling keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.keys.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        this.keys.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update(){
        //Enabling Mighty's State Machine
        this.mightyFSM.step();
    }
}