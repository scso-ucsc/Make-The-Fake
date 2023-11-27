//Green Bugster Prefab
class BugsterGreen extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.direction = direction;
        this.setGravityY(300);
        this.body.setSize(this.width / 1.5, this.height / 1.9);

        //Activating Animation
        this.play(`greenBugster-fly`);
    }

    update(){
    }
}