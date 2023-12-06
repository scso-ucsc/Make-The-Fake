class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    create(){
        //Playing Music
        this.sound.play("playAudio", audioConfig);

        //Initializing Variables
        gummiesCollected = 0;
        enemiesDefeated = 0;
        this.gummyCount = 0;
        this.gamePaused = false;
        this.gameClear = false;
        this.gameOver = false;
        this.pauseChoice = "yes";

        //Adding Background
        this.background = this.add.tileSprite(0, 0, 11200, 900, "playBackground").setOrigin(0, 0);
        //Adding TileMap
        const map = this.add.tilemap("tilemapJSON");
        const tileset = map.addTilesetImage("tileset", "tilesetImage"); //Connecting image to the data; "tileset" was the original name of the file
        const instructionsTileset = map.addTilesetImage("instructions", "instructions");
        //Creating Terrain and Background Layers
        const backgroundLayer = map.createLayer("Background", [tileset, instructionsTileset], 0, 0);
        const terrainLayer = map.createLayer("Terrain", tileset, 0, 0);
        let scaffoldingLayer = map.getObjectLayer("Scaffold");
        let gummyLayer = map.getObjectLayer("Gummies");

        //Creating Bugster Barriers
        this.bugsterBarriers = map.createFromObjects("BugsterBarrier");
        this.bugsterBarriers.map((barrier) => {barrier.setAlpha(0)});
        this.physics.world.enable(this.bugsterBarriers, Phaser.Physics.Arcade.STATIC_BODY);

        //Creating Game Clear Area
        this.gameClearArea = map.createFromObjects("CompleteArea");
        this.gameClearArea.map((tile) => {tile.setAlpha(0)});
        this.physics.world.enable(this.gameClearArea, Phaser.Physics.Arcade.STATIC_BODY);

        //Creating Scaffolding Layer
        this.scaffoldingGroup = this.physics.add.group();
        this.scaffolding = map.createFromObjects("Scaffold", {
            key: "tileset",
            frame: 2
        });
        this.physics.world.enable(this.scaffolding, Phaser.Physics.Arcade.ArcadeBodyCollision); //Adding physics to scaffolding
        this.scaffolding.forEach((scaffold) => {
            this.scaffoldingGroup.add(scaffold);
        });
        //Creating Block Layer
        this.blockGroup = this.add.group();
        for(let i = 1; i <= 9; i++){
            let blockSpawn = map.findObject("BlockSpawn", obj => obj.name === "block" + i.toString());
            this.block = new Block(this, blockSpawn.x, blockSpawn.y - 25, "blockTile");
            this.blockGroup.add(this.block);
        };

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

        //Adding Mighty
        const mightySpawn = map.findObject("MightySpawn", obj => obj.name === "spawnpoint");
        this.mighty = new Mighty(this, mightySpawn.x, mightySpawn.y, "mighty", 0, "right"); //Adding Mighty

        //Spawning Orange Bugsters
        this.orangeGroup = this.add.group({
            runChildUpdate: true
        });
        for(let i = 1; i <= 6; i++){
            let orangeSpawn = map.findObject("OrangeSpawn", obj => obj.name === "spawn" + i.toString());
            this.orange = new BugsterOrange(this, orangeSpawn.x, orangeSpawn.y, "bugsterOrange", 0, "left");
            this.orangeGroup.add(this.orange);
        }
        //Spawning Yellow Bugsters
        this.yellowGroup = this.add.group({
            runChildUpdate: true
        });
        for(let i = 1; i <= 3; i++){
            let yellowSpawn = map.findObject("YellowSpawn", obj => obj.name === "spawn" + i.toString());
            this.yellow = new BugsterYellow(this, yellowSpawn.x, yellowSpawn.y, "bugsterYellow", 0, "left");
            this.yellowGroup.add(this.yellow);
        }
        //Spawning Green Bugsters
        this.greenGroup = this.add.group({
            runChildUpdate: true
        });
        for(let i = 1; i <= 9; i++){
            let greenSpawn = map.findObject("GreenSpawn", obj => obj.name === "spawn" + i.toString());
            this.green = new BugsterGreen(this, greenSpawn.x, greenSpawn.y, "bugsterGreen", 0, "down");
            this.greenGroup.add(this.green);
        }

        //Enabling Collision
        this.physics.add.collider(this.mighty, terrainLayer, () => { //Enabling collision between Mighty and terrainLayer & Lets Mighty know he is touching the ground
            this.mighty.isInAir = false;
        });
        this.physics.add.overlap(this.mighty, this.gameClearArea, (mighty) => {
            if(this.gameClear == false){ //Play "Game Clear Sound Once"
                this.sound.play("gameClearSound");
            };
            this.gameClear = true;
            mighty.complete = true;
        });
        this.physics.add.overlap(this.gummyGroup, this.mighty, (gummy, mighty) => {
            this.sound.play("eat");
            gummy.destroy();
            mighty.speed += 1;
            this.gummyCount += 1;
        });
        this.physics.add.overlap(this.mighty, this.orangeGroup, (mighty, orange) => { //Mighty and Orange Bugsters Interaction
            if(mighty.isAttacking == true){
                var orangeRandomVal = Phaser.Math.Between(1, 3);
                this.sound.play("bugsterHurt" + orangeRandomVal);
                orange.destroy();
                enemiesDefeated += 1;
                return;
            }
            if(mighty.immune == false){
                mighty.immune = true;
                return;
            };
        });
        this.physics.add.overlap(this.mighty, this.yellowGroup, (mighty, yellow) => { //Mighty and Yellow Bugsters Interaction
            if(mighty.isAttacking == true && yellow.immune == false){
                var yellowRandomVal = Phaser.Math.Between(1, 3);
                this.sound.play("bugsterHurt" + yellowRandomVal);
                yellow.hit();
                return;
            }
            if(mighty.immune == false){
                mighty.immune = true;
                return;
            };
        });
        this.physics.add.overlap(this.mighty, this.greenGroup, (mighty, green) => { //Mighty and Green Bugsters Interaction
            if(mighty.isAttacking == true){
                var greenRandomVal = Phaser.Math.Between(1, 3);
                this.sound.play("bugsterHurt" + greenRandomVal);
                green.destroy();
                enemiesDefeated += 1;
                return;
            }
            if(mighty.immune == false){
                mighty.immune = true;
                return;
            };
        });
        this.physics.add.collider(this.orangeGroup, this.bugsterBarriers, (orange) => {
            orange.flip();
        });
        this.physics.add.collider(this.yellowGroup, this.bugsterBarriers, (yellow) => {
            yellow.flip();
        });
        this.physics.add.collider(this.greenGroup, this.bugsterBarriers, (green) => {
            green.reverse();
        });
        this.scaffoldingGroup.children.each((scaffold) => { //Attempting to enable collision between Mighty and Scaffolding group (NOT WORKING)
            this.physics.add.existing(scaffold);
            scaffold.body.setImmovable(true);
            scaffold.body.checkCollision.down = false;
            scaffold.body.checkCollision.left = false;
            scaffold.body.checkCollision.right = false;
            this.physics.add.collider(this.mighty, scaffold, () => {
                console.log("Collision Detected") //DELETE
                this.mighty.isInAir = false;
            });
        });
        this.orangeGroup.children.each((child) => {
            this.physics.add.collider(child, terrainLayer);
            this.physics.add.collider(child, this.scaffoldingGroup);
        });
        this.yellowGroup.children.each((child) => {
            this.physics.add.collider(child, terrainLayer);
            this.physics.add.collider(child, this.scaffoldingGroup);
        });
        this.greenGroup.children.each((child) => {
            this.physics.add.collider(child, terrainLayer);
            this.physics.add.collider(child, this.scaffoldingGroup);
        });
        this.physics.add.collider(this.mighty, this.blockGroup, (mighty, block) =>{
            if(mighty.isAttacking == true){
                block.break();
            }
        });

        //Camera manipulation
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Setting camera bounds
        this.cameras.main.startFollow(this.mighty, true, 0.5, 0.5) //Make camera follow the Mighty; Round pixels, have a brief delay behind slime
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Enabling Mighty to go beyond basic canvas view

        //Enabling keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

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
        
        //GAME Clear Features
        this.gameClearTitle = this.add.sprite(400, 200, "gameClearTitle").setScale(0.25).setOrigin(0.5, 1).setScrollFactor(0).setAlpha(0);
        this.blackOverlay = this.add.rectangle(0, 0, map.widthInPixels, map.heightInPixels, 0x000000).setOrigin(0).setAlpha(0); //Enabling black box for overlay
        //Paused Features
        this.pausedText = this.add.bitmapText(400, 150, "PressStart", "GAME PAUSED", 50).setOrigin(0.5).setTint(0xDA6AA2).setAlpha(0).setScrollFactor(0);
        let questionConfig = {
            fontFamily: "Verdana",
            fontSize: "32px",
            color: "#FFFFFF",
            align: "middle"
        };
        this.pausedQuestion = this.add.text(400, 225, "Exit Level?", questionConfig).setOrigin(0.5).setAlpha(0).setScrollFactor(0);
        let textConfig = {
            fontFamily: "Verdana",
            fontSize: "28px",
            color: "#FFFFFF",
            stroke: "#CC0033",
            strokeThickness: 5,
            align: "middle"
        };
        this.yesText = this.add.text(300, 300, "YES", textConfig).setOrigin(0.5).setScrollFactor(0).setScale(1).setAlpha(0);
        this.noText = this.add.text(500, 300, "NO", textConfig).setOrigin(0.5).setScrollFactor(0).setScale(0.85).setAlpha(0);
        //GAME OVER Features
        this.gameOverText = this.add.bitmapText(400, 150, "PressStart", "GAME OVER", 50).setOrigin(0.5).setTint(0xDA6AA2).setAlpha(0).setScrollFactor(0);
        this.gameOverQuestion = this.add.text(400, 225, "RESTART?", questionConfig).setOrigin(0.5).setAlpha(0).setScrollFactor(0);

        //Controls Text
        document.getElementById('info').innerHTML = "<strong>CONTROLS:</strong> ARROWS | SPACE | R | ESC"
    }

    update(){
        if(!this.gameClear && !this.gameOver && !this.gamePaused){
            //Pause game if ESC pressed
            if(Phaser.Input.Keyboard.JustDown(keyESC)){
                this.gamePaused = true;
            };
            //End Game if Mighty Runs out of Health
            if(this.mighty.health == 0){
                this.sound.play("gameOverSound");
                this.gameOver = true;
            };
            //Updating Healthbar based on Mighty's current health
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
            totalTime = this.timeClock.text; //For Score
            //Updating Gummy Count
            this.gummyText.text = this.gummyCount;
            //Updating Mighty
            this.mightyFSM.step();
        } else if(this.gamePaused){ //Display Paused UI if game is paused
            this.blackOverlay.setAlpha(0.8);
            this.pausedText.setAlpha(1);
            this.pausedQuestion.setAlpha(1);
            if(this.pauseChoice == "yes"){
                this.yesText.setAlpha(1).setScale(1);
                this.noText.setAlpha(0.5).setScale(0.85);
                if(Phaser.Input.Keyboard.JustDown(this.keys.right)){
                    this.pauseChoice = "no";
                    this.sound.play("switch2");
                }
                if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                    this.scene.start("menuScene")
                    this.sound.stopAll();
                }
            } else{ //this.pauseChoice == "no";
                this.yesText.setAlpha(0.5).setScale(0.85);
                this.noText.setAlpha(1).setScale(1);
                if(Phaser.Input.Keyboard.JustDown(this.keys.left)){
                    this.pauseChoice = "yes";
                    this.sound.play("switch2");
                }
                if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                    this.pauseChoice = "yes";
                    this.gamePaused = false;
                    this.blackOverlay.setAlpha(0);
                    this.pausedText.setAlpha(0);
                    this.pausedQuestion.setAlpha(0);
                    this.yesText.setAlpha(0);
                    this.noText.setAlpha(0);
                }
            }
        } else if(this.gameOver){
            this.blackOverlay.setAlpha(0.8);
            this.gameOverText.setAlpha(1);
            this.gameOverQuestion.setAlpha(1);
            if(this.pauseChoice == "yes"){
                this.yesText.setAlpha(1).setScale(1);
                this.noText.setAlpha(0.5).setScale(0.85);
                if(Phaser.Input.Keyboard.JustDown(this.keys.right)){
                    this.pauseChoice = "no";
                    this.sound.play("switch2");
                }
                if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                    this.scene.restart();
                    this.sound.stopAll();
                }
            } else{ //this.pauseChoice == "no";
                this.yesText.setAlpha(0.5).setScale(0.85);
                this.noText.setAlpha(1).setScale(1);
                if(Phaser.Input.Keyboard.JustDown(this.keys.left)){
                    this.pauseChoice = "yes";
                    this.sound.play("switch2");
                }
                if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                    this.scene.start("menuScene")
                    this.sound.stopAll();
                }
            }

        } else if(this.gameClear){
            gummiesCollected = this.gummyCount;
            this.mightyFSM.step();
            this.gameClearTitle.setAlpha(1);
            this.tweens.add({
                targets: this.gameClearTitle,
                scaleX: 0.5,
                scaleY: 0.5,
                ease: "Linear",
                duration: 100,
                onComplete: () => {
                    this.time.delayedCall(5000, () => {
                        this.scene.start("scoreScene");
                        this.sound.stopAll();
                    })
                }
            })
        }
    }
}