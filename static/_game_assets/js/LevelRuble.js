function LevelRuble() {

    var PHRASES = [
        "Отскок в плюс - неизбежен",
        "Сюда нужно смотреть! И слушать, что я говорю!",
        "Если цена уйдет ниже $85, Саудовская Аравия прогорит",
        "Мировая экономика не выдержит цену на нефть в 80$",
        "Может мишке не гонять поросяток по тайге?",
        "Если бы у бабушки были внешние половые органы дедушки"
    ];

    var background, gameBackground;
    var player, coins, chute;
    var levelFailed;
    var levelFailedTimer;
    var textCount, textPhrases;

    var CORNER_TOP_LEFT = 0;
    var CORNER_TOP_RIGHT = 1;
    var CORNER_DOWN_RIGHT = 2;
    var CORNER_DOWN_LEFT = 3;

    var NUMBER_OF_POSITIONS = 9;
    var timeChangePosition;
    var speed;
    var INITIAL_TIME_CHANGE_POSITION = 1;
    var TIME_DELTA = 0.1;
    var MAX_COINS = 4;
    var nextCoin;
    var nextCoinTime;

    var SHIFT_X = 150;
    var DELTA_X = 20;

    var SHIFT_Y = 150;
    var DELTA_Y = 10;

    this.handleAssets = function() {
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("TitleBackground")).drawRect(0,0, w, h);
        stage.addChild(background);
        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
            stage.addChild(background);

        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            levelFailed = false;
            levelFailedTimer = 0;
            speed = 0;
            coins = [];
            nextCoinTime = 3;
            nextCoin = nextCoinTime;

            textCount = new createjs.Text(currentPoints, "30px Verdana", "#000000");
            textCount.x = 10;

            textPhrases = new createjs.Text("", "25px Verdana", "#000000");
            textPhrases.x = w/2;
            textPhrases.textAlign = "center";

            timeChangePosition = INITIAL_TIME_CHANGE_POSITION;

            player = makePlayer();

            gameBackground = new createjs.Shape();
            gameBackground.graphics.beginBitmapFill(loader.getResult("rubleBackground")).drawRect(0,0, w, h);
            gameBackground.scaleX = gameBackground.scaleY = 2;

            stage.on("mousedown", function(event) {
                if (!levelFailed) {
                    if (event.stageX < w/2 && event.stageY < h/2)
                        player.changeCorner(CORNER_TOP_LEFT);
                    else if (event.stageX > w/2 && event.stageY < h/2)
                        player.changeCorner(CORNER_TOP_RIGHT);
                    else if (event.stageX > w/2 && event.stageY > h/2)
                        player.changeCorner(CORNER_DOWN_RIGHT);
                    else if (event.stageX < w/2 && event.stageY > h/2)
                        player.changeCorner(CORNER_DOWN_LEFT);
                }
            });
            stage.addChild(gameBackground, player, textCount);
            for (var i = 0; i < 4; i++) {
                stage.addChild(makeChute(i));
            }
            stage.addChild(textPhrases);
        }
        else {
            stage.addChild(gameBackground, buttonReplayLevel, buttonNext);
        }
    };

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            nextCoin += deltaS;
            textCount.text = currentPoints;
            if (nextCoin >= nextCoinTime) {
                manageCoins();
            }

            for (var i = 0; i < coins.length; i++) {
                coins[i].updateStatus(deltaS);
                stage.addChild(coins[i]);
            }

            if (!levelFailed) {
                checkCoins();
            }
            else {
                levelFailedTimer+= deltaS;
                if (levelFailedTimer > 3) nextPhase();
            }
        }
    };

    function makePlayer() {
        var playerImage = loader.getResult('rublePlayer');
        var SpriteSheet = new createjs.SpriteSheet({
            "images": [playerImage],
            "framerate": 1,
            "frames": {"regX": 0, "regY": 0, "height": 300, "width": 282},
            "animations": {
                "up": {"frames": [1]},
                "down": {"frames": [0]}
            }
        });

        var stagePlayer = new createjs.Sprite(SpriteSheet, "up");

        stagePlayer.x = w / 2;
        stagePlayer.y = 80;
        stagePlayer.regX = 141;

        stagePlayer.corner = 1;

        stagePlayer.changeCorner = function(cornerNumber) {
            if (cornerNumber == 0 || cornerNumber == 1) this.gotoAndPlay("up");
            else this.gotoAndPlay("down");

            if (cornerNumber == 1 || cornerNumber == 2) this.scaleX = 1;
            else this.scaleX = -1;

            this.corner = cornerNumber;
        };
        return stagePlayer;
    }

    function makeCoin() {
        var coinImage = loader.getResult("rubleCoin");
        var stageCoin = new createjs.Shape();
        stageCoin.graphics.beginBitmapFill(coinImage).drawRect(0, 0, coinImage.width, coinImage.height);
        stageCoin.regX = coinImage.width / 2;
        stageCoin.regY = coinImage.height / 2;

        stageCoin.corner = Math.floor(Math.random() * 4);
        stageCoin.positionNumber = 0;
        stageCoin.timerChange = 0;


        stageCoin.isDown = false;

        stageCoin.isReadyToFall = function() {
            return this.positionNumber >= NUMBER_OF_POSITIONS;
        };
        stageCoin.kill = function() {
            if (!this.isDown) {
                this.isDown = true;
                createjs.Sound.play("soundEggDrop");
            }
        };

        stageCoin.width = coinImage.width;
        stageCoin.height = coinImage.height;

        stageCoin.updateStatus = function(deltaS) {
            stage.removeChild(this);
            if (this.positionNumber < NUMBER_OF_POSITIONS ) {
                this.timerChange += deltaS;
                if (this.timerChange >= timeChangePosition) {
                    this.positionNumber++;
                    this.timerChange = 0;

                    createjs.Sound.play("soundEggMove");
                }
                if (this.corner == CORNER_TOP_LEFT || this.corner == CORNER_DOWN_LEFT) {
                    this.x = this.width/2 + SHIFT_X + DELTA_X * this.positionNumber;
                    this.rotation = (360 / NUMBER_OF_POSITIONS) * this.positionNumber;
                }
                else {
                    this.x = w - this.width/2 - SHIFT_X - DELTA_X * this.positionNumber;
                    this.rotation = 360 - (360 / NUMBER_OF_POSITIONS) * this.positionNumber;
                }

                if (this.corner == CORNER_TOP_RIGHT || this.corner == CORNER_TOP_LEFT) {
                    if (!this.isDown) this.y = this.height / 2 + DELTA_Y * this.positionNumber;
                }
                else {
                    this.y = this.height / 2+ SHIFT_Y  + DELTA_Y * this.positionNumber;
                }
            }

            if (this.isDown) {
                this.y = h - this.height - 10;
                this.rotation = 180;
            }

        };

        return stageCoin;
    }

    function makeChute(corner) {
        var chuteImage = loader.getResult("rubleChute");
        var stageChute = new createjs.Shape();
        stageChute.graphics.beginBitmapFill(chuteImage).drawRect(0, 0, chuteImage.width, chuteImage.height);
        stageChute.regX = chuteImage.width / 2;
        if (corner == CORNER_TOP_LEFT || corner == CORNER_DOWN_LEFT) {
            stageChute.x = SHIFT_X - 25 + chuteImage.width / 2;
            stageChute.scaleX = -1;
        }
        else stageChute.x = w - SHIFT_X + 25 - chuteImage.width / 2;

        if (corner == CORNER_TOP_LEFT || corner == CORNER_TOP_RIGHT) {
            stageChute.y = 50;
        }
        else stageChute.y = 50 + SHIFT_Y;

        return stageChute;

    }

    function checkCoins() {
        for (var ind = coins.length - 1; ind >= 0; ind--) {
            if (coins[ind].isReadyToFall()) {
                if (player.corner == coins[ind].corner) {
                    stage.removeChild(coins[ind]);
                    coins.splice(ind, 1);

                    currentPoints += 10;

                    createjs.Sound.play("soundEggCatch");
                    textPhrases.text = PHRASES[Math.floor(Math.random()*PHRASES.length)];

                    if (currentPoints % 50 == 0) {
                        speed++;
                        timeChangePosition = INITIAL_TIME_CHANGE_POSITION - speed * TIME_DELTA;
                        if (timeChangePosition < TIME_DELTA) timeChangePosition = TIME_DELTA;
                        nextCoinTime -= speed * TIME_DELTA;
                        if (nextCoinTime < TIME_DELTA) nextCoinTime = TIME_DELTA;
                    }
                }
                else {
                    coins[ind].kill();
                    levelFailed = true;
                }
            }
        }
    }

    function manageCoins() {
        if (speed + 1 > coins.length && coins.length < MAX_COINS) {
            var newCoin = makeCoin();
            var hasSameCorner = false;
            for (var i = 0; i < coins.length; i++) {
                if (coins[i].corner == newCoin.corner) {
                    hasSameCorner = true;
                    break;
                }
            }
            if (!hasSameCorner) {
                coins.push(newCoin);
                nextCoin = 0;
            }
            else {
                manageCoins();
            }
        }
    }
}