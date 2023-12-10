// Mighty Prefab
class Mighty extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        this.parentScene = scene;
        this.parentScene.add.existing(this); //Adding Mighty to the scene
        this.parentScene.physics.add.existing(this); //Adding physics to Mighty in this scene

        this.setCollideWorldBounds(true); //Enabling collision with world bounds

        //Mighty's properties
        this.health = 10;
        this.direction = direction;
        this.speed = 250;
        this.gravity = 300
        this.hurtTimer = 1500; //In ms
        this.setGravityY(this.gravity); //Applying gravity
        this.body.setSize(this.width / 1.7, this.height / 1.8);
        this.immune = false;
        this.isAttacking = false;
        this.complete = false;

        //Initializing state machine to handle Mighty
        scene.mightyFSM = new StateMachine("idle", {
            idle: new IdleState(),
            run: new RunState(),
            jump: new JumpState(),
            fall: new FallState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            complete: new CompleteState()
        }, [scene, this]);
    }
}

class IdleState extends State {
    enter(scene, mighty) {
        mighty.setVelocityX(0); //Reset
        mighty.anims.play(`idle-${mighty.direction}`);
    }

    execute(scene, mighty) {
        const {left, right, space} = scene.keys;
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to jump if space is pressed
        if(Phaser.Input.Keyboard.JustDown(space) && (mighty.body.touching.down == true || mighty.body.blocked.down == true)){
            this.stateMachine.transition("jump");
            return;
        }

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to hurt if colliding with enemy
        if(mighty.immune == true){
            this.stateMachine.transition("hurt");
            return;
        }

        //Transition to complete is Mighty reaches the end of the game
        if(mighty.complete == true){
            this.stateMachine.transition("complete");
            return;
        }

        //Transition to run if left or right is pressed
        if(left.isDown || right.isDown){
            this.stateMachine.transition("run");
            return;
        }

        //Transition to fall if velocity.y > 0
        if(mighty.body.velocity.y > 0){
            this.stateMachine.transition("fall");
            return;
        }
    }
}

class RunState extends State {
    execute(scene, mighty){
        const { left, right, space} = scene.keys;
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to hurt if colliding with enemy
        if(mighty.immune == true){
            this.stateMachine.transition("hurt");
            return;
        }

        //Transition to complete is Mighty reaches the end of the game
        if(mighty.complete == true){
            this.stateMachine.transition("complete");
            return;
        }

        //Transition back to idle if left or right is no longer being pressed
        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        //Transition to jump
        if(Phaser.Input.Keyboard.JustDown(space) || mighty.body.velocity.y < 0){
            this.stateMachine.transition('jump');
            return;
        }

        //Transition to fall if velocity.y > 0
        if(mighty.body.velocity.y > 0){
            this.stateMachine.transition("fall");
            return;
        }

        //Executing Movement
        if(left.isDown) {
            mighty.direction = "left";
            mighty.setVelocityX(-mighty.speed);
        } else if(right.isDown) {
            mighty.direction = "right";
            mighty.setVelocityX(mighty.speed);
        }
        mighty.anims.play(`run-${mighty.direction}`, true);
    }
}

class AttackState extends State{
    enter(scene, mighty){
        mighty.setVelocityX(0);
        scene.sound.play("attack");
        mighty.isAttacking = true;
        mighty.anims.play(`attack-${mighty.direction}`, true);

        //Transition to hurt if colliding with enemy
        if(mighty.immune == true){
            scene.mightyAttackBox.x = 0;
            scene.mightyAttackBox.y = 0;
            this.stateMachine.transition("hurt");
            return;
        }
        
        //Transition to next state
        mighty.once("animationcomplete", () => {
            scene.mightyAttackBox.x = 0;
            scene.mightyAttackBox.y = 0;
            mighty.isAttacking = false;
            if(mighty.body.touching.down == true || mighty.body.blocked.down == true){
                mighty.immune = false;
                this.stateMachine.transition("idle");
                return;
            } else{
                mighty.immune = false;
                this.stateMachine.transition("fall");
                return;
            }
        });
    }
    
