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

    update(){
    }

    break(){
        let boxBreak = this.scene.add.sprite(this.x - 50, this.y - 50, "box", 1).setOrigin(0);
        this.destroy();
        boxBreak.anims.play("box-break");
        boxBreak.on("animationcomplete", () => {
            boxBreak.destroy();
        });
    }
}