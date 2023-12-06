class Credits extends Phaser.Scene {
    constructor(){
        super("creditsScene");
    }

    create(){
        this.test = this.physics.add.sprite(400 - 25, 400 -100, "box", 0).setOrigin(0);
        this.test.body.setImmovable(true);
        this.test2 = this.physics.add.sprite(400 - 25, 400 -325, "box", 0).setOrigin(0);
        //this.test2.body.setImmovable(true);
        this.test2.body.setCollideWorldBounds(true);
        this.test2.body.setVelocityY(50);
        this.physics.add.collider(this.test, this.test2, () => {
            console.log("Detected");
        })
    }
}