    execute(scene, mighty){
        const { left, right } = scene.keys;

        //Executing Movement
        if(left.isDown && mighty.direction == "left") {
            mighty.setVelocityX(-mighty.speed / 4 * 3);
        } else if(right.isDown && mighty.direction == "right") {
            mighty.setVelocityX(mighty.speed / 4 * 3);
        } else{ //Neither left or right being pressed
            mighty.setVelocityX(0);
        }

        //Moving Mighty's Attack Box for Play scene's collision detection
        if(mighty.direction == "right"){
            scene.mightyAttackBox.x = mighty.x + 34;
            scene.mightyAttackBox.y = mighty.y - 6;
        } else { //mighty.direction == "left"
            scene.mightyAttackBox.x = mighty.x - 34;
            scene.mightyAttackBox.y = mighty.y - 6;
        }
    }
}

class JumpState extends State{
    enter(scene, mighty){
        mighty.setVelocityX(0); //Reset
        mighty.setVelocityY(-250);
        var randomVal = Phaser.Math.Between(1, 3);
        scene.sound.play("jump" + randomVal);
    }

    execute(scene, mighty){
        const { left, right } = scene.keys;
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            mighty.setVelocityY(0);
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to hurt if colliding with enemy
        if(mighty.immune == true){
            mighty.setVelocityY(0);
            this.stateMachine.transition("hurt");
            return;
        }

        //Transition to complete is Mighty reaches the end of the game
        if(mighty.complete == true){
            this.stateMachine.transition("complete");
            return;
        }

        //Executing Movement
        if(left.isDown) {
            mighty.direction = "left";
            mighty.setVelocityX(-mighty.speed / 4 * 3);
        } else if(right.isDown) {
            mighty.direction = "right";
            mighty.setVelocityX(mighty.speed / 4 * 3);
        } else{ //Neither left or right being pressed
            mighty.setVelocityX(0);
        }
        mighty.anims.play(`jump-${mighty.direction}`, true); 

        if(mighty.body.velocity.y == 0){
            if(mighty.body.touching.down == true || mighty.body.blocked.down == true){
                this.stateMachine.transition("idle");
                return;
            }
        } 
    }
}

class FallState extends State{
    enter(scene, mighty){
        mighty.setGravityY(mighty.gravity);
    }

    execute(scene, mighty){
        const { left, right } = scene.keys;
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to hurt if colliding with enemy
        if(mighty.immune == true){
            this.stateMachine.transition("hurt");
            return;
        }

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to complete is Mighty reaches the end of the game
        if(mighty.complete == true){
            this.stateMachine.transition("complete");
            return;
        }

        //Executing Movement
        if(left.isDown) {
            mighty.direction = "left";
            mighty.setVelocityX(-mighty.speed / 4 * 3);
        } else if(right.isDown) {
            mighty.direction = "right";
            mighty.setVelocityX(mighty.speed / 4 * 3);
        } else{
            mighty.setVelocityX(0);
        }
        mighty.anims.play(`jump-${mighty.direction}`, true);

        if(mighty.body.velocity.y == 0){
            if(mighty.body.touching.down == true || mighty.body.blocked.down == true){
                this.stateMachine.transition("idle");
                return;
            }
        }
    }
}

class HurtState extends State{
    enter(scene, mighty){
        scene.sound.play("mightyHurt");
        mighty.health -= 1;
        mighty.setVelocity(0); //Stun Mighty for a bit
        mighty.anims.play(`hurt-${mighty.direction}`);
        scene.time.delayedCall(mighty.hurtTimer, () => { //Transition back to idle or fall
            mighty.immune = false;
            if(mighty.body.touching.down == true || mighty.body.blocked.down == true){
                this.stateMachine.transition("idle");
                return;
            } else{
                this.stateMachine.transition("fall");
                return;
            }
        });
    }
}

class CompleteState extends State{
    enter(scene, mighty){
        mighty.setCollideWorldBounds(false); //Enabling Mighty to run off the screen
        mighty.setVelocityX(mighty.speed / 4 * 3);
        mighty.anims.play(`run-${mighty.direction}`, true);
    }
}