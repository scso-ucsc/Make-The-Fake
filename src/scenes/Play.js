class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    create(){
        //Initializing Variables
        this.gummyCount = 0;

        //Adding Background
        this.background = this.add.tileSprite(0, 0, 11200, 900, "playBackground").setOrigin(0, 0);
        //Adding TileMap
        const map = this.add.tilemap("tilemapJSON");
        const tileset = map.addTilesetImage("tileset", "tilesetImage"); //Connecting image to the data; "tileset" was the original name of the file
        const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
        const terrainLayer = map.createLayer("Terrain", tileset, 0, 0);
        let scaffoldingLayer = map.getObjectLayer("Scaffold");
        let gummyLayer = map.getObjectLayer("Gummies");

        //Creating Scaffolding Layer
        this.scaffolding = map.createFromObjects("Scaffold", {
            key: "tileset",
            frame: 2
        })
        this.physics.world.enable(this.scaffolding, Phaser.Physics.Arcade.ArcadeBodyCollision); //Adding physics to scaffolding
        this.scaffolding.map((scaffold) => {
            this.physics.add.existing(scaffold);
            scaffold.body.setImmovable(true);
            scaffold.body.checkCollision.down = false;
            scaffold.body.checkCollision.left = false;
            scaffold.body.checkCollision.right = false;
            scaffold.body.checkCollision.up = true;
        })
        this.scaffoldingGroup = this.add.group(this.scaffolding);

        //Enabling collisions based on tilemap
        terrainLayer.setCollisionByProperty({ //Acquiring properties of terrain layer
            collides: true //If collides is true on that tile, collide
        });

        //Creating Gummy Group
        this.gummies = map.createFromObjects("Gummies", {
            key: "gummy"
        })
        this.physics.world.enable(this.gummies, Phaser.Physics.Arcade.STATIC_BODY); //Adding physics to gummies
        this.gummies.map((gummy) => {
            gummy.body.setCircle(gummy.width / 3.9).setOffset(25, 21)
        })
        this.gummyGroup = this.add.group(this.gummies); //Adding made gummies into group

        //Adding Assets FOR TESTING
        this.add.text(0, 0, "playScene");
        this.orange = new BugsterOrange(this, 400, 0, "bugsterOrange", 0, "left");
        this.yellow = new BugsterYellow(this, 450, 0, "bugsterYellow", 0, "left");
        this.green = new BugsterGreen(this, 500, 0, "bugsterGreen", 0, "down");

        //Adding Mighty
        const mightySpawn = map.findObject("MightySpawn", obj => obj.name === "spawnpoint");
        this.mighty = new Mighty(this, mightySpawn.x, mightySpawn.y, "mighty", 0, "right"); //Adding Mighty

        //Enabling Collision
        this.physics.add.collider(this.mighty.body, terrainLayer, () => { //Enabling collision between Mighty and terrainLayer & Lets Mighty know he is touching the ground
            this.mighty.isInAir = false;
        });
        this.physics.add.collider(this.mighty, this.scaffoldingGroup);
        this.physics.add.collider(this.gummyGroup, this.mighty, (gummy, mighty) => {
            gummy.destroy();
            mighty.speed += 1;
            this.gummyCount += 1;
        })

        //Camera manipulation
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Setting camera bounds
        this.cameras.main.startFollow(this.mighty, true, 0.5, 0.5) //Make camera follow the Mighty; Round pixels, have a brief delay behind slime
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Enabling Mighty to go beyond basic canvas view

        //Enabling keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //Initiating UI
        this.healthBar = this.add.sprite(10, 10, "healthBar", this.mighty.health).setOrigin(0); //Healthbar
        this.healthBar.setScrollFactor(0);
        this.timeText = this.add.bitmapText(580, 25, "PressStart", "TIME", 20); //"TIME"
        this.timeText.setScrollFactor(0);
        this.timeClock = this.add.bitmapText(668, 21, "PressStart", "00:00", 25).setTint(0xE1E3CE); //CLOCK
        this.timeClock.setScrollFactor(0);
        this.timedEvent = this.time.delayedCall(6000000); //For tracking how much time has passed by
        this.gummyIcon = this.add.sprite(10, 50, "gummy").setScale(0.6).setOrigin(0); //Gummy Count
        this.gummyIcon.setScrollFactor(0);
        this.gummyText = this.add.bitmapText(70, 70, "PressStart", this.gummyCount, 20).setOrigin(0).setTint(0xDDB1D5); //Gummy Count
        this.gummyText.setScrollFactor(0);
        
        //Instructions
        //document.getElementById('info').innerHTML = '<strong>MightyFSM.js:</strong> Arrows: move | SPACE: jump | R: attack | H: hurt'
    }

    update(){
        this.healthBar.setTexture("healthBar", this.mighty.health);

        //Updating Time; Inspired by this formula: https://stackoverflow.com/questions/63870145/phaser-3-create-a-game-clock-with-minutes-and-seconds
        let minuteExtraZero = "0";
        let secondExtraZero = "0";
        let elapsedTime = this.timedEvent.getElapsedSeconds();
        let minuteVal = Math.floor(elapsedTime / 60);
        let secondVal = Math.floor(elapsedTime - (minuteVal * 60));
        if(minuteVal >= 10){
            minuteExtraZero = "";
        }
        if(secondVal >= 10){
            secondExtraZero = "";
        }
        this.timeClock.text = minuteExtraZero + minuteVal.toString() + ":" + secondExtraZero + secondVal.toString();
        //Updating Gummy Count
        this.gummyText.text = this.gummyCount;

        //console.log(this.timedEvent.getElapsedSeconds());
        //this.background.tilePositionX += 1;
        //Enabling Mighty's State Machine
        this.mightyFSM.step();
        // this.greenBugsterFSM.step();
        this.orange.update();
        this.yellow.update();
    }

    // updateTime(){
    //     let minuteExtraZero = "";
    //     let secondExtraZero = "";
    //     let elapsedTime = this.timedEvent.getElapsedSeconds();
    //     let minuteVal = Math.floor(elapsedTime / 60);
    //     let secondVal = Math.floor(elapsedTime - (minuteVal * 60));
    //     if(minuteVal < 10){
    //         minuteExtraZero = "0";
    //     }
    //     if(secondVal < 10){
    //         secondExtraZero = "0";
    //     }
    //     this.timeClock.text = minuteExtraZero + minuteVal.toString() + secondExtraZero + secondVal.toString();
    // }
}