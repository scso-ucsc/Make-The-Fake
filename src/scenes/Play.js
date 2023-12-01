class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    create(){
        //Initializing Variables
        this.gummyCount = 0;

        //Adding Background
        this.background = this.add.tileSprite(0, 0, 1800, 900, "playBackground").setOrigin(0, 0);
        //Adding TileMap
        const map = this.add.tilemap("tilemapJSON");
        const tileset = map.addTilesetImage("tileset", "tilesetImage"); //Connecting image to the data; "tileset" was the original name of the file
        const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
        const terrainLayer = map.createLayer("Terrain", tileset, 0, 0);
        const scaffoldingLayer = map.createLayer("Scaffolding", tileset, 0, 0);

        //Enabling collisions based on tilemap
        terrainLayer.setCollisionByProperty({ //Acquiring properties of terrain layer
            collides: true //If collides is true on that tile, collide
        });
        //COLLISION ONLY SEEMS TO WORK FROM TOP

        //Creating Groups
        this.gummyGroup = this.add.group(); //HOW TO SPAWN MULTIPLE GUMMIES BASED ON POINTS

        //Adding Assets
        this.add.text(0, 0, "playScene");
        this.mighty = new Mighty(this, 50, 50, "mighty", 0, "right"); //Adding Mighty
        this.orange = new BugsterOrange(this, 400, 0, "bugsterOrange", 0, "left");
        this.yellow = new BugsterYellow(this, 450, 0, "bugsterYellow", 0, "left");
        this.green = new BugsterGreen(this, 500, 0, "bugsterGreen", 0, "down");
        this.gummyTest = new Gummy(this, 350, 350, "gummy"); //FOR TESTING
        this.gummyGroup.add(this.gummyTest);

        //Enabling Collision
        this.physics.add.collider(this.mighty, terrainLayer, () => { //Enabling collision between Mighty and terrainLayer & Lets Mighty know he is touching the ground
            this.mighty.isInAir = false;
        });
        this.physics.add.collider(this.gummyGroup, this.mighty, (gummy) => {
            gummy.absorb();
        })

        //Camera manipulation
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Setting camera bounds
        this.cameras.main.startFollow(this.mighty, true, 0.5) //Make camera follow the Mighty; Round pixels, have a brief delay behind slime
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); //Enabling Mighty to go beyond basic canvas view

        //Enabling keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        //Instructions
        //document.getElementById('info').innerHTML = '<strong>MightyFSM.js:</strong> Arrows: move | SPACE: jump | R: attack | H: hurt'
    }

    update(){
        //this.background.tilePositionX += 1;
        //Enabling Mighty's State Machine
        this.mightyFSM.step();
        // this.greenBugsterFSM.step();
        this.orange.update();
        this.yellow.update();
    }
}