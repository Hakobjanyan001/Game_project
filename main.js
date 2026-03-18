const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update 
    }
};

let player;
let cursors;
const game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create() {
    // nerbernuma xaxacoxin ( gndaky )
    player = this.physics.add.image(400, 300, 'ball');
    player.setCollideWorldBounds(true); // tuyl chi tali dusga ekranic

    // stexcuma slaqnerin lsox sarq 
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // karavarelu uxxutyunnery
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    }
}