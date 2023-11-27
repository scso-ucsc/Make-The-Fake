//Name: Sean Eric So
//Game Title: Mighty Action X
//From: Kamen Rider Ex-Aid (2016)
//Genre: 2D Action Platform
//Phaser Components Used:
//Time Spent: 13 Hours

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 450,
    pixelArt: true,
    scene: [ Load, Menu, Play ], //Defining scenes
    physics: {
        default: "arcade",
        arcade: {
            debug: "true" //For testing
        }
    }
};

//Creating Game
const game = new Phaser.Game(config);

//Creating Variables
let canvasWidth = 800;
let canvasHeight = 450;

//Creating Keyboard Variables
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyR, keyESC;