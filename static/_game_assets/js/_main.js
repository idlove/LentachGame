var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isIE = false || !!document.documentMode;
//var isOpera = false;
//var isIE = false;

var isLoading = true;

var stage, w, h, loader;

var buttonReplayLevel, buttonNext;

var buttonControlRight, buttonControlLeft, buttonControlUp, buttonControlDown;
var buttonHintRight, buttonHintLeft, buttonHintUp, buttonHintDown;

var CONTROL_BUTTONS_OFFSET = 10;

var musicBackground;

var PLAYING_LEVELS;

var LEVEL_PHASES = [
        'DESCRIPTION',
        'GAME',
        'RESULTS'
];

var playingLevel;
var currentLevel, currentPhase, levelFailed;
var currentPoints, totalPoints;

function init() {


    if (isOpera || isIE ) { createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]); }
    else createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);

    showLoading();
    stage = new createjs.Stage('gameCanvas');
    w = stage.canvas.width;
    h = stage.canvas.height;
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);

    stage.scaleY = stage.scaleX = 1;

    var manifest = [

        {'src': 'images/buttonStartGame.png', 'id': 'buttonStartGame' },
        {'src': 'images/TitleBackground.jpg', 'id': 'TitleBackground' },
        {'src': 'images/buttonNext.png', 'id': 'buttonNext' },
        {'src': 'images/buttonReplay.png', 'id': 'buttonReplay' },
        {'src': 'images/buttonControlUp.png', 'id': 'buttonControlUp' },
        {'src': 'images/buttonControlDown.png', 'id': 'buttonControlDown' },
        {'src': 'images/buttonControlLeft.png', 'id': 'buttonControlLeft' },
        {'src': 'images/buttonControlRight.png', 'id': 'buttonControlRight' },

        {'src': 'images/_Descriptions/1.jpg', 'id': 'd1' },
        {'src': 'images/_Descriptions/2.jpg', 'id': 'd2' },
        {'src': 'images/_Descriptions/3.jpg', 'id': 'd3' },
        {'src': 'images/_Descriptions/4.jpg', 'id': 'd4' },
        {'src': 'images/_Descriptions/5.jpg', 'id': 'd5' },
        {'src': 'images/_Descriptions/6.jpg', 'id': 'd6' },
        {'src': 'images/_Descriptions/7.jpg', 'id': 'd7' },
        {'src': 'images/_Descriptions/8.jpg', 'id': 'd8' },
        {'src': 'images/_Descriptions/9.jpg', 'id': 'd9' },
        {'src': 'images/_Descriptions/10.jpg', 'id': 'd10' },
        {'src': 'images/_Descriptions/11.jpg', 'id': 'd11' },
        {'src': 'images/_Descriptions/12.jpg', 'id': 'd12' },
        {'src': 'images/_Descriptions/13.jpg', 'id': 'd13' },
        {'src': 'images/_Descriptions/_s1.jpg', 'id': 'secret1' },
        {'src': 'images/_Descriptions/_s2.jpg', 'id': 'secret2' },

        {'src': 'images/buttonHintUp.png', 'id': 'buttonHintUp' },
        {'src': 'images/buttonHintDown.png', 'id': 'buttonHintDown' },
        {'src': 'images/buttonHintLeft.png', 'id': 'buttonHintLeft' },
        {'src': 'images/buttonHintRight.png', 'id': 'buttonHintRight' },

        {'src': 'images/Level1/l1Background.jpg', 'id': 'l1Background'},
        {'src': 'images/Level1/l1Putin.png', 'id': 'l1Putin'},
        {'src': 'images/Level1/l1Bubble.png', 'id': 'l1Bubble'},

        {'src': 'images/LevelOlympics/olympicRing.png', 'id': 'olympicRing'},
        {'src': 'images/LevelOlympics/olympicSleeper.png', 'id': 'olympicSleeper'},
        {'src': 'images/LevelOlympics/olympicBackground.png', 'id': 'olympicBackground'},

        {'src': 'images/LevelGreenMen/greenMan.png', 'id': 'greenMan'},
        {'src': 'images/LevelGreenMen/greenRoom.jpg', 'id': 'greenRoom'},

        {'src': 'images/LevelBoeing/boeingPlayer.png', 'id': 'boeingPlayer'},
        {'src': 'images/LevelBoeing/boeingEnemy.png', 'id': 'boeingEnemy'},
        {'src': 'images/LevelBoeing/ball.png', 'id': 'boeingBall'},
        {'src': 'images/LevelBoeing/boeingNet.png', 'id': 'boeingNet'},
        {'src': 'images/LevelBoeing/boeingBackground.jpg', 'id': 'boeingBackground'},

        {'src': 'images/LevelVoronezh/voronezhBackground.jpg', 'id': 'voronezhBackground'},
        {'src': 'images/LevelVoronezh/voronezhPlane.png', 'id': 'voronezhPlane'},
        {'src': 'images/LevelVoronezh/voronezhBomb.png', 'id': 'voronezhBomb'},
        {'src': 'images/LevelVoronezh/voronezhCitizen.png', 'id': 'voronezhCitizen'},

        {'src': 'images/LevelG8/g8player.png', 'id': 'g8player'},
        {'src': 'images/LevelG8/g8stage.jpg', 'id': 'g8stage'},
        {'src': 'images/LevelG8/g8hole.png', 'id': 'g8hole'},
        {'src': 'images/LevelG8/g8slingshot.png', 'id': 'g8slingshot'},

        {'src': 'images/LevelTime/timeBackground.png', 'id': 'timeBackground'},
        {'src': 'images/LevelTime/timeMole.png', 'id': 'timeMole'},

        {'src': 'images/LevelRuble/rublePlayer.png', 'id': 'rublePlayer'},
        {'src': 'images/LevelRuble/rubleCoin.png', 'id': 'rubleCoin'},
        {'src': 'images/LevelRuble/rubleBackground.png', 'id': 'rubleBackground'},
        {'src': 'images/LevelRuble/rubleChute.png', 'id': 'rubleChute'},

        {'src': 'images/LevelConvoy/convoyCar.png', 'id': 'convoyCar'},
        {'src': 'images/LevelConvoy/convoyField.png', 'id': 'convoyField'},
        {'src': 'images/LevelConvoy/convoyBackground.jpg', 'id': 'convoyBackground'},

        {'src': 'images/LevelSpice/spiceBackground.png', 'id': 'spiceBackground'},
        {'src': 'images/LevelSpice/spiceCharacters.png', 'id': 'spiceCharacters'},

        {'src': 'images/LevelDress/dressBackground.png', 'id': 'dressBackground'},
        {'src': 'images/LevelDress/dressWardrobe.png', 'id': 'dressWardrobe'},
        {'src': 'images/LevelDress/dressPants.png', 'id': 'dressPants'},
        {'src': 'images/LevelDress/dressBoy.png', 'id': 'dressBoy'},

        {'src': 'images/LevelOil/oilPlayer.png', 'id': 'oilPlayer'},
        {'src': 'images/LevelOil/oilStage.jpg', 'id': 'oilStage'},
        {'src': 'images/LevelOil/oilSlingshot.png', 'id': 'oilSlingshot'},

        {'src': 'images/LevelCrimea/crimeaBackground.png', 'id': 'crimeaBackground'},
        {'src': 'images/LevelCrimea/crimeaRight.png', 'id': 'crimeaRight'},
        {'src': 'images/LevelCrimea/crimeaChoose.png', 'id': 'crimeaChoose'},
        {'src': 'images/LevelCrimea/crimeaChoose.png', 'id': 'crimeaChoose'},

        {'src': 'images/LevelFlappy/flappyBackground.jpg', 'id': 'flappyBackground'},
        {'src': 'images/LevelFlappy/flappyColumn.png', 'id': 'flappyColumn'},
        {'src': 'images/LevelFlappy/flappyBird.png', 'id': 'flappyBird'},

        {'src': 'images/LevelFinal/vk.png', 'id': 'finalShareVK'},
        {'src': 'images/LevelFinal/tw.png', 'id': 'finalShareTwitter'},
        {'src': 'images/LevelFinal/fb0.png', 'id': 'finalShareFacebook'},
        {'src': 'images/LevelFinal/ok.png', 'id': 'finalShareOK'},


        {'src': 'sounds/alien_found.mp3', 'id': 'soundAlien', data: 5},
        {'src': 'sounds/clock.mp3', 'id': 'soundClock'},
        {'src': 'sounds/slap.mp3', 'id': 'soundSlap', data: 8},
        {'src': 'sounds/chpok.mp3', 'id': 'soundChpok', data: 8},
        {'src': 'sounds/car_loop.mp3', 'id': 'soundCar'},
        {'src': 'sounds/bomb.mp3', 'id': 'soundBlast', data: 5},
        {'src': 'sounds/whoo.mp3', 'id': 'soundWhoo'},
        {'src': 'sounds/smash.mp3', 'id': 'soundSmash', data: 5},
        {'src': 'sounds/strike.mp3', 'id': 'soundStrike', data: 5},
        {'src': 'sounds/fanfare.mp3', 'id': 'soundFanfare'},
        {'src': 'sounds/egg_move.mp3', 'id': 'soundEggMove', data: 5},
        {'src': 'sounds/egg_drop.mp3', 'id': 'soundEggDrop'},
        {'src': 'sounds/egg_catch.mp3', 'id': 'soundEggCatch'},
        {'src': 'sounds/_music.mp3', 'id': 'soundMusic'}

    ];

    gameInit();
    loader = new createjs.LoadQueue(false);

    loader.installPlugin(createjs.Sound);
    loader.addEventListener("complete", handleAssets);
    loader.on("progress", handleProgress);
    loader.loadManifest(manifest, true, "/static/_game_assets/");
    //createjs.Sound.registerManifest(manifest, "");



    PLAYING_LEVELS = [
        new TitleMenu(),
        new Level1(), //done
        new LevelOlympics(), //+
        new LevelGreenMen(), // +
        new LevelCrimea(), //done
        new LevelG8(), //+
        new LevelDress(), //+
        new LevelBoeingGuilt(), //+
        new LevelVoronezh(), //+
        new LevelConvoy(), //+
        new LevelTime(),
        new LevelOil(), //+
        new LevelRuble(), //+
        new LevelFlappy(),
        new FinalScreen()
    ];

    playingLevel = PLAYING_LEVELS[currentLevel];
}

