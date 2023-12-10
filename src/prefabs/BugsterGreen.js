//Green Bugster Prefab
class BugsterGreen extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        this.setGravityY(100);
        this.body.setSize(this.width / 1.5, this.height / 1.9);
        this.velocity = 100;
        this.direction = direction;

        //Activating Animation
        this.play(`greenBugster-fly`);
    }

    update(){
        //Up and down movement
        if(this.scene.gamePaused == true){
            this.setVelocityY(0);
        } else{ //this.scene.gamePaused == false
            if(this.direction == "down"){
                this.setVelocityY(this.velocity)
            } else{ //this.direction == "up"
                this.setVelocityY(-this.velocity)
            }
        }
    }

    reverse(){ //Changing direction of floating Bugster
        if(this.direction == "down"){
            this.direction = "up";
        } else{ //this.direction == "up"
            this.direction = "down";
        }
    }
}