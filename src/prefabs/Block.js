//Block Prefab
class Block extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
    }

    update(){
    }

    break(){
        console.log("destroyed!")
    }
}