function gameInit() {
    currentLevel = 0;
    currentPhase = 0;
    levelFailed = false;
    currentPoints = 0;
    totalPoints = 0;
}

function showLoading() {
}

function hideLoading() {
    jQuery("#loader").hide();
}

function handleProgress() {
    $('#loader').html("ЗАГРУЗКА: " + Math.round(loader.progress * 100) + "%");
}

function handleInitialAssets() {

    buttonReplayLevel = new createjs.Shape();
    var imageReplay = loader.getResult("buttonReplay");
    buttonReplayLevel.graphics.beginBitmapFill(imageReplay).drawRect(0, 0, imageReplay.width, imageReplay.height);
    buttonReplayLevel.x = w/2 - imageReplay.width / 2 - CONTROL_BUTTONS_OFFSET;
    buttonReplayLevel.y = h - imageReplay.height - CONTROL_BUTTONS_OFFSET;
    buttonReplayLevel.cursor = "pointer";
    buttonReplayLevel.on("pressup", replayLevel);

    buttonNext = new createjs.Shape();
    var imageNext = loader.getResult("buttonNext");
    buttonNext.graphics.beginBitmapFill(imageNext).drawRect(0, 0, imageNext.width,  imageNext.height);
    buttonNext.x = w - imageNext.width - CONTROL_BUTTONS_OFFSET;
    buttonNext.y = h - imageNext.height - CONTROL_BUTTONS_OFFSET;
    buttonNext.cursor = "pointer";
    buttonNext.on("pressup", nextPhase);

    buttonControlUp = makeButton("buttonControlUp", true);
    buttonControlDown = makeButton("buttonControlDown", true);
    buttonControlLeft = makeButton("buttonControlLeft", true);
    buttonControlRight = makeButton("buttonControlRight", true);

    buttonHintUp = makeButton("buttonHintUp", false);
    buttonHintDown = makeButton("buttonHintDown", false);
    buttonHintLeft = makeButton("buttonHintLeft", false);
    buttonHintRight = makeButton("buttonHintRight", false);

}

