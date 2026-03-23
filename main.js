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

        this.time.delayedCall(1500, () => {
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
        this.load.image('targetImg', 'assets/star.png');
        
        // 4-rd missia
        this.load.image('robot', 'https://labs.phaser.io/assets/sprites/clown.png');
        // this.load.image('lever', ''); lcaky klini astx
    }

    create() {
        this.het_fon = this.add.image(400, 300, 'sky');

        this.player = this.physics.add.sprite(100, 300, 'dude');
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

        this.targetPoint = new Phaser.Math.Vector2(this.player.x, this.player.y);
        this.targetGraphic = this.add.image(0, 0, 'star').setVisible(false).setScale(0.5);
        this.isMoving = false;
        this.moveAxis = null;

        this.orb = this.physics.add.staticImage(600, 300, 'orb').setTint(0xff0000).setVisible(true); // missya 1
        this.villageCenter = this.physics.add.staticImage(100, 100, 'ball').setTint(0xffff00).setVisible(false); // missya 2
        this.bell = this.physics.add.staticImage(200, 200, 'star').setTint(0xffd700).setVisible(false); // missya 3
        this.robot = this.physics.add.sprite(400, 200, 'robot').setScale(1).setVisible(false); // missya 4
        this.lever = this.physics.add.staticImage(700, 150, 'star').setTint(0xff0000).setVisible(false); // missya 4

        this.currentMission = 1;
        this.isRobotFollow = false;

        this.input.on('pointerdown', (pointer) => {
            this.targetPoint.x = pointer.x;
            this.targetPoint.y = pointer.y;
            this.targetGraphic.copyPosition(this.targetPoint).setVisible(true);

            /*
            // amenakarj dzvy targetin hasnelu ankyunagcov 
            this.physics.moveToObject(this.player, this.targetPoint, 200);
            */
        
            // gtnenq targeti u playeri heravorutyuny
            let diffX = Math.abs(pointer.x - this.player.x);
            let diffY = Math.abs(pointer.y - this.player.y);
           
            // dadaracnumenq hin sharjumy vor chxangari
            this.player.setVelocity(0);
            this.isMoving = true;
            
            // stugum vor uxuutyan tarberutyunna mec
            if(diffX > diffY) {
                let speed = (pointer.x > this.player.x) ? 200 : -200;
                this.player.setVelocityX(speed);
                this.moveAxis = 'x' // pahenq update() stugman hamar
            } else {
                let speed = (pointer.y > this.player.y) ? 200 : -200;
                this.player.setVelocityY(speed);
                this.moveAxis = 'y';
            }
        });
        
        this.physics.add.overlap(this.player, this.robot, () => {
            if(this.currentMission == 4) {
                this.isRobotFollow = true;
            }
        }, null, this);
    }

    update() {
        if(this.isRobotFollow) {
                this.robot.x = this.player.x - 20;
                this.robot.y = this.player.y;
        }

        if(this.isMoving && this.player.body.speed > 0) {
            let reached = false;
           
            /* 
            // harmar amenakarj janaparhy pntrelu hamar && ankyunagcov
            if(this.player.body.velocity.x < 0) {
                this.player.anims.play('left', true);
            } else if(this.player.body.velocity.x > 0) {
                this.player.anims.play('right', true);
            }

            let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetPoint.x, this.targetPoint.y);
            if(distance < 20) {
                this.player.body.reset(this.targetPoint.x, this.targetPoint.y);
                this.player.anims.play('turn');
                this.targetGraphic.setVisible(false);
            }
            */
           
            if(this.moveAxis == 'x') {
                // kaxvac uxxutyunic animaciayi yntrutyun
                this.player.anims.play(this.player.body.velocity.x < 0 ? 'left' : 'right', true);
                if(Math.abs(this.player.x - this.targetPoint.x) < 10) {
                    reached = true;
                }
            }else if (this.moveAxis == 'y') {
                this.player.anims.play('turn', true);
                if (Math.abs(this.player.y - this.targetPoint.y) < 10) {
                    reached = true;
                }
            }

            if(reached) {
                this.player.setVelocity(0);
                this.player.x = this.targetPoint.x;
                this.player.y = this.targetPoint.y;
                this.player.anims.play('turn');
                this.targetGraphic.setVisible(false);
                this.isMoving = false;
                this.moveAxis = null;
           }

        /*
        // anjatvaca stexnashary 

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
        */

        if (this.currentMission == 1) this.checkMission1();
        else if (this.currentMission == 2) this.checkMission2();
        else if (this.currentMission == 3) this.checkMission3();
        else if (this.currentMission == 4) this.checkMission4();
    }
}
    
    checkMission1() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.orb.x, this.orb.y);
        if (dist < 30) {
            this.orb.setVisible(false);
            this.orb.disableBody(true, true);
            this.currentMission = 2;
            this.villageCenter.setVisible(true);
            this.het_fon.setTexture('sky2');
        }
    }

    checkMission2() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.villageCenter.x, this.villageCenter.y);
        if (dist < 30) {
            this.villageCenter.setVisible(false);
            this.currentMission = 3;
            this.bell.setVisible(true);
            this.het_fon.setTexture('sky3');
        }
    }

    checkMission3() {
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bell.x, this.bell.y);
        if (dist < 30) {
            this.currentMission = 4;
            this.bell.setTint(0xff00ff);
            this.bell.setVisible(false);
            this.robot.setVisible(true);
            this.lever.setVisible(true);
            this.het_fon.setTexture('sky2');
        }
    }

    checkMission4() {
        let distance = Phaser.Math.Distance.Between(this.robot.x, this.robot.y, this.lever.x, this.lever.y);
    
        if (distance < 60) {
            this.currentMission = 5;
            this.lever.setTint(0x00ff00);
            this.isRobotFollow = false;
            this.robot.setPosition(this.lever.x, this.lever.y);
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
        arcade: { gravity: { y: 0 } }
    },
    scene: [Splash, Demo]
};

const game = new Phaser.Game(config);