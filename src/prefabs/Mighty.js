// Mighty Prefab
class Mighty extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        this.parentScene = scene;
        this.parentScene.add.existing(this); //Adding Mighty to the scene
        this.parentScene.physics.add.existing(this); //Adding physics to Mighty in this scene

        this.setCollideWorldBounds(true); //Enabling collision with world bounds
        this.setImmovable(true);

        //Mighty's properties
        this.health = 10;
        this.direction = direction;
        this.speed = 250;
        this.gravity = 300
        this.hurtTimer = 1500; //In ms
        this.setGravityY(this.gravity); //Applying gravity
        this.body.setSize(this.width / 1.5, this.height / 1.8);
        this.isInAir = false;
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
        mighty.isInAir = false;
    }

    execute(scene, mighty) {
        const {left, right, space} = scene.keys;
        const keyH = scene.keys.keyH; //Initializing H key for TESTING
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to jump if space is pressed
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.stateMachine.transition("jump");
            return;
        }

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to hurt if h is pressed for TESTING
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

        //Transition to hurt if h is pressed for TESTING
        if(mighty.immune == true){
            this.stateMachine.transition("hurt");
            return;
        }

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
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.stateMachine.transition('jump');
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
        mighty.isAttacking = true;
        mighty.setVelocityX(0);
        mighty.setSize(mighty.width / 1.2, mighty.height / 1.8);
        if(mighty.direction == "right"){
            mighty.setOffset(20, 20);
        } else{ //direction == "left"
            mighty.setOffset(-5, 20);
        }
        mighty.anims.play(`attack-${mighty.direction}`, true);
        mighty.once("animationcomplete", () => {
            mighty.isAttacking = false;
            mighty.setSize(mighty.width / 1.5, mighty.height / 1.8); //Returning bounds
            if(mighty.isInAir == false){
                this.stateMachine.transition("idle");
            } else{
                this.stateMachine.transition("fall");
            }
        });
    }
    
    execute(scene, mighty){
        const { left, right } = scene.keys;

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
    }
}

class JumpState extends State{
    enter(scene, mighty){
        mighty.setVelocityX(0); //Reset
        mighty.setVelocityY(-300);
        mighty.isInAir = true;
    }

    execute(scene, mighty){
        const { left, right } = scene.keys;
        const keyR = scene.keys.keyR; //Bounding to enable R key

        if(Phaser.Input.Keyboard.JustDown(keyR)){
            mighty.setVelocityY(0);
            this.stateMachine.transition("attack");
            return;
        }

        if(mighty.immune == true){
            mighty.setVelocityY(0);
            this.stateMachine.transition("hurt");
            return;
        }

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

        if(mighty.isInAir == false){
            this.stateMachine.transition("idle");
            return;
        }
    }
}

class FallState extends State{
    enter(scene, mighty){
        mighty.setGravityY(mighty.gravity);
    }

    execute(scene, mighty){
        const { left, right } = scene.keys;

        if(mighty.immune == true){
            this.stateMachine.transition("hurt");
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

        if(mighty.isInAir == false){
            this.stateMachine.transition("idle");
            return;
        }
    }
}

class HurtState extends State{
    enter(scene, mighty){
        mighty.health -= 1;
        mighty.setVelocity(0);
        mighty.anims.play(`hurt-${mighty.direction}`);
        scene.time.delayedCall(mighty.hurtTimer, () => {
            mighty.immune = false;
            if(mighty.isInAir == false){
                this.stateMachine.transition("idle");
            } else{
                this.stateMachine.transition("fall");
            }
        });
    }
}

class CompleteState extends State{
    enter(scene, mighty){
        mighty.setCollideWorldBounds(false);
        mighty.setVelocityX(mighty.speed / 4 * 3);
        mighty.anims.play(`run-${mighty.direction}`, true);
    }
}