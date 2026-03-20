class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'Splash'});
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    
    }

    create() {
        this.add.image(400, 300, 'logo');

    this.time.delayedCall(3000, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Demo');
        });
    });
    }
}


class Demo extends Phaser.Scene {
    constructor() {
        super({ key: 'Demo'});
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('sky2', 'https://labs.phaser.io/assets/skies/space2.png');
        this.load.image('sky3', 'assets/sky.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('star', 'assets/star.png');
        this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
        this.load.image('orb', 'https://labs.phaser.io/assets/sprites/aqua_ball.png');
    }

    create() {
        this.het_fon = this.add.image(400, 300, 'sky');

        this.player = this.physics.add.sprite(100, 300, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({ key: 'turn', frames: [{ key: 'dude', frame: 4 }], frameRate: 20 });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.orb = this.physics.add.staticImage(600, 300, 'orb').setTint(0xff0000);
        this.villageCenter = this.physics.add.staticImage(100, 100, 'ball').setTint(0xffff00).setAlpha(0);

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(100, 560, 'orb').setScale(30, 1).refreshBody();
        this.platforms.create(400, 500, 'orb').setScale(20, 1).refreshBody();
        this.platforms.create(650, 400, 'orb').setScale(20, 1).refreshBody();

        this.platforms.create(300, 450, 'orb');
        this.platforms.create(250, 350, 'orb');
        this.platforms.create(200, 250, 'orb');

        this.bell = this.physics.add.staticImage(200, 200, 'star').setTint(0xffd700).setAlpha(0);
        this.physics.add.collider(this.player, this.platforms);

        this.currentMission = 1;
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-450);
        }

        if (this.currentMission == 1) this.checkMission1();
        else if (this.currentMission == 2) this.checkMission2();
        else if (this.currentMission == 3) this.checkMission3();

        if (this.currentMission >= 2) {
            this.orb.disableBody(true, true);
        }
    }

    checkMission1() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.orb.x, this.orb.y);
        if (dist < 30) {
            this.currentMission = 2;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.het_fon.setTexture('sky2');
                this.cameras.main.fadeIn(500, 0, 0, 0);
                this.villageCenter.setAlpha(1);
            });
        }
    }

    checkMission2() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.villageCenter.x, this.villageCenter.y);
        if (dist < 30) {
            this.currentMission = 3;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.het_fon.setTexture('sky3');
                this.cameras.main.fadeIn(500, 0, 0, 0);
                this.villageCenter.setAlpha(0);
                this.bell.setAlpha(1);
            });
        }
    }

    checkMission3() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bell.x, this.bell.y);
        if (dist < 30) {
            this.currentMission = 4;
            this.bell.setTint(0xff00ff);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d6d',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 } }
    },
    scene: [Splash, Demo]
};

const game = new Phaser.Game(config);