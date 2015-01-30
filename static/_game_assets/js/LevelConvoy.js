function LevelConvoy() {

    var field, background;
    var cars;

    var textCount, textDescription;

    var carImage;

    var moveTimer;
    var nextMoveTime;

    var extraOnField;

    var MOVE_TIMER_INITIAL = 1;
    var MOVE_TIMER_DELTA = 0.1;

    var levelFailed;
    var levelFailedTimer;

    var readyToAdd;

    var extraCar;

    var KEYCODE_UP = 38;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;
    var KEYCODE_DOWN = 40;

    var carLoop;

    this.handleAssets = function() {
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("convoyBackground")).drawRect(0, 0, w, h);
        background.scaleX = background.scaleY = 2;

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
            //showDescription("d9");
        }

        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            cars = [];

            carLoop = createjs.Sound.play("soundCar", {loop: -1});
            carLoop.volume = 0.25;

            carImage = loader.getResult("convoyCar");
            levelFailed = false;
            levelFailedTimer = 0;


            moveTimer = 0;
            nextMoveTime = MOVE_TIMER_INITIAL;
            readyToAdd = false;

            textCount = new createjs.Text(currentPoints, "30px Verdana", "#000000");
            textCount.x = 10;

            textDescription = new createjs.Text("Собери весь\nконвой!", "30px Verdana", "#000000");
            textDescription.textAlign = "center";
            textDescription.x = 150;
            textDescription.y = h/2;

            extraOnField = false;

            field = new createjs.Shape();
            field.graphics.beginBitmapFill(loader.getResult("convoyField")).drawRect(0, 0, 400, 400);

            field.x = w/2 - 200;

            buttonControlUp.x = buttonControlDown.x =  770;
            buttonControlLeft.x = 680;
            buttonControlRight.x = 860;
            buttonControlUp.y = h / 2 - 150;
            buttonControlDown.y = h / 2 + 50;

            buttonControlUp.on("pressup", function() {controlledMove("up")});
            buttonControlDown.on("pressup", function() {controlledMove("down")});
            buttonControlLeft.on("pressup", function() {controlledMove("left")});
            buttonControlRight.on("pressup", function() {controlledMove("right")});

            buttonControlRight.y = buttonControlLeft.y = h/2 - 50;

            extraCar = makeExtraCar();
            stage.addChild(background, field, textCount, textDescription,
                buttonControlUp, buttonControlDown, buttonControlLeft, buttonControlRight);

            cars.push(makeCar(4, 4, 5, 4));

            window.addEventListener("keyup", function(event) {
                if (levelFailed) return;
                var dirName = "";
                if (event.keyCode == KEYCODE_LEFT) dirName = "left";
                else if (event.keyCode == KEYCODE_RIGHT) dirName = "right";

                else if (event.keyCode == KEYCODE_UP) dirName = "up";
                else if (event.keyCode == KEYCODE_DOWN) dirName = "down";
                controlledMove(dirName);
            });

        }

        else {
            stage.addChild(background, buttonNext, buttonReplayLevel);
        }


    };


    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            textCount.text = currentPoints;

            var deltaS = event.delta / 1000;
            for (var i = 0; i < cars.length; i++) {
                cars[i].updateStatus(deltaS);
                extraCar.updateStatus(deltaS);
                stage.addChild(cars[i]);
            }
            stage.addChild(extraCar);

            if (!extraOnField) {
                extraCar.renewPosition();
            }
            moveTimer += deltaS;
            if (moveTimer >= nextMoveTime && !levelFailed) {
                makeMove();
                checkCollisions();
                moveTimer = 0;
            }
            if (levelFailed) {
                levelFailedTimer += deltaS;
                if (levelFailedTimer > 3) nextPhase();
            }
        }
    };


    function controlledMove(direction) {
        if (direction == "left") {
            if (cars[0].nextFieldPosition.x <= cars[0].fieldPosition.x) {
                if (cars[0].nextFieldPosition.x == cars[0].fieldPosition.x) {
                    cars[0].nextFieldPosition.x--;
                    cars[0].nextFieldPosition.y = cars[0].fieldPosition.y;
                }
                moveTimer = nextMoveTime;
            }
        }
        else if (direction == "right") {
            if (cars[0].nextFieldPosition.x >= cars[0].fieldPosition.x) {
                if (cars[0].nextFieldPosition.x == cars[0].fieldPosition.x) {
                    cars[0].nextFieldPosition.x++;
                    cars[0].nextFieldPosition.y = cars[0].fieldPosition.y;
                }
                moveTimer = nextMoveTime;
            }
        }

        else if (direction == "up") {
            if (cars[0].nextFieldPosition.y <= cars[0].fieldPosition.y) {
                if (cars[0].nextFieldPosition.y == cars[0].fieldPosition.y) {
                    cars[0].nextFieldPosition.y--;
                    cars[0].nextFieldPosition.x = cars[0].fieldPosition.x;
                }
                moveTimer = nextMoveTime;
            }
        }
        else if (direction == "down") {
            if (cars[0].nextFieldPosition.y >= cars[0].fieldPosition.y) {
                if (cars[0].nextFieldPosition.y == cars[0].fieldPosition.y) {
                    cars[0].nextFieldPosition.y++;
                    cars[0].nextFieldPosition.x = cars[0].fieldPosition.x;
                }
                moveTimer = nextMoveTime;
            }
         }
    }


    function checkCollisions() {
        if (cars[0].fieldPosition.x == extraCar.fieldPosition.x && cars[0].fieldPosition.y == extraCar.fieldPosition.y) {
            extraCar.remove();
            readyToAdd = true;
            score();
        }
        if (cars[0].fieldPosition.x < 0 ||
            cars[0].fieldPosition.x > 9 ||
            cars[0].fieldPosition.y < 0 ||
            cars[0].fieldPosition.y > 9) levelFailed = true;
        if (cars.length > 1) {
            for (var i = 1; i < cars.length; i++) {
                if (cars[0].fieldPosition.x == cars[i].fieldPosition.x &&
                    cars[0].fieldPosition.y == cars[i].fieldPosition.y) {
                    levelFailed = true;

                }
            }
        }
        if (levelFailed) {
            createjs.Sound.play("soundAlien");
            carLoop.stop();


        }

    }

    function score() {
        createjs.Sound.play("soundAlien");
        currentPoints += 5;
        if (currentPoints % 25 == 0) nextMoveTime -= MOVE_TIMER_DELTA;
        if (nextMoveTime < MOVE_TIMER_DELTA) nextMoveTime = MOVE_TIMER_DELTA;
    }


    function makeMove() {
        var arrLength;
        if (!readyToAdd) arrLength = cars.length;
        else arrLength = 1;

        for (var i = 0; i < arrLength; i++) {
            var nextX = cars[i].nextFieldPosition.x;
            var nextY = cars[i].nextFieldPosition.y;

            if (cars[i].nextFieldPosition.x > cars[i].fieldPosition.x) nextX++;
            if (cars[i].nextFieldPosition.x < cars[i].fieldPosition.x) nextX--;
            if (cars[i].nextFieldPosition.y > cars[i].fieldPosition.y) nextY++;
            if (cars[i].nextFieldPosition.y < cars[i].fieldPosition.y) nextY--;

            if (i + 1 < arrLength) {
                cars[i+1].nextFieldPosition.x = cars[i].fieldPosition.x;
                cars[i+1].nextFieldPosition.y = cars[i].fieldPosition.y;

            }

            if (readyToAdd) {
                cars.splice(1, 0, makeCar(cars[i].fieldPosition.x,
                    cars[i].fieldPosition.y,
                    cars[i].nextFieldPosition.x,
                    cars[i].nextFieldPosition.y));
                readyToAdd = false;
            }
            cars[i].moveAuto(nextX, nextY);
        }
    }

    function makeCar(fieldX, fieldY, nextX, nextY) {
        var SpriteSheet = new createjs.SpriteSheet({
            "images": [carImage],
            "frames": {"regX": 0, "regY": 0, "height": 80, "width": 80},
            "framerate": 1,
            "animations": {
                "down": {"frames": [2]},
                "up": {"frames": [1]},
                "left": {"frames": [0]},
                "right": {"frames": [0]}
            }
        });


        var car = new createjs.Sprite(SpriteSheet, "up");
        car.regX = car.regY = 40;
        car.scaleX = car.scaleY = 0.5;
        car.fieldPosition = {x: fieldX, y: fieldY};
        car.nextFieldPosition = {x: nextX, y: nextY};

        car.moveAuto = function(nextX, nextY) {


            this.fieldPosition.x = this.nextFieldPosition.x;
            this.fieldPosition.y = this.nextFieldPosition.y;
            this.nextFieldPosition.x = nextX;
            this.nextFieldPosition.y = nextY;

        };

        car.checkAnimation = function() {
            if (this.nextFieldPosition.x > this.fieldPosition.x) this.gotoAndPlay("right");
            if (this.nextFieldPosition.x < this.fieldPosition.x) this.gotoAndPlay("left");
            if (this.nextFieldPosition.y < this.fieldPosition.y) this.gotoAndPlay("up");
            if (this.nextFieldPosition.y > this.fieldPosition.y) this.gotoAndPlay("down");

        };

        car.updateStatus = function(deltsS) {
            this.checkAnimation();
            stage.removeChild(this);
            if (this.currentAnimation == "left") this.scaleX = -0.5;
            else this.scaleX = 0.5;


            if (!levelFailed) {
                this.x = 280 + 40 * this.fieldPosition.x + 20;
                this.y = 40 * this.fieldPosition.y + 20;
            }

        };

        return car;
    }


    function makeExtraCar() {
        extraCar = makeCar(-1, -1, -1, -1);

        extraCar.renewPosition = function() {
            var newPosition = getNewPosition();
            this.fieldPosition.x = this.nextFieldPosition.x = newPosition.x;
            this.fieldPosition.y = this.nextFieldPosition.y = newPosition.y;
            extraOnField = true;

        };

        extraCar.remove = function() {
            this.fieldPosition.x = this.nextFieldPosition.x = this.fieldPosition.y = this.nextFieldPosition.y = -1;
            extraOnField = false;
        };

        extraCar.onField = function() {
            return this.x >= 0;
        };

        extraCar.renewPosition();

        return extraCar;
    }


    function getNewPosition() {
        var newPosition = {x: Math.round(Math.random() * 9), y: Math.round(Math.random() * 9)};
        var onSnake = false;
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].fieldPosition.x == newPosition.x && cars[i].fieldPosition.y == newPosition.y) onSnake = true;
        }
        if (onSnake) return getNewPosition();

        return newPosition;
    }
}