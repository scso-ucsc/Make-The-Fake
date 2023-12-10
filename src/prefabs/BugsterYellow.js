//Yellow Bugster Prefab
class BugsterYellow extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setting Bugster Variables
        this.setCollideWorldBounds(true);
        this.direction = direction;
        this.velocity = 100;
        this.setGravityY(300);
        this.body.setSize(this.width / 1.5, this.height / 1.9);
        this.life = 2; //Starting health
        this.immune = false;
        this.scene = scene;

        //Activating Animation
        this.play(`yellowBugster-${this.direction}`);
    }

    update(){ //Left and right movement
        if(this.scene.gamePaused == true){
            this.setVelocityX(0);
        } else{ //this.scene.gamePaused == false
            if(this.immune == false){
                if(this.direction == "left"){ //TEMP CODE
                    this.setVelocityX(-this.velocity);
                } else { //direction == "right"
                    this.setVelocityX(this.velocity);
                }
            }
        }
    }

    flip(){ //Changing direction of Bugster
        if(this.direction == "left"){
            this.direction = "right";
            this.play(`yellowBugster-${this.direction}`);
        } else{ //this.direction == "right"
            this.direction = "left";
            this.play(`yellowBugster-${this.direction}`);
        }
    }

    hit(mightyDirection){
        this.life -= 1;
        this.immune = true; //Temporarily make bugster immune so it is not destroyed within the same Mighty attack animation
        if(this.life == 0){ //Destroy on second hit
            this.destroy();
            enemiesDefeated += 1;
        } else{ //Knock back in the direction Mighty hit him if hit one time
            this.scene.time.delayedCall(500, () => {this.immune = false});
            switch(mightyDirection){
                case "left":
                    this.setVelocityX(-this.velocity);
                    break;
                case "right":
                    this.setVelocityX(this.velocity);
                    break;
            }
        }
    }
}