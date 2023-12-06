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

        //Loading Sprites
        this.load.image("menuBackground", "./assets/menuBackground.jpg");
        this.load.image("playBackground", "./assets/playBackground.jpg")
        this.load.image("menuTitle", "./assets/menuTitle.png");
        this.load.image("gameClearTitle", "./assets/gameClearText.png")
        this.load.image("gummy", "./assets/gummy.png");
        this.load.image("blockTile", "./assets/blockTile.png")
        this.load.spritesheet("tileset", "./assets/tileset.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("healthBar", "./assets/healthBar.png", {
            frameWidth: 200,
            frameHeight: 50
        });

        //Loading Spritesheet Assets
        this.load.spritesheet("mighty", "./assets/mighty.png", { //Loading Mighty Spritesheet
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("bugsterOrange", "./assets/bugsterOrange.png", { //Loading Bugster Spritesheets
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("bugsterGreen", "./assets/bugsterGreen.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("bugsterYellow", "./assets/bugsterYellow.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("box", "./assets/box.png", { //Loading breakable box
            frameWidth: 150,
            frameHeight: 150
        })

        //Loading TileMap
        this.load.image("tilesetImage", "./assets/tileset.png"); //Loading tileset
        this.load.image("instructions", "./assets/instructions.png"); //Loading Instructions tileset
        this.load.tilemapTiledJSON("tilemapJSON", "./assets/overworld.json");

        //Loading BitMap Text
        //Font From: https://www.1001fonts.com/press-start-font.html
        this.load.bitmapFont("PressStart", "./assets/PressStartK.png", "./assets/PressStartK.xml");

        //Loading Audio
        this.load.audio("playAudio", "./assets/Blip Stream.wav"); //Music by Kevin Macleod: https://youtu.be/9np9KK4ccuA?si=d2mDKyURkvU5YtKb
        this.load.audio("menuAudio", "./assets/Rhinoceros.wav"); //Music by Kevin Macleod: https://youtu.be/_DOQuVH4eeg?si=JtTktUsy2nNyo5tW
        this.load.audio("creditsAudio", "./assets/Show Your Moves.wav"); //Music by Kevin Macleod: https://youtu.be/9np9KK4ccuA?si=d2mDKyURkvU5YtKb
        this.load.audio("jump1", "./assets/sfx/jump1.wav");
        this.load.audio("jump2", "./assets/sfx/jump2.wav");
        this.load.audio("jump3", "./assets/sfx/jump3.wav");
        this.load.audio("mightyHurt", "./assets/sfx/mightyHurt.wav");
        this.load.audio("bugsterHurt1", "./assets/sfx/bugsterHurt1.wav");
        this.load.audio("bugsterHurt2", "./assets/sfx/bugsterHurt2.wav");
        this.load.audio("bugsterHurt3", "./assets/sfx/bugsterHurt3.wav");
        this.load.audio("eat", "./assets/sfx/eat.wav");
        this.load.audio("attack", "./assets/sfx/attack.wav");
        this.load.audio("gameOverSound", "./assets/sfx/Game Over.wav"); //Sound from Kamen Rider Ex-Aid: https://www.youtube.com/watch?v=0KoLVvY6rmo
        this.load.audio("gameClearSound", "./assets/sfx/Game Clear.wav"); //Sound from Kamen Rider Ex-Aid: https://www.youtube.com/watch?v=0SjPvdj2Cjs
        this.load.audio("switch1", "./assets/sfx/switch1.wav");
        this.load.audio("switch2", "./assets/sfx/switch2.wav");
        this.load.audio("select", "./assets/sfx/select.wav");
        this.load.audio("boxBreak", "./assets/sfx/boxBreak.wav");
        this.load.audio("intro", "./assets/sfx/intro.wav");
        this.load.audio("scoreComplete", "./assets/sfx/scoreComplete.wav");
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

        //Creating Bugster Animations
        this.anims.create({
            key: "orangeBugster-left",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bugsterOrange", {start: 0, end: 5})
        });
        this.anims.create({
            key: "orangeBugster-right",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bugsterOrange", {start: 6, end: 11})
        });
        this.anims.create({
            key: "yellowBugster-left",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bugsterYellow", {start: 0, end: 5})
        });
        this.anims.create({
            key: "yellowBugster-right",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bugsterYellow", {start: 6, end: 11})
        });
        this.anims.create({
            key: "greenBugster-fly",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bugsterGreen", {start: 0, end: 2})
        });

        //Creating asset animations
        this.anims.create({
            key: "box-break",
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers("box", {start: 1, end: 5})
        })

        this.scene.start("menuScene");
    }
}