import Splash from './scenes/Splash.js';
import Demo from './scenes/Demo.js';

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
