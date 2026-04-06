import MissionManager from '../missions/Mission.js';

export default class Demo extends Phaser.Scene {
    constructor() {
        super({ key: 'Demo' });
    }

    preload() {
        // Tilemap (map_1.json)
        this.load.tilemapTiledJSON('map1', '../assets/map_1.json');

        // Tilesets
        this.load.image('Tileset_TallGrass', '../My project assets/Grass and trees/Tileset_TallGrass.png');
        this.load.image('Tileset_Water', '../My project assets/Water/Tileset_Water.png');
        this.load.image('Waterfall', '../My project assets/Water/Waterfall.png');
        this.load.image('Atlas_Trees_Bushes', '../My project assets/Grass and trees/Atlas_Trees_Bushes.png');
        this.load.image('Atlas_Buildings_Wood_LightGreen', '../My project assets/Buildings/Atlas_Buildings_Wood_LightGreen.png');
        this.load.image('Atlas_Buildings_Bridges', '../My project assets/Buildings/Atlas_Buildings_Bridges.png');
        this.load.image('Rocks', '../My project assets/Rocks/Rocks.png');

        // Sky backgrounds for other missions
        this.load.image('sky2', 'https://labs.phaser.io/assets/skies/space2.png');
        this.load.image('sky3', 'assets/sky.png');

        // Player & objects
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('star', 'assets/star.png');
        this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
        this.load.image('orb', 'https://labs.phaser.io/assets/sprites/aqua_ball.png');
        this.load.image('robot', 'https://labs.phaser.io/assets/sprites/exocet_spaceshipship.png');
        this.load.image('lever', 'https://labs.phaser.io/assets/sprites/clown.png');
        this.load.image('farmer', 'https://labs.phaser.io/assets/sprites/phi_hammer.png');
        this.load.image('apple', 'https://labs.phaser.io/assets/sprites/apple.png');
        this.load.image('basket', 'https://labs.phaser.io/assets/sprites/basket.png');
        this.load.image('villager', 'https://labs.phaser.io/assets/sprites/fof.png');
    }

    create() {
        // --- Build the tilemap (Mission 1 background) ---
        const map = this.make.tilemap({ key: 'map1' });

        const tsTallGrass = map.addTilesetImage('Tileset_TallGrass', 'Tileset_TallGrass');
        const tsWater = map.addTilesetImage('Tileset_Water', 'Tileset_Water');
        const tsWaterfall = map.addTilesetImage('Waterfall', 'Waterfall');
        const tsTrees = map.addTilesetImage('Atlas_Trees_Bushes', 'Atlas_Trees_Bushes');
        const tsBuildings = map.addTilesetImage('Atlas_Buildings_Wood_LightGreen', 'Atlas_Buildings_Wood_LightGreen');
        const tsBridges = map.addTilesetImage('Atlas_Buildings_Bridges', 'Atlas_Buildings_Bridges');
        const tsRocks = map.addTilesetImage('Rocks', 'Rocks');

        const allTilesets = [tsTallGrass, tsWater, tsWaterfall, tsTrees, tsBuildings, tsBridges, tsRocks];

        // Create every layer defined in Tiled
        this.mapLayers = [];
        map.layers.forEach(layerData => {
            const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
            if (layer) this.mapLayers.push(layer);
        });

        // Sky images used in later missions (hidden at start)
        this.het_fon = this.add.image(400, 300, 'sky2').setVisible(false);

        // --- Player ---
        this.player = this.physics.add.sprite(100, 300, 'dude');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();

        // --- Mission objects ---
        this.orb = this.physics.add.staticImage(600, 300, 'orb').setTint(0xff0000).setVisible(true);
        this.villageCenter = this.physics.add.staticImage(100, 100, 'ball').setTint(0xffff00).setVisible(false);
        this.bell = this.physics.add.staticImage(200, 200, 'star').setTint(0xffd700).setVisible(false);
        this.robot = this.physics.add.sprite(400, 200, 'robot').setScale(0.8).setVisible(false);
        this.lever = this.physics.add.staticImage(700, 150, 'star').setTint(0xff0000).setVisible(false);

        this.currentMission = 1;
        this.isRobotFollow = false;

        this.physics.add.overlap(this.player, this.robot, () => {
            if (this.currentMission == 4) this.isRobotFollow = true;
        }, null, this);

        this.applesCollected = 0;
        this.apples = this.physics.add.group();
        this.missions = new MissionManager(this);

        this.appleScoreText = this.add.text(80, 40, 'Apples: 0', { fontSize: '20px', fill: '#ffff' });
        this.appleScoreText.setVisible(false);

        this.farmer = this.add.image(600, 400, 'farmer').setVisible(false);
        this.basket = this.add.image(650, 420, 'star').setScale(0.5).setVisible(false);
        this.villager = this.add.image(700, 500, 'villager').setVisible(false);

        this.createAnimations();
    }

    // Call this from Mission.js when leaving mission 1 to hide the tilemap
    hideTilemap() {
        if (this.mapLayers) {
            this.mapLayers.forEach(layer => layer.setVisible(false));
        }
    }

    createAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10, repeat: -1
        });
        this.anims.create({ key: 'turn', frames: [{ key: 'dude', frame: 4 }], frameRate: 20 });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10, repeat: -1
        });
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            this.player.anims.play('turn');
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            this.player.anims.play('turn');
        } else {
            this.player.anims.play('turn');
        }

        if (this.isRobotFollow) {
            this.robot.x = this.player.x - 30;
            this.robot.y = this.player.y;
        }

        this.checkMissions();
    }

    checkMissions() {
        if (this.currentMission == 5) {
            this.farmer.setVisible(true);
            this.basket.setVisible(true);
            this.appleScoreText.setVisible(true);
            if (this.apples.getLength() == 0 && this.applesCollected == 0) {
                this.spawnApples();
            }
        }
        this.missions.update();
    }

    spawnApples() {
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(200, 700);
            let y = Phaser.Math.Between(200, 500);
            this.apples.create(x, y, 'ball').setTint(0xff0000);
        }
    }
}
