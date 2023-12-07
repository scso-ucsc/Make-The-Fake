class Credits extends Phaser.Scene {
    constructor(){
        super("creditsScene");
    }

    create(){
        //Playing Music
        this.sound.play("menuAudio", audioConfig);

        //Background
        this.add.image(0, 0, "playBackground").setScale(0.6).setOrigin(0);
        this.add.rectangle(0, 0, canvasWidth, canvasHeight, 0x000000).setOrigin(0).setAlpha(0.65); //Black overlay
        this.add.rectangle(25, 25, 750, 350, 0xEB7BA1).setOrigin(0);
        this.add.rectangle(35, 35, 730, 330, 0xF2A1D9).setOrigin(0);

        //Text
        this.add.bitmapText(400, 75, "PressStart", "CREDITS", 40).setOrigin(0.5);
        this.add.bitmapText(400, 125, "PressStart", "GAME CREATED BY: Sean Eric So", 15).setOrigin(0.5);
        this.add.bitmapText(400, 165, "PressStart", "BASED ON: Mighty Action X (Kamen Rider Ex-Aid)", 15).setOrigin(0.5);
        this.add.bitmapText(400, 205, "PressStart", "PROGRAMMING LANGUAGE: Javascript - PHASER 3", 15).setOrigin(0.5);
        this.add.bitmapText(400, 245, "PressStart", "PROGRAMMING SOFTWARE: VS CODE & TILED", 15).setOrigin(0.5);
        this.add.bitmapText(400, 285, "PressStart", "DESIGN SOFTWARE: Adobe Animate & Piskelapp", 15).setOrigin(0.5);
        this.add.bitmapText(400, 325, "PressStart", "MUSIC BY: Kevin Macleod", 15).setOrigin(0.5);

        //Sprites
        this.add.sprite(730, 340, "bugsterOrange", 0).anims.play("orangeBugster-left");
        this.add.sprite(70, 340, "bugsterYellow", 0).anims.play("yellowBugster-right");

        //Player Choices
        this.menuText = this.add.text(400, 415, "MENU", {
                fontFamily: "Verdana",
                fontSize: "28px",
                color: "#FFFFFF",
                stroke: "#CC0033",
                strokeThickness: 5,
                align: "middle"
        }).setOrigin(0.5);

        //Creating Keys
        this.keys = this.input.keyboard.createCursorKeys();

        //Controls Text
        document.getElementById('info').innerHTML = "<strong>CONTROLS:</strong> ARROWS | SPACE | R | ESC"
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.sound.stopAll();
            this.scene.start("menuScene");
        }
    }
}