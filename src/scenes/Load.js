class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
        //Loading Bar
        //From https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on("progress", (value) => {
            loadingBar.clear(); //Reset fill style
            loadingBar.fillStyle(0xFFFFFF, 1); // (colour, alpha)
            loadingBar.fillRect(0, game.config.height / 2, game.config.width * value, 5);
        });
        this.load.on("complete", () => {
            loadingBar.destroy();
        });

        //Loading Assets
        this.load.spritesheet("mighty", "./assets/mighty.png", { //Loading Mighty Spritesheet
            frameWidth: 100,
            frameHeight: 100
        });
    }

    create(){
        //Creating Mighty's Idle animations
        this.anims.create({
            key: "idle-right",
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 0, end: 1})
        });
        this.anims.create({
            key: "idle-left",
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 2, end: 3})
        });

        //Creating Mighty's Run animations
        this.anims.create({
            key: "run-right",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 4, end: 7})
        });
        this.anims.create({
            key: "run-left",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 8, end: 11})
        });

        //Creating Mighty's Jump animations
        this.anims.create({
            key: "jump-right",
            frameRate: 1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 12, end: 12})
        });
        this.anims.create({
            key: "jump-left",
            frameRate: 1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 13, end: 13})
        });

        //Creating Mighty's Attack animations
        this.anims.create({
            key: "attack-right",
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("mighty", {start: 14, end: 17})
        });
        this.anims.create({
            key: "attack-left",
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("mighty", {start: 18, end: 21})
        });

        //Creating Mighty's Hurt animations
        this.anims.create({
            key: "hurt-right",
            frameRate: 4,
            repeat: 3,
            frames: this.anims.generateFrameNumbers("mighty", {start: 22, end: 23})
        });
        this.anims.create({
            key: "hurt-left",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("mighty", {start: 23, end: 24})
        });


        this.scene.start("menuScene");
    }
}