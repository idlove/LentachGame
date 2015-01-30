function LevelOlympics() {
    var ring1, ring2, ring3, ring4, ring5;
    var sleeper;
    var background;

    var gameTimer, idleTimer, finishedTimer;
    var GAME_TIME = 20;

    var currLvl;
    var clicks;
    var CLICKS_NEEDED = 10;

    var tickSound;

    var textCount, textTimer, textDescription;

    this.handleAssets =  function() {
        /*var background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("olympicBackground")).drawRect(0,0, w, h);*/

        var textEndPhase = new createjs.Text("Мы победили", "40px Verdana", "#ffffff");
        textEndPhase.x = w/2 - textEndPhase.getBounds().width/2;
        textEndPhase.y = 30;

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
            //stage.addChild(background, textDescription);
        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            tickSound = createjs.Sound.play("soundClock", {loop: -1});
            tickSound.volume = 0.25;

            background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("olympicBackground")).drawRect(0,0, w, h);
            background.scaleX = background.scaleY = 2;

            gameTimer = GAME_TIME;
            finishedTimer = 0;
            clicks = 0;
            currLvl = 0;

            ring1 = createRing(true);
            ring1.x = 150;
            ring2 = createRing(true);
            ring2.x = 250;
            ring3 = createRing(false);
            ring3.x = 350;
            ring4 = createRing(true);
            ring4.x = 200;
            ring4.y = 100;
            ring5 = createRing(true);
            ring5.x = 300;
            ring5.y = 100;

            textCount = new createjs.Text(currLvl, "30px Verdana", "#ffffff");
            textCount.x = 10;
            textCount.y = 10;

            textTimer = new createjs.Text(gameTimer, "30px Verdana", "#ffffff");
            textTimer.x = w - 70;
            textTimer.y = 10;

            textDescription = new createjs.Text("Буди Димона,\nчтобы кольцо раскрылось!", "30px Verdana", "#ffffff");
            textDescription.x = 270;
            textDescription.y = 300;
            textDescription.textAlign = "center";


            sleeper = makeButton("olympicSleeper", true);
            var sleeperImage = loader.getResult("olympicSleeper");
            sleeper = new createjs.Shape();
            sleeper.graphics.beginBitmapFill(sleeperImage).drawRect(0, 0, sleeperImage.width, sleeperImage.height);
            sleeper.regX = sleeperImage.width/2;
            sleeper.regY = sleeperImage.height/2;
            sleeper.x = w - 300;
            sleeper.y = 310;
            sleeper.cursor = "pointer";

            sleeper.on("mousedown", function() {
                if (finishedTimer == 0) this.scaleX = this.scaleY = 1.2;
            });
            sleeper.on("pressup", function() {
                if (finishedTimer > 0) return;
                this.scaleX = this.scaleY = 1;
                clicks++;
                idleTimer = 0;
                if (clicks == CLICKS_NEEDED) {
                    clicks = 0;
                    currLvl++;
                }
            });

            stage.addChild(background, ring1, ring2, ring3, ring4, ring5, textCount, textTimer, sleeper, textDescription);
        }
        else if (LEVEL_PHASES[currentPhase] == "RESULTS") {
            stage.addChild(background, sleeper, buttonReplayLevel, buttonNext);
        }
    };

    function createRing(isOpen) {
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 8,
            "images": [loader.getResult("olympicRing")],
            "frames": {"regX": 0, "regY": 0, "height": 150, "width": 150},
            "animations": {
                "open": {
                    "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    "next": "opened"
                },
                "opened": {
                    "frames": [10]
                },
                "closed" : {"frames" : [0]},
                "a0": {"frames": [0]},
                "a1": {"frames": [1]},
                "a2": {"frames": [2]},
                "a3": {"frames": [3]},
                "a4": {"frames": [4]},
                "a5": {"frames": [5]},
                "a6": {"frames": [6]},
                "a7": {"frames": [7]},
                "a8": {"frames": [8]},
                "a9": {"frames": [9]},
                "a10": {"frames": [10]}
            }
        });
        var currAnimation = "open";
        if (!isOpen) currAnimation = "closed";
        var olympicRing = new createjs.Sprite(spriteSheet, currAnimation);
        olympicRing.updateStatus = function() {
            this.gotoAndPlay("a" + currLvl);
        };
        return olympicRing;
    }

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            textTimer.text = ":" + Math.ceil(gameTimer);
            textCount.text = currLvl;

            if (gameTimer <= 0 || currLvl >= 10) {
                tickSound.stop();
                textDescription.text = "Димон не проснулся,\nно мы победили!";
                finishedTimer += deltaS;
                if (finishedTimer > 3) {
                    currentPoints = currLvl * 10;
                    nextPhase();
                }
            }
            else {
                ring3.updateStatus();
                gameTimer -= deltaS;
                idleTimer += deltaS;
                if (idleTimer > 1 - 0.075 * currLvl && currLvl > 0) {
                    currLvl--;
                    idleTimer = 0;
                }
            }
            idleTimer += deltaS;
        }
    };

}
