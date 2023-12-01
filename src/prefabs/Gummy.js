//Gummy Prefab
class Gummy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.5);

        //Setting Gummy Variables
        this.setImmovable(true);
        this.body.setCircle(this.width / 2);
        this.parentScene = scene; //For absorb
    }

    absorb(){
        this.destroy();
        this.parentScene.gummyCount += 1;
    }
}