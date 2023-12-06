//Orange Bugster Prefab
class BugsterOrange extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        //this.setImmovable(true);
        this.direction = direction;
        this.velocity = 100;
        this.setGravityY(300);
        this.body.setSize(this.width / 1.5, this.height / 1.9);
        this.scene = scene;

        //Activating Animation
        this.play(`orangeBugster-${this.direction}`);
    }

    update(){
        if(this.scene.gamePaused == true){
            this.setVelocityX(0);
        } else{ //this.scene.gamePaused == false
            if(this.direction == "left"){ //TEMP CODE
                this.setVelocityX(-this.velocity);
            } else { //direction == "right"
                this.setVelocityX(this.velocity);
            }
        }
    }

    flip(){
        if(this.direction == "left"){
            this.direction = "right";
            this.play(`orangeBugster-${this.direction}`);
        } else{ //this.direction == "right"
            this.direction = "left";
            this.play(`orangeBugster-${this.direction}`);
        }
    }
}