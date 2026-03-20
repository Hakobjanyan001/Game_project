const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 600 },
            debug: false
        }
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

let platforms;
let bell;

// Arlo xax=i hamar
let currentMission = 1;
let missionText;
let villageCenter;
let missionStatus = "incomplete";
let het_fon;

const game = new Phaser.Game(config);

function preload() {    
    // hetevi fony
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('sky2', 'https://labs.phaser.io/assets/skies/space2.png');

    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('star', 'assets/star.png');
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
    this.load.image('orb', 'https://labs.phaser.io/assets/sprites/aqua_ball.png');
}

function create() {
    het_fon = this.add.image(400, 300, 'sky');

    player = this.physics.add.sprite(100, 300, 'dude');
    player.setCollideWorldBounds(true);

    orb = this.physics.add.staticImage(600, 300, 'orb');
    orb.setTint(0xff0000); // funkcia vory ognma nkari guyny

    //Gexamej-y missia 2 
    villageCenter = this.physics.add.staticImage(100,100, 'ball');
    villageCenter.setTint(0xffff00);
    villageCenter.setAlpha(0); // minchev missia 1-i avarty antesaneli

    cursors = this.input.keyboard.createCursorKeys();

    platforms = this.physics.add.staticGroup();

    // Arlo-i hamar hartak
    platforms.create(400, 500, 'orb').setScale(20, 1).refreshBody();

    // Ashtaraki hartak
    platforms.create(300, 450, 'orb');
    platforms.create(250, 350, 'orb');
    platforms.create(200, 250, 'orb');

    // zangy ashtaraki vra
    bell = this.physics.add.staticImage(200, 200, 'star');
    bell.setTint(0xffd700);
    bell.setAlpha(0); // hmi taqcraca, kereva missia 3-i jamanak,

    this.physics.add.collider(player, platforms); // Arloin hartaki hetenq kapium
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0); // Կանգնեցնում ենք, եթե ոչինչ սեղմված չէ
    }
    
    if (cursors.up.isDown /*&& player.body.touching.down*/) {
        player.setVelocityY(-450);
    }

    let distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if(currentMission == 1) {
        checkMission1(this);
    } else if(currentMission == 2) {
        checkMission2(this);
    } else if(currentMission == 3) {
        checkMission3(this);
    }

    if(currentMission >= 2) {
        orb.setVisible(false); // erb heruana kori
        orb.disableBody(true, true); // nev fizikapes kori baxumic ban charajana
    }
}

function checkMission1(scene) {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if (distance < 20) {
        currentMission = 2;
        
        orb.setTint(0x00ff00); 

        scene.cameras.main.fadeOut(500, 0, 0); // ekrany sevana 500 milivarkyan
        scene.cameras.main.once('camerafadeoutcomplete', () => {
            het_fon.setTexture('sky2');
            scene.cameras.main.fadeIn(500, 0, 0); // ekrany noric bacvi
        })
        
        villageCenter.setAlpha(1) //missa 1-i avarti verjum haytnvi missa 2-i skizby
    }
}

function checkMission2(scene) {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, villageCenter.x, villageCenter.y);
    if(distance < 20) {
        currentMission = 3; // hasav gexamej poxv ec 3-rd missa
        villageCenter.setTint(0xffffff);
        bell.setAlpha(1); // zangy arden haytnvuma
    }
}

function checkMission3(scene) {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, bell.x, bell.y);
    if(distance < 20) {
        currentMission = 4;
        bell.setTint(0xff00ff); 
    }
}