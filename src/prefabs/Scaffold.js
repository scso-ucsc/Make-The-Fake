//Scaffolding Prefab
class Scaffold extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(100, 100)
        this.scene = scene;

        //Setting Scaffolding Variables
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        // this.body.checkCollision.down = false;
        // this.body.checkCollision.left = false;
        // this.body.checkCollision.right = false;
        // this.body.checkCollision.up = true;
    }

    update(){
    }
}