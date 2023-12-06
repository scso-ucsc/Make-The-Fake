//Name: Sean Eric So
//Game Title: Mighty Action X
//From: Kamen Rider Ex-Aid (2016)
//Genre: 2D Action Platform
//Phaser Components Used:
//Time Spent: 37 Hours

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    pixelArt: true,
    scene: [ Load, Menu, Play, Score ], //Defining scenes
    scale: {
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.HORIZONTALLY,
    },
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
let audioConfig = { //For Music
    volume: 0.5,
    loop: true //Allows looping of track
};
let gummiesCollected = 0;
let enemiesDefeated = 0;
let totalTime = "";

//Creating Keyboard Variables
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyR, keyESC;