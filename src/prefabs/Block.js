//Block Prefab
class Block extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;

        //Setting Box Variables
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
    }

    break(){
        this.scene.sound.play("boxBreak");
        let boxBreak = this.scene.add.sprite(this.x - 75, this.y - 75, "box", 1).setOrigin(0); //Add box animation on top of block
        this.destroy(); //Destroy the original block
        boxBreak.anims.play("box-break");
        boxBreak.on("animationcomplete", () => { //Destroy animated sprite upon completion
            boxBreak.destroy();
        });
    }
}