function makeButton(imageId, isControl) {
    var newButtonImage = loader.getResult(imageId);
    var newButton = new createjs.Shape();
    newButton.graphics.beginBitmapFill(newButtonImage).drawRect(0, 0, newButtonImage.width, newButtonImage.height);
    if (isControl) newButton.cursor = "pointer";
    return newButton;
}

function handleAssets() {
    if (isLoading) {
        hideLoading();
        handleInitialAssets();
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", tick);
        isLoading = false;
    }
    jQuery("#video").hide();
    playingLevel.handleAssets();
    if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") showDescription("d" + currentLevel);
    if (LEVEL_PHASES[currentPhase] == "RESULTS") showPoints();
}

function tick(event) {
    playingLevel.tick(event);
    stage.update(event);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= PLAYING_LEVELS.length) {currentLevel = 0;}

    currentPhase = 0;
    totalPoints += currentPoints;
    currentPoints = 0;
    playingLevel = PLAYING_LEVELS[currentLevel];
}

function nextPhase() {
    currentPhase++;
    stage.removeAllChildren();
    stage.removeAllEventListeners();
    if (currentPhase >= LEVEL_PHASES.length) {
        nextLevel();
    }
    handleAssets();
}

function replayLevel() {
    currentPhase = 1;
    stage.removeAllChildren();
    stage.removeAllEventListeners();
    currentPoints = 0;
    handleAssets();
}

function showDescription(descriptionId) {
    var newDescription = new createjs.Shape();
    newDescription.graphics.beginBitmapFill(loader.getResult(descriptionId)).drawRect(0, 0, w, h);
    stage.addChild(newDescription, buttonNext);
}

function showPoints() {
    if (currentLevel == 0) return;
    var container = new createjs.Shape();
    container.graphics.beginFill("#000000").drawRect(0, 0, w, 70);
    container.x = 0;
    container.y = 200;
    var text = new createjs.Text("Счет: " + currentPoints, "50px Verdana", "#FFFFFF");
    text.textAlign = "center";
    text.x = w/2;
    text.y = 200;
    stage.addChild(container, text);
}

