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
        else if (s.currentMission === 6) this.checkMission6();
    }

    checkMission1() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.orb.x, s.orb.y) < 30) {
            s.isTransitioning = true;
            s.orb.setVisible(false).disableBody(true, true);
            s.currentMission = 2;
            s.isTransitioning = false;
            s.cameras.main.fadeOut(500, 0, 0, 0);
            s.platforms.clear(true, true);

            s.cameras.main.once('camerafadeoutcomplete', () => {
                s.villageCenter.setVisible(true);
                s.het_fon.setTexture('sky2');
                s.player.setPosition(260, 240);
                s.player.anims.play('turn');
                s.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    checkMission2() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.villageCenter.x, s.villageCenter.y) < 30) {
            s.isTransitioning = true;
            s.villageCenter.setVisible(false).disableBody(true, true);

            s.currentMission = 3;
            s.isTransitioning = false;
            s.cameras.main.fadeOut(500, 0, 0, 0);
            s.cameras.main.once('camerafadeoutcomplete', () => {
                s.bell.setVisible(true);
                s.het_fon.setTexture('sky3');
                s.player.setPosition(200, 100);
                s.player.anims.play('turn');
                s.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    checkMission3() {
        const s = this.scene;
        if (Phaser.Math.Distance.Between(s.player.x, s.player.y, s.bell.x, s.bell.y) < 30) {
            s.isTransitioning = true;

            s.currentMission = 4;
            s.isTransitioning = false;
            s.cameras.main.fadeOut(500, 0, 0, 0);
            s.cameras.main.once('camerafadeoutcomplete', () => {
                s.bell.setTint(0xff00ff);
                s.robot.setVisible(true);
                s.lever.setVisible(true);
                s.bell.setVisible(false);
                s.het_fon.setTexture('sky2');
                s.player.setPosition(10, 400);
                s.player.anims.play('turn');
                s.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    checkMission4() {
        const s = this.scene;
        let distance = Phaser.Math.Distance.Between(s.robot.x, s.robot.y, s.lever.x, s.lever.y);
        if (s.isRobotFollow && distance < 40) {
            s.isTransitioning = true;

            s.currentMission = 5;
            s.isTransitioning = false;
            s.cameras.main.fadeOut(500, 0, 0, 0);
            s.cameras.main.once('camerafadeoutcomplete', () => {
                s.lever.setTint(0x00ff00);
                s.isRobotFollow = false;
                s.robot.setPosition(s.lever.x, s.lever.y);
                s.robot.setVisible(false);
                s.lever.setVisible(false);
                s.het_fon.setTexture('sky3');
                s.player.setPosition(40, 250);
                s.player.anims.play('turn');
                s.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    checkMission5() {
        const s = this.scene;
        s.farmer.setVisible(true);
        s.basket.setVisible(true);
        s.appleScoreText.setVisible(true);
        if (s.apples.getLength() == 0 && s.applesCollected == 0) {
            s.spawnApples();
        }
        s.physics.overlap(s.player, s.apples, (player, apple) => {
            apple.disableBody(true, false);
            apple.destroy();
            s.applesCollected++;
            s.appleScoreText.setText('Apples: ' + s.applesCollected);
            s.basket.setTint(0xffff00);

            if (s.applesCollected >= 5 && !s.isTransitioning) {
                s.isTransitioning = true;

                s.currentMission = 6;
                s.isTransitioning = false;
                s.cameras.main.fadeOut(500, 0, 0, 0);
                s.cameras.main.once('camerafadeoutcomplete', () => {
                    s.farmer.setVisible(false);
                    s.basket.setVisible(false);
                    s.appleScoreText.setVisible(false);
                    s.het_fon.setTexture('sky2');
                    s.player.setPosition(70, 350);
                    s.player.anims.play('turn');
                    s.cameras.main.fadeIn(500, 0, 0, 0);
                });
            }
        });
    }

    checkMission6() {
        const s = this.scene;
    }
}