//Yellow Bugster Prefab
class BugsterYellow extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.direction = direction;
        this.velocity = 1;
        this.setGravityY(300);
        this.body.setSize(this.width / 1.5, this.height / 1.9);
        this.life = 2; //Starting health

        //Activating Animation
        this.play(`yellowBugster-${this.direction}`);
    }

    update(){
        if(this.direction == "left"){ //TEMP CODE
            this.x -= this.velocity;
        } else { //direction == "right"
            this.x += this.velocity;
        }
    }
}