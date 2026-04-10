import MissionManager from '../missions/Mission.js';

export default class Demo extends Phaser.Scene {
    constructor() {
        super({ key: 'Demo' });
    }

    preload() {
        this.load.tilemapTiledJSON('map1', '../assets/map_1.json');
        this.load.tilemapTiledJSON('map2', '../assets/map_2.json');

        this.load.image('Tileset_TallGrass', '../My project assets/Grass and trees/Tileset_TallGrass.png');
        this.load.image('Tileset_Water', '../My project assets/Water/Tileset_Water.png');
        this.load.image('Waterfall', '../My project assets/Water/Waterfall.png');
        this.load.image('Atlas_Trees_Bushes', '../My project assets/Grass and trees/Atlas_Trees_Bushes.png');
        this.load.image('Atlas_Buildings_Wood_LightGreen', '../My project assets/Buildings/Atlas_Buildings_Wood_LightGreen.png');
        this.load.image('Atlas_Buildings_Bridges', '../My project assets/Buildings/Atlas_Buildings_Bridges.png');
        this.load.image('Rocks', '../My project assets/Rocks/Rocks.png');

        this.load.image('sky2', 'https://labs.phaser.io/assets/skies/space2.png');
        this.load.image('sky3', 'assets/sky.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('platform1', 'assets/platform.png');
        this.load.image('platform2', 'assets/platform.png');
        this.load.image('platform3', 'assets/platform.png');
        this.load.image('platform4', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('ball', 'assets/shinyball.png');
        this.load.image('orb', 'assets/aqua_ball.png');
        this.load.image('robot', 'assets/exocet_spaceshipship.png');
        this.load.image('lever', 'assets/clown.png');
        this.load.image('farmer', 'assets/phi_hammer.png');
        this.load.image('apple', 'assets/apple.png');
        this.load.image('basket', 'assets/basket.png');
        this.load.image('villager', 'assets/fof.png');
        this.load.image('Buildings_Settlement', '../My project assets/Buildings/Buildings_Settlement.png');
    }

    create() {
        this.isTransitioning = false;
        const map = this.make.tilemap({ key: 'map1' });
        const tsTallGrass = map.addTilesetImage('Tileset_TallGrass', 'Tileset_TallGrass');
        const tsWater = map.addTilesetImage('Tileset_Water', 'Tileset_Water');
        const tsWaterfall = map.addTilesetImage('Waterfall', 'Waterfall');
        const tsTrees = map.addTilesetImage('Atlas_Trees_Bushes', 'Atlas_Trees_Bushes');
        const tsBuildings = map.addTilesetImage('Atlas_Buildings_Wood_LightGreen', 'Atlas_Buildings_Wood_LightGreen');
        const tsBridges = map.addTilesetImage('Atlas_Buildings_Bridges', 'Atlas_Buildings_Bridges');
        const tsRocks = map.addTilesetImage('Rocks', 'Rocks');
        const allTilesets = [tsTallGrass, tsWater, tsWaterfall, tsTrees, tsBuildings, tsBridges, tsRocks];

        this.mapLayer1 = map.createLayer('Հետին ֆոն_1', allTilesets, 0, 0);
        this.mapLayer2 = map.createLayer('Հետին ֆոն_2', allTilesets, 0, 0);
        this.mapLayer3 = map.createLayer('Հետին ֆոն _3', allTilesets, 0, 0);
        this.mapLayer4 = map.createLayer('Կառույցներ_1', allTilesets, 0, 0);

        const scaleX = 800 / (map.widthInPixels);
        const scaleY = 600 / (map.heightInPixels);
        [this.mapLayer1, this.mapLayer2, this.mapLayer3, this.mapLayer4].forEach(l => {
            if (l) l.setScale(scaleX, scaleY);
        });

        this.mapLayers = [this.mapLayer1, this.mapLayer2, this.mapLayer3, this.mapLayer4];

        this.bgSky2 = this.add.image(400, 300, 'sky2').setVisible(false).setDepth(0);
        this.bgSky3 = this.add.image(400, 300, 'sky3').setVisible(false).setDepth(0);

        this.het_fon = {
            setTexture: (key) => {
                if (key === 'sky2' || key === 'map2') this.changeMap('map2');
                else if (key === 'sky3') {
                    this.mapLayers.forEach(l => l && l.setVisible(false));
                    this.bgSky2.setVisible(false);
                    this.bgSky3.setVisible(true);
                }
            }
        };

        this.player = this.physics.add.sprite(200, 460, 'dude').setDepth(1);
        this.player.setCollideWorldBounds(true);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(10, 410, 'platform1').setScale(2, 0.1).setAlpha(0).refreshBody();
        this.platforms.create(10, 490, 'platform2').setScale(1.7, 0.1).setAlpha(0).refreshBody();

        this.platforms.setVisible(true);
        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.orb = this.physics.add.staticImage(350, 470, 'orb').setTint(0xff0000).setVisible(true);
        this.villageCenter = this.physics.add.staticImage(100, 100, 'ball').setTint(0xffff00).setVisible(false);
        this.bell = this.physics.add.staticImage(200, 200, 'star').setTint(0xffd700).setVisible(false);
        this.robot = this.physics.add.sprite(400, 200, 'robot').setScale(0.8).setVisible(false);
        this.lever = this.physics.add.staticImage(700, 150, 'star').setTint(0xff0000).setVisible(false);

        this.currentMission = 1;
        this.isRobotFollow = false;
        this.orbCollected = false;

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

        this.missions.update();
    }

    changeMap(mapKey) {
        this.mapLayers.forEach(l => l && l.destroy());
        this.mapLayers = [];

        const map = this.make.tilemap({ key: mapKey });

        // Tileset Name mapping between JSON and preloaded keys
        const tilesetMapping = {
            'Tileset_TallGrass': 'Tileset_TallGrass',
            'Tileset_Water': 'Tileset_Water',
            'Waterfall': 'Waterfall',
            'Atlas_Trees_Bushes': 'Atlas_Trees_Bushes',
            'Atlas_Buildings_Wood_LightGreen': 'Atlas_Buildings_Wood_LightGreen',
            'Atlas_Buildings_Bridges': 'Atlas_Buildings_Bridges',
            'Rocks': 'Rocks',
            // Map 2 specifics (using Unicode escape \u058A for the Armenian hyphen ՝)
            'Grass_2': 'Tileset_TallGrass',
            'Trees_2': 'Atlas_Trees_Bushes',
            'Rocks\u058A2': 'Rocks',
            'Atlas_Buildings_2': 'Atlas_Buildings_Bridges',
            'Buildings_Settlement\u058A2': 'Buildings_Settlement',
            'Atlas_Buildings_Wood_LightGreen-2': 'Atlas_Buildings_Wood_LightGreen'
        };

        const activeTilesets = [];
        map.tilesets.forEach(ts => {
            const imageKey = tilesetMapping[ts.name] || ts.name;
            const phaserTs = map.addTilesetImage(ts.name, imageKey);
            if (phaserTs) activeTilesets.push(phaserTs);
        });

        const scaleX = 800 / map.widthInPixels;
        const scaleY = 600 / map.heightInPixels;

        map.layers.forEach(layerData => {
            const l = map.createLayer(layerData.name, activeTilesets, 0, 0);
            if (l) {
                l.setScale(scaleX, scaleY);
                l.setDepth(0);
                this.mapLayers.push(l);
            }
        });
    }

    spawnApples() {
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(200, 700);
            let y = Phaser.Math.Between(200, 500);
            this.apples.create(x, y, 'ball').setTint(0xff0000);
        }
    }
}
