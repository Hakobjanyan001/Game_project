export default class Splash extends Phaser.Scene {
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
