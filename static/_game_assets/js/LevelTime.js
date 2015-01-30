/**
 * Created with PyCharm.
 * User: kuznetsov-m
 * Date: 23.12.14
 * Time: 14:42
 * To change this template use File | Settings | File Templates.
 */

function LevelTime() {
    var background;
    var mole;
    var moles;

    var LIVES = 5;
    var livesLeft;
    var stayTime;
    var STAY_TIME_INITIAL = 2;
    var STAY_TIME_DELTA = 0.1;

    var levelFailed;
    var failedTimer;

    var speedMultiplier;
    var textInfo, textCount, textLives;


    this.handleAssets = function() {

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {

        }

        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            moles = [];
            livesLeft = LIVES;
            speedMultiplier = 1;
            stayTime = STAY_TIME_INITIAL;
            levelFailed = false;
            failedTimer = 0;

            var backgroundImage = loader.getResult("timeBackground");
            background = new createjs.Shape();
            background.graphics.beginBitmapFill(backgroundImage).drawRect(0, 0, backgroundImage.width, backgroundImage.height);
            background.scaleX = background.scaleY = 2;

            textInfo = new createjs.Text("Не дай Димону снова\n перевести время", "40px Verdana", "#ff0000");
            textInfo.x = w/2;
            textInfo.y = 10;
            textInfo.textAlign = "center";

            textCount = new createjs.Text(currentPoints, "30px Verdana", "#ffffff");
            textCount.x = 10;
            textCount.y = 10;

            textLives = new createjs.Text(livesLeft, "30px Verdana", "#ffffff");
            textLives.x = w - 70;
            textLives.y = 10;

            var textInfo2 = new createjs.Text("Жизней: ", "30px Verdana", "#ffffff");
            textInfo2.x = textLives.x - 10 - textInfo2.getBounds().width;
            textInfo2.y = 10;

            for (var i = 0; i < 9; i++) {
                moles.push(makeMole(i));
            }
            stage.addChild(background, textInfo, textInfo2, textLives, textCount);
        }
        else {
            stage.addChild(background, buttonNext, buttonReplayLevel);
        }
    };


    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {

            var deltaS = event.delta / 1000;
            textCount.text = currentPoints;
            textLives.text = livesLeft;
            if (!levelFailed) {
                for (var i = 0; i < 9; i++) {
                moles[i].updateStatus(deltaS);
                stage.addChild(moles[i]);
                }

                if (livesLeft <= 0) {
                    levelFailed = true;
                }
            }
            else {
                failedTimer += deltaS;
                if (failedTimer > 3) nextPhase();
            }
        }
    };

    function makeMole(index) {
        var moleImage = loader.getResult("timeMole");
        var SpriteSheet = new createjs.SpriteSheet({
            "images": [moleImage],
            "framerate": 14,
            "frames": {"regX": 0, "regY": 0, "height": 100, "width": 100},
            "animations": {
                "hidden": {"frames": [0]},
                "show": {"frames": [0, 1, 2, 3, 4, 5], "next": "stay"},
                "stay": {"frames": [5]},
                "hide": {"frames": [5, 4, 3, 2, 1], "next": "hidden"}
            }
        });

        var stageMole = new createjs.Sprite(SpriteSheet, "hidden");
        stageMole.x = 190 + (index % 3) * 240;

        stageMole.cursor = "pointer";

        stageMole.y = 80 + 92 * Math.floor(index / 3);
        stageMole.stayTimer = 0;
        stageMole.hideTimer = Math.random() * 10;

        stageMole.hide = function(isPunched) {
            if (isPunched) {
                currentPoints += 10;
                if (currentPoints % 50 == 0) stayTime -= STAY_TIME_DELTA;
                if (stayTime < STAY_TIME_DELTA) stayTime = STAY_TIME_DELTA;
            }
            else livesLeft--;
            this.stayTimer = 0;
            this.hideTimer = Math.random() * stayTime * 5;
            this.gotoAndPlay("hide");
        };

        stageMole.show = function() {
            this.gotoAndPlay("show");
            createjs.Sound.play("soundChpok", {offset: 500});
        };

        stageMole.updateStatus = function(deltaS) {
            stage.removeChild(this);
            if (this.currentAnimation == "stay") {
                this.stayTimer += deltaS;
                if (this.stayTimer > stayTime) this.hide(false);
            }
            else if (this.currentAnimation == "hidden") {
                this.hideTimer -= deltaS;
                if (this.hideTimer <= 0) this.show();
            }
        };
        stageMole.on("mousedown", function() {
            if (this.currentAnimation == "stay" && !levelFailed) {
                this.hide(true);
                createjs.Sound.play("soundSlap", { offset: 300});
            }
        });

        return stageMole;
    }

}