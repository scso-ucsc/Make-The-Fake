class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    create(){
        //Playing Music
        this.sound.play("menuAudio", audioConfig);

        //Creating Variables
        this.playerChoice = "play";
        this.playSelected = false;

        //Defining Keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Adding background
        this.add.image(0, 0, "menuBackground").setOrigin(0);
        let menuTitle = this.add.image(canvasWidth, -canvasHeight, "menuTitle").setOrigin(0); //Enabling title for tweening
        let blackOverlay = this.add.rectangle(0, 0, canvasWidth, canvasHeight, 0x000000).setOrigin(0).setAlpha(0); //Enabling black box for overlay
        
        let textConfig = {
            fontFamily: "Verdana",
            fontSize: "32px",
            color: "#FFFFFF",
            stroke: "#CC0033",
            strokeThickness: 6,
            align: "middle"
        };
        this.playText = this.add.text(-200, canvasHeight / 2 + 100, "- GAME START -", textConfig).setOrigin(0.5);
        this.creditsText = this.add.text(-200, canvasHeight / 2 + 160, "- CREDITS -", textConfig).setOrigin(0.5);

        //Adding Transition Overlay
        this.transitionOverlay = this.add.rectangle(0, 0, canvasWidth, canvasHeight, 0x000000).setOrigin(0).setAlpha(0);

        //Title Tween
        this.tweens.add({
            targets: menuTitle,
            x: 0,
            y: 0,
            ease: "Linear",
            duration: 250,
        });
        this.sound.play("intro");

        //Adding black overlay and displaying player options
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: blackOverlay,
                alpha: 0.5,
                ease: "Linear",
                duration: 500
            });
            this.tweens.add({ //Adding text
                targets: this.playText,
                x: canvasWidth / 2,
                ease: "Linear",
                duration: 700,
            });
            this.tweens.add({
                targets: this.creditsText,
                x: canvasWidth / 2,
                ease: "Linear",
                duration: 600,
                onComplete: () => {
                    this.tweens.add({
                        targets: this.creditsText,
                        scaleX: 0.85,
                        scaleY: 0.85,
                        alpha: 0.5,
                        duration: 200,
                        ease: "Linear"
                    });
                }
            });
        })

        //Controls Text
        document.getElementById('info').innerHTML = "<strong>CONTROLS:</strong> ARROWS | SPACE | R | ESC"
    }

    update(){
        if(this.playerChoice == "play"){ //If player chooses "play", start game is SPACE is pressed, switch choice to "credits" if DOWN is pressed
            if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                this.playerChoice = "credits";
                this.sound.play("switch1")
                this.tweens.add({ //Text animations
                    targets: this.playText,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    alpha: 0.5,
                    duration: 200,
                    ease: "Linear"
                });
                this.tweens.add({
                    targets: this.creditsText,
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 200,
                    ease: "Linear"
                });
            } else if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.playSelected == false){
                this.playSelected = true;
                this.sound.play("select");
                this.tweens.chain({ //Text animations
                    targets: this.playText,
                    loop: 1,
                    tweens: [
                        {
                            alpha: 0.8,
                            scaleX: 0.95,
                            scaleY: 0.95,
                            duration: 200
                        },
                        {
                            alpha: 1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 200
                        }
                    ],
                    onComplete: () => { //Fade to black transition
                        this.tweens.add({
                            targets: this.transitionOverlay,
                            alpha: 1,
                            duration: 2000,
                            onComplete: () => {
                                this.sound.stopAll();
                                this.scene.start("playScene");
                            }
                        })
                    }
                });
            }
        } else{ //this.playerChoice == "credits"
            if(Phaser.Input.Keyboard.JustDown(keyUP)){ //If player chooses "credits", go to credits scene if SPACE is pressed, switch choice to "play" if UP is pressed
                this.playerChoice = "play";
                this.sound.play("switch1")
                this.tweens.add({ //Text animations
                    targets: this.playText,
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 200,
                    ease: "Linear"
                });
                this.tweens.add({
                    targets: this.creditsText,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    alpha: 0.5,
                    duration: 200,
                    ease: "Linear"
                });
            } else if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.playSelected == false){
                this.playSelected = true;
                this.sound.play("select");
                this.tweens.chain({  //Text animations
                    targets: this.creditsText,
                    loop: 1,
                    tweens: [
                        {
                            alpha: 0.8,
                            scaleX: 0.95,
                            scaleY: 0.95,
                            duration: 200
                        },
                        {
                            alpha: 1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 200
                        }
                    ],
                    onComplete: () => { 
                        this.tweens.add({ //Fade to black transition
                            targets: this.transitionOverlay,
                            alpha: 1,
                            duration: 1000,
                            onComplete: () => {
                                this.sound.stopAll();
                                this.scene.start("creditsScene");
                            }
                        })
                    }
                });
            }
        }
    }
}