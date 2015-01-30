
function LevelVoronezh() {
    var background;
    var player, planeBomb;
    var citizens;
    var NUMBER_OF_CITIZENS = 15;
    var textCount, textTimer;
    var MOVEMENT_LEFT = -1;
    var MOVEMENT_RIGHT = 1;
    var MOVEMENT_STOP = 0;
    var MOVE_BUTTON_SIZE = 200;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;

    var stageTimer;
    var STAGE_TIME = 15;

    this.handleAssets = function() {

        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("voronezhBackground")).drawRect(0,0, w, h);


        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {

            buttonHintLeft.x = 10;
            buttonHintRight.x = w - 110;
            buttonHintLeft.y = buttonHintRight.y = 100;

            stageTimer = STAGE_TIME;

            textCount = new createjs.Text(currentPoints, "30px Verdana", "#000000");
            textCount.x = 10;

            textTimer = new createjs.Text(stageTimer, "30px Verdana", "#000000");
            textTimer.x = w - textTimer.getBounds().width * 2;

            player = makePlane();
            planeBomb = makeBomb();

            stage.on("mousedown", function(event) {
                if (event.stageX <= MOVE_BUTTON_SIZE) player.move(true);
                if (event.stageX > w - MOVE_BUTTON_SIZE) player.move(false);
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

            citizens = [];
            stage.addChild(background, player, planeBomb, buttonHintLeft, buttonHintRight, textCount, textTimer);
            for (var i = 0; i < NUMBER_OF_CITIZENS; i++) {
                citizens.push(makeCitizen());
            }

        }
        else if (LEVEL_PHASES[currentPhase] == "RESULTS") {
            stage.addChild(background, buttonReplayLevel, buttonNext);
        }
    };

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            player.updateStatus(deltaS);
            if (planeBomb != undefined) planeBomb.updateStatus(deltaS);
            var allDead = true;
            for (var i = 0; i < citizens.length; i++) {
                citizens[i].updateStatus(deltaS);
                stage.addChild(citizens[i]);
                if (citizens[i].currentAnimation != "dead") allDead = false;
            }
            textCount.text = currentPoints;
            textTimer.text = ":" + Math.ceil(stageTimer);

            stageTimer -= deltaS;
            if (stageTimer <= 0 || allDead) nextPhase();
        }
    };

    function makePlane() {
        var planeImage = loader.getResult("voronezhPlane");
        var plane = new createjs.Shape();
        plane.graphics.beginBitmapFill(planeImage).drawRect(0, 0, planeImage.width, planeImage.height);

        plane.setBounds(0, 0, planeImage.width, planeImage.height);
        plane.x = w / 2 - plane.getBounds().width / 2;

        plane.movementDirection = MOVEMENT_STOP;

        plane.move = function(moveLeft) {
            if (moveLeft) this.movementDirection = MOVEMENT_LEFT;
            else this.movementDirection = MOVEMENT_RIGHT;
        };
        plane.stop = function() { this.movementDirection = MOVEMENT_STOP; };

        plane.regY = plane.getBounds().height / 2;
        plane.y = plane.getBounds().height / 2;
        plane.updateStatus = function(deltaS) {
            player.x += player.movementDirection * 400 * deltaS;
            if (player.x <  0) player.x = 0;
            else if (player.x > w - this.getBounds().width) player.x = w - this.getBounds().width;
            if (this.movementDirection == MOVEMENT_LEFT)
            {
                this.scaleX = -1;
                this.regX = this.getBounds().width;
            }
            else if (this.movementDirection == MOVEMENT_RIGHT) {
                this.scaleX = 1;
                this.regX = 0;
            }
        };
        return plane;
    }

    function makeBomb() {
        var bombImage = loader.getResult("voronezhBomb");
        var SpriteSheet = new createjs.SpriteSheet(
            {
                framerate: 20,
                "images": [bombImage],
                "frames": {"regX": 0, "regY": 0, "height": 50, "width": 50},
                "animations": {
                    "fly": {"frames": [0]},
                    "blast": {"frames": [6, 7, 8, 9, 10, 11], "speed": 4, "next": "stop"},
                    "stop": {"frames": [1]}
                }
            }
        );
        var bomb = new createjs.Sprite(SpriteSheet, "fly");
        bomb.setBounds(0, 0, 50, 50);
        bomb.x = player.x + player.getBounds().width / 2;
        bomb.y = 100;

        bomb.updateStatus = function(deltaS) {
            if (this.y < h - this.getBounds().height) {
                this.y += deltaS * 200;
            }
            else {
                this.y = h - this.getBounds().height;
                if (this.currentAnimation == "fly") {
                    this.gotoAndPlay("blast");
                    createjs.Sound.play("soundBlast")
                }

            }

            if (this.currentAnimation == "stop") {
                stage.removeChild(this);
                planeBomb = makeBomb();
                stage.addChild(planeBomb);
            }
        };

        return bomb;
    }

    function makeCitizen() {
        var citizenImage = loader.getResult("voronezhCitizen");
        var SpriteSheet = new createjs.SpriteSheet({
            framerate: 3,
            "images": [citizenImage],
            "frames": {"regX": 0, "regY": 0, "height": 40, "width": 40},
            "animations": {
                "run": {"frames": [0, 1, 2, 1], "speed": 3.},
                "death": {"frames": [3, 4, 5], "next": "dead", "speed": 2},
                "dead": {"frames": [5]}
            }
        });

        var citizen = new createjs.Sprite(SpriteSheet, "run");
        citizen.setBounds(0, 0, 40, 40);
        citizen.y = h - citizen.getBounds().height - 10;
        citizen.x = Math.random() * (w - citizen.getBounds().width);

        citizen.velocity =  Math.random() * 200 + 100;
        if (Math.random() < .5) citizen.velocity *= -1;

        citizen.kill = function() {
            if (this.currentAnimation == "run") this.gotoAndPlay("death");
            currentPoints += 10;
        };
        citizen.deathTimer = 0;
        citizen.removeReady = false;
        citizen.updateStatus = function(deltaS) {

            if (this.currentAnimation == "run") {
                stage.removeChild(this);
                this.x += this.velocity * deltaS;
                if ((this.x < 0 && this.velocity < 0 ) ||
                (this.x > w - this.getBounds().width && this.velocity > 0)
                ) this.velocity *= -1;

                if (this.velocity <= 0) {
                    this.regX = this.getBounds().width;
                    this.scaleX = -1;
                }
                else {
                    this.regX = 0;
                    this.scaleX = 1;
                }
                if (checkIntersection(this)) this.kill();

            }
            if (this.currentAnimation == "dead") {
                this.deathTimer += deltaS;
                if (this.deathTimer >= 5) this.removeReady = true;
            }
        };
        return citizen;
    }

    function checkIntersection(checkingCitizen) {
        return checkingCitizen.currentAnimation == "run" &&
            planeBomb.y + planeBomb.getBounds().height >= checkingCitizen.y + checkingCitizen.getBounds().height / 2 &&
            planeBomb.x + planeBomb.getBounds().width >= checkingCitizen.x &&
            planeBomb.x <= checkingCitizen.x + checkingCitizen.getBounds().width;
    }

}