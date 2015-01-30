function LevelBoeingGuilt() {
    var background;
    var player, enemy, ball, fieldNet;

    var gameStopped;
    var gameStoppedTimer;
    var GAME_STOPPED_TIME = 3000;

    var textCount, textInfo;

    var MOVEMENT_LEFT = -1;
    var MOVEMENT_RIGHT = 1;
    var MOVEMENT_STOP = 0;
    var MOVE_BUTTON_SIZE = 200;

    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;

    this.handleAssets = function() {

        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("boeingBackground")).drawRect(0,0, w, h);


        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") { }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            gameStopped = false;
            gameStoppedTimer = 0;

            player = makeCharacter("boeingPlayer", false);
            enemy = makeCharacter("boeingEnemy", true);

            buttonHintLeft.x = 10;
            buttonHintRight.x = w / 2 - 110;
            buttonHintLeft.y = buttonHintRight.y = 110;

            textInfo = new createjs.Text("Перекинь вину на другого!", "30px Verdana", "#000000");
            textInfo.textAlign = 'center';
            textInfo.x = w/2;
            textInfo.y = 10;

            var fieldNetImage = loader.getResult("boeingNet");
            fieldNet = new createjs.Shape();
            fieldNet.graphics.beginBitmapFill(fieldNetImage).drawRect(0, 0, fieldNetImage.width, fieldNetImage.height);
            fieldNet.x = w/2 - fieldNetImage.width/2;
            fieldNet.y = h - fieldNetImage.height;
            fieldNet.setBounds(fieldNet.x, fieldNet.y, fieldNetImage.width, fieldNetImage.height);

            stage.on("mousedown", function(event) {
                if (event.stageX > 0 && event.stageX < MOVE_BUTTON_SIZE) player.move(true);
                if (event.stageX > w/2 - MOVE_BUTTON_SIZE && event.stageX < w/2) player.move(false);
            });
            stage.on("pressup", function() {
                player.stop();
            });

            window.addEventListener("keydown", function(event) {
                if (event.keyCode == KEYCODE_LEFT) player.move(true);
                if (event.keyCode == KEYCODE_RIGHT) player.move(false);
            });
            window.addEventListener("keyup", function(event) {
                player.stop();
            });

            textCount = new createjs.Text(player.getBounds().width, "30px Verdana", "#ffffff");
            textCount.x = w/2;
            textCount.y = 60;
            ball = makeBall();

            stage.addChild(background, textInfo, buttonHintLeft, buttonHintRight, player, enemy, ball, fieldNet);
        }
        else if (LEVEL_PHASES[currentPhase] == "RESULTS") {
            currentPoints = ball.hits * 2;
            if (ball.x >= w/2) currentPoints += 150;
            stage.addChild(background, buttonReplayLevel, buttonNext);
        }
    };

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;

            if (!gameStopped) {
                player.updateStatus(deltaS);
                enemy.updateStatus(deltaS);
                ball.updateStatus(deltaS);
                checkIntersection(player);
                checkIntersection(enemy);
                checkIntersection(fieldNet);
                checkAI();
            }
            else  {
                player.stop();
                enemy.stop();
                gameStoppedTimer += event.delta;
                if (gameStoppedTimer > GAME_STOPPED_TIME) {

                    nextPhase();

                }
            }
        }
    };

    function makeCharacter(imageId, isEnemy) {
        var characterImage = loader.getResult(imageId);
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 10,
            "images": [characterImage],
            "frames": {"regX": 0, "regY": 0, "height": 150, "width": 77},
            "animations": {
                "stop": {
                    "frames": [1]
                },
                "run": {
                    "frames": [1, 0]
                }
            }
        });
        var character = new createjs.Sprite(spriteSheet, "stop");
        character.y = h - characterImage.height;
        if (isEnemy) character.x = w * 0.75;
        else character.x = w/10;
        character.movementDirection = 0;

        character.move = function(moveLeft) {
            if (this.currentAnimation != "run") this.gotoAndPlay("run");
            if (moveLeft) this.movementDirection = MOVEMENT_LEFT;
            else this.movementDirection = MOVEMENT_RIGHT;

        };
        character.stop = function() {
            if (this.currentAnimation != "stop") this.gotoAndPlay("stop");
            this.movementDirection = MOVEMENT_STOP;
        };

        character.updateStatus = function(deltaS) {
            this.x = this.x + 450 * deltaS * this.movementDirection;
            if (isEnemy) {
                if (this.x > w - characterImage.width) this.x = w - characterImage.width;
                if (this.x < w / 2) this.x = w/2;
            }
            else {
                if (this.x < 0) this.x = 0;
                if (this.x > w / 2 - characterImage.width / 2 ) this.x = w / 2 - characterImage.width / 2;
            }
        };

        character.setBounds(0,
            0,
            characterImage.width / 2,
            characterImage.height / 2 );

        return character;
    }

    function makeBall() {
        var ballImage = loader.getResult("boeingBall");
        var ball = new createjs.Shape();
        ball.graphics.beginBitmapFill(ballImage).drawRect(0, 0, ballImage.width, ballImage.height);

        ball.width = ballImage.width;
        ball.height = ballImage.height;

        ball.setBounds(0, 0, ballImage.width, ballImage.height);

        ball.velocity = [1, -1];

        ball.x = player.x + player.getBounds().width / 2;
        ball.y = player.y - ballImage.height;

        ball.hits = 0;


        ball.updateStatus = function(deltaS){
            this.x = this.x + 300 * deltaS * this.velocity[0];
            this.y = this.y + 300 * deltaS * this.velocity[1];
            this.velocity[1] += deltaS;

            if (this.y >= h - ballImage.height) {
                this.velocity = [0, 0];
                gameStopped = true;
            }

            if ((this.x <=0 && this.velocity[0] < 0) ||
                (this.x >= w - ballImage.width && this.velocity[0] > 0)
                )
                this.velocity[0] *= -1;

            if (this.y <= 0 && this.velocity[1] < 0) this.velocity[1] *= -1;
        };
        return ball;
    }

    function checkIntersection(gameObject) {
        if (ball.y + ball.getBounds().height  >= gameObject.y + 10
            && ball.x  >= gameObject.x - ball.getBounds().width
            && ball.x <= gameObject.x + gameObject.getBounds().width
                ) {
                if (ball.y + ball.getBounds().height <= gameObject.y + 20) {
                    ball.hits += 1;
                    var velocityX = 1 + ball.hits * 0.1;
                    if (ball.x + ball.getBounds().width / 2 <= gameObject.x + gameObject.getBounds().width / 2)
                    ball.velocity[0] = - velocityX;
                    else ball.velocity[0] = velocityX;
                    ball.velocity[1] = - 1. - ball.hits * 0.1;
                }
                else {
                    ball.velocity[0] *= -1;
                }
                var sound = createjs.Sound.play("soundStrike");
                sound.volume = 0.25;


            }
    }

    function checkAI() {
        if (ball.x + ball.getBounds().width / 2 > w/2)  {
            if (ball.x + ball.getBounds().width <= enemy.x + enemy.getBounds().width / 10)
                enemy.move(true);
            else
                enemy.move(false);

        }
        else {
            if (enemy.x + enemy.getBounds().width/2 > w * 0.75 + 20)
                enemy.move(true);
            else if (enemy.x + enemy.getBounds().width/2 < w * 0.75 - 20)
                enemy.move(false);
            else enemy.stop();

        }
    }
}