class Score extends Phaser.Scene {
    constructor(){
        super("scoreScene");
    }

    create(){
        //Playing Audio
        this.sound.play("creditsAudio", audioConfig)

        //Variables
        this.nextSceneChoice = "menu";

        //Adding background
        this.add.image(0, 0, "playBackground").setScale(0.6).setOrigin(0);
        this.add.rectangle(0, 0, canvasWidth, canvasHeight, 0x000000).setOrigin(0).setAlpha(0.65); //Enabling black box for overlay

        //Mighty
        this.mightyIcon = this.add.sprite(400, 70, "mighty", 0).setOrigin(0.5, 0).setScale(1.2);
        this.mightyIcon.play("idle-right");

        //Text
        this.add.bitmapText(400, 50, "PressStart", "LEVEL RESULTS", 50).setOrigin(0.5).setTint(0xDA6AA2);
        this.add.bitmapText(100, 200, "PressStart", "TOTAL TIME:", 25).setOrigin(0, 0.5).setTint(0xDA6AA2);
        this.add.bitmapText(700, 200, "PressStart", totalTime, 25).setOrigin(1, 0.5).setTint(0xDDDDDD);
        this.add.bitmapText(100, 250, "PressStart", "GUMMIES COLLECTED:", 25).setOrigin(0, 0.5).setTint(0xDA6AA2);
        this.add.bitmapText(700, 250, "PressStart", "/55", 25).setOrigin(1, 0.5).setTint(0xDA6AA2);
        this.gummiesTweenText = this.add.bitmapText(625, 250, "PressStart", 0, 25).setOrigin(1, 0.5).setTint(0xDDDDDD);
        this.add.bitmapText(100, 300, "PressStart", "BUGSTERS DEFEATED:", 25).setOrigin(0, 0.5).setTint(0xDA6AA2);
        this.add.bitmapText(700, 300, "PressStart", "/18", 25).setOrigin(1, 0.5).setTint(0xDA6AA2);
        this.bugsterTweenText = this.add.bitmapText(625, 300, "PressStart", 0, 25).setOrigin(1, 0.5).setTint(0xDDDDDD);

        //Choices
        let textConfig = {
            fontFamily: "Verdana",
            fontSize: "28px",
            color: "#FFFFFF",
            stroke: "#CC0033",
            strokeThickness: 5,
            align: "middle"
        };
        this.menuText = this.add.text(300, 420, "MENU", textConfig).setOrigin(0.5).setScrollFactor(0).setScale(1);
        this.replayText = this.add.text(500, 420, "REPLAY", textConfig).setOrigin(0.5).setScrollFactor(0).setScale(0.85).setAlpha(0.5);

        //Calculating Player Score and Display Results
        let playerScore = (gummiesCollected + enemiesDefeated) / 73;
        this.perfectScoreText = this.add.bitmapText(400, 360, "PressStart", "PERFECT!", 50).setOrigin(0.5).setTint(0x33cc33).setAlpha(0);
        this.greatScoreText = this.add.bitmapText(400, 360, "PressStart", "GREAT!", 50).setOrigin(0.5).setTint(0x993399).setAlpha(0);
        this.okScoreText = this.add.bitmapText(400, 360, "PressStart", "OK!", 50).setOrigin(0.5).setTint(0xff9933).setAlpha(0);
        this.badScoreText = this.add.bitmapText(400, 360, "PressStart", "BAD", 50).setOrigin(0.5).setTint(0x990000).setAlpha(0);

        //Score Tweens
        this.tweens.addCounter({
            from: 0,
            to: gummiesCollected,
            duration: 2000,
            ease: "Linear",
            repeat: 0,
            onUpdate: (tween) => {
                this.gummiesTweenText.text = Phaser.Math.FloorTo(tween.getValue());
            }
        });
        this.time.delayedCall(2000, () => {
            this.tweens.addCounter({
                from: 0,
                to: enemiesDefeated,
                duration: 1000,
                ease: "Linear",
                repeat: 0,
                onUpdate: (tween) => {
                    this.bugsterTweenText.text = Phaser.Math.FloorTo(tween.getValue());
                },
                onComplete: () => {
                    this.sound.play("scoreComplete");
                    if(playerScore == 1){
                        this.perfectScoreText.setAlpha(1);
                    } else if(0.75 <= playerScore){
                        this.greatScoreText.setAlpha(1);
                    } else if(0.5 <= playerScore){
                        this.okScoreText.setAlpha(1);
                    } else{
                        this.badScoreText.setAlpha(1);
                    }
                }
            });
        });

        //Creating Keys
        this.keys = this.input.keyboard.createCursorKeys();

        //Controls Text
        document.getElementById('info').innerHTML = "<strong>CONTROLS:</strong> ARROWS | SPACE | R | ESC"
    }

    update(){
        //Enabling player choice of either replaying the level or returning to menu
        if(this.nextSceneChoice == "menu"){
            this.menuText.setAlpha(1).setScale(1);
            this.replayText.setAlpha(0.5).setScale(0.85);
            if(Phaser.Input.Keyboard.JustDown(this.keys.right)){
                this.nextSceneChoice = "replay";
                this.sound.play("switch2");
            }
            if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                this.sound.stopAll();
                this.scene.start("menuScene")
            }
        } else{ //this.nextSceneChoice == "replay";
            this.menuText.setAlpha(0.5).setScale(0.85);
            this.replayText.setAlpha(1).setScale(1);
            if(Phaser.Input.Keyboard.JustDown(this.keys.left)){
                this.nextSceneChoice = "menu";
                this.sound.play("switch2");
            }
            if(Phaser.Input.Keyboard.JustDown(this.keys.space)){
                this.sound.stopAll();
                this.scene.start("playScene");
            }
        }
    }
}