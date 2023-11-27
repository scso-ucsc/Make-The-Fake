// Mighty Prefab
class Mighty extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction){
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //Adding Mighty to the scene
        scene.physics.add.existing(this); //Adding physics to Mighty in this scene

        //this.body.setSize(this.width / 2, this.height / 2) //Adjusting Mighty's size
        this.setCollideWorldBounds(true) //Enabling collision with world bounds
        this.setImmovable(true);

        //Mighty's properties
        this.direction = direction;
        this.speed = 100;
        this.hurtTimer = 1000; //In ms
        this.setGravityY(300); //Applying gravity
        this.body.setSize(this.width / 1.5, this.height / 1.8);

        //Initializing state machine to handle Mighty
        scene.mightyFSM = new StateMachine("idle", {
            idle: new IdleState(),
            run: new RunState(),
            jump: new JumpState(),
            attack: new AttackState(),
            hurt: new HurtState()
        }, [scene, this]);
    }
}

class IdleState extends State {
    enter(scene, mighty) {
        mighty.setVelocity(0);
        mighty.anims.play(`idle-${mighty.direction}`);
    }

    execute(scene, mighty) {
        const {left, right, space} = scene.keys;
        const keyH = scene.keys.keyH; //Initializing H key for TESTING
        //const keySPACE = scene.keys.keySPACE; //Bounding to enable SPACE key
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
        if(Phaser.Input.Keyboard.JustDown(keyH)){
            this.stateMachine.transition("hurt");
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
        const { left, right} = scene.keys;
        const keyH = scene.keys.keyH; //Initializing H key for TESTING
        const keyR = scene.keys.keyR; //Bounding to enable R key

        //Transition to attack if r is pressed
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.stateMachine.transition("attack");
            return;
        }

        //Transition to hurt if h is pressed for TESTING
        if(Phaser.Input.Keyboard.JustDown(keyH)){
            this.stateMachine.transition("hurt");
            return;
        }

        //Transition back to idle if left or right is no longer being pressed
        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        //NEED TO ADD JUMP FEATURE!!!

        //Executing Movement
        if(left.isDown) {
            mighty.direction = "left";
            mighty.setVelocityX(-300);
        } else if(right.isDown) {
            mighty.direction = "right";
            mighty.setVelocityX(300);
        }
        mighty.anims.play(`run-${mighty.direction}`, true);
    }
}

class AttackState extends State{
    enter(scene, mighty){
        mighty.setVelocity(0);
        mighty.anims.play(`attack-${mighty.direction}`, true);
        mighty.once("animationcomplete", () => {
            this.stateMachine.transition("idle");
        });
    }
}

class JumpState extends State{
    enter(scene, mighty){
        mighty.setVelocityY(-100);
        mighty.anims.play(`jump-${mighty.direction}`);
        scene.time.delayedCall(1000, () => { //FOR TESTING
            mighty.setVelocityY(0);
            this.stateMachine.transition("idle");
        })
    }
}

class HurtState extends State{
    enter(scene, mighty){
        mighty.setVelocity(0);
        mighty.anims.play(`hurt-${mighty.direction}`);
        scene.time.delayedCall(mighty.hurtTimer, () => {
            this.stateMachine.transition("idle");
        });
    }
}