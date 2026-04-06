export default class MissionManager {
    constructor(scene) {
        this.scene = scene;
    }

    update() {
        const s = this.scene;
        if (s.currentMission === 1) this.checkMission1();
        else if (s.currentMission === 2) this.checkMission2();
        else if (s.currentMission === 3) this.checkMission3();
        else if (s.currentMission === 4) this.checkMission4();
        else if (s.currentMission === 5) this.checkMission5();
    }

    checkMission1() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.orb.x, s.orb.y) < 30) {
            s.orb.setVisible(false).disableBody(true, true);
            s.currentMission = 2;
            s.villageCenter.setVisible(true);
            s.het_fon.setTexture('sky2');
        }
    }

    checkMission2() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.villageCenter.x, s.villageCenter.y) < 30) {
            s.villageCenter.setVisible(false).disableBody(true, true);
            s.currentMission = 3;
            s.bell.setVisible(true);
            s.het_fon.setTexture('sky3');
        }
    }

    checkMission3() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.bell.x, s.bell.y) < 30) {
            s.currentMission = 4;
            s.bell.setTint(0xff00ff);
            s.robot.setVisible(true);
            s.lever.setVisible(true);
            s.bell.setVisible(false);
            s.het_fon.setTexture('sky2');

        }
    }

    checkMission4() {
        const s = this.scene;
        let distance = Phaser.Math.Distance.Between(s.robot.x, s.robot.y, s.lever.x, s.lever.y);
        if (s.isRobotFollow && distance < 40) {
            s.currentMission = 5;
            s.lever.setTint(0x00ff00);
            s.isRobotFollow = false;
            s.robot.setPosition(s.lever.x, s.lever.y);
            s.robot.setVisible(false);
            s.lever.setVisible(false);
        }
    }

    checkMission5() {
        const s = this.scene;
        s.farmer.setVisible(true);
        s.basket.setVisible(true);
        s.appleScoreText.setVisible(true);
        s.physics.overlap(s.player, s.apples, (player, apple) => {
            apple.disableBody(true, false);
            s.tweens.add({
                targets: apple,
                x: s.basket.x,
                y: s.basket.y,
                scale: 0.2,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    apple.destroy();
                    s.applesCollected++;
                    s.appleScoreText.setText('Apples: ' + s.applesCollected);
                    s.basket.setTint(0xffff00);
                    if (s.applesCollected >= 5) {
                        s.currentMission = 6;
                    }
                }
            });
        });
    }
}