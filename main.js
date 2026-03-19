const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let orb;
let cursors;

// Arlo xax=i hamar
let currentMission = 1;
let missionText;
let villageCenter;
let missionStatus = "incomplete";

const game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('https://labs.phaser.io');
    
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
    this.load.image('orb', 'assets/sprites/aqua_ball.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    player = this.physics.add.image(100, 300, 'ball');
    player.setCollideWorldBounds(true);

    orb = this.physics.add.staticImage(700, 300, 'orb');
    orb.setTint(0xff0000); // funkcia vory ognma nkari guyny

    //Gexamej-y missia 2 
    villageCenter = this.physics.add.staticImage(100,100, 'orb');
    villageCenter.setTint(0xffff00);
    villageCenter.setAlpha(0); // minchev missia 1-i avarty antesaneli

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocity(0); // erb stexn chka sexmac kangni inerciai tak chgna

    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    
    if (cursors.up.isDown) player.setVelocityY(-200);
    else if (cursors.down.isDown) player.setVelocityY(200);

    if(currentMission == 1) {
        checkMission1();
    } else if(currentMission == 2) {
        checkMission2();
    }

    let distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if(currentMission >= 2 && distance > 100) {
        orb.setVisible(false); // erb heruana kori
        orb.disableBody(true, true); // nev fizikapes kori baxumic ban charajana
    } else {
        orb.setVisible(true);
    }
}

function checkMission1() {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if (distance < 20) {
        currentMission = 2;
        
        orb.setTint(0x00ff00); 

        villageCenter.setAlpha(1) //missa 1-i avarti verjum haytnvi missa 2-i skizby
    }
}

function checkMission2() {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, villageCenter.x, villageCenter.y);
    if(distance < 20) {
        currentMission = 3; // hasav gexamej poxv ec 3-rd missa
        villageCenter.setTint(0xffffff);
    }
}