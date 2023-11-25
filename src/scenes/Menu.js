class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    create(){

    }

    update(){
        this.scene.start("playScene");
    }
}