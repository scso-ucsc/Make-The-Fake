class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    create(){
        this.add.text(0, 0, "playScene");
        this.mighty = new Mighty(this, 50, 50, "mighty", 0, "right"); //Adding Mighty
        this.orange = new BugsterOrange(this, 400, 0, "bugsterOrange", 0, "left");
        this.yellow = new BugsterYellow(this, 450, 0, "bugsterYellow", 0, "left");
        this.green = new BugsterGreen(this, 500, 0, "bugsterGreen", 0, "down");

        //Enabling keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keys.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        //Enabling Mighty's State Machine
        this.mightyFSM.step();
        this.orange.update();
        this.yellow.update();
    }
}