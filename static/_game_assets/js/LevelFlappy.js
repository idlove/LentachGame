function LevelFlappy() {
    var isStarted, isPressed;
    var background, bird;
    var textCount, textInfo;

    var columnImage;
    var columns;
    var nextColumnsTimer;
    var nextColumnsTime;
    var NEXT_COLUMNS_TIME_INITIAL = 1.7;

    var timeFlew;

    this.handleAssets = function() {
        columnImage = loader.getResult('flappyColumn');
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult('flappyBackground')).drawRect(0, 0, w, h);

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            isStarted = false;
            isPressed = false;
            timeFlew = 0;
            bird = makeBird();
            columns = [];
            nextColumnsTimer = 0;
            nextColumnsTime = NEXT_COLUMNS_TIME_INITIAL;

            textCount = new createjs.Text(currentPoints, "30px Verdana", "#000000");
            textCount.x = 10;

            textInfo = new createjs.Text("Проведите Алексея на Манежку", "30px Verdana", "#000000");
            textInfo.textAlign = 'center';
            textInfo.x = w/2;
            textInfo.y = 10;

            stage.on("mousedown", function() {
                isStarted = true;
                if (!isPressed) {
                    bird.jump();
                    if (!isPressed) stage.removeChild(textInfo);
                    isPressed = true;
                }
            });
            stage.on("pressup", function() {
                isPressed = false;
            });
            stage.addChild(background, bird, textCount, textInfo);
            addColumns();
        }
        else {
            stage.addChild(background, buttonReplayLevel, buttonNext);
        }
    };

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            bird.updateStatus(deltaS);
            if (isStarted) {
                timeFlew += deltaS;
                currentPoints = Math.floor(timeFlew);

                for (var i = columns.length - 1; i >= 0; i--) {
                    columns[i].updateStatus(deltaS);
                    if (columns[i].x < -50) {
                        columns.splice(i, 1);
                    }
                    else {
                        stage.addChildAt(columns[i], 1);
                    }
                }
                nextColumnsTimer += deltaS;
                if (nextColumnsTimer > nextColumnsTime) {
                    nextColumnsTimer = 0;
                    addColumns();
                }

                textCount.text = currentPoints;
            }
        }
    };

    function makeBird() {
        var birdImage = loader.getResult('flappyBird');
        var newBird = new createjs.Shape();
        newBird.graphics.beginBitmapFill(birdImage).drawRect(0, 0, birdImage.width, birdImage.height);
        newBird.regX = newBird.regY = birdImage.width / 2;
        newBird.x = 120;
        newBird.y = h/2;
        newBird.velocityY = 150;

        newBird.updateStatus = function(deltaS) {
            if (isStarted) {
                this.y += this.velocityY * deltaS;
                this.velocityY += deltaS * 250;
                if (this.y > h + 40 || this.y < -40) this.kill();
            }
        };
        newBird.jump = function() {
            this.velocityY = -150;
        };
        newBird.kill = function() {
            createjs.Sound.play("soundAlien");
            nextPhase();
        };

        return newBird;
    }

    function makeColumn(x, y, isUpsideDown) {
        var newColumn = new createjs.Shape();
        newColumn.graphics.beginBitmapFill(columnImage).drawRect(0, 0, columnImage.width, columnImage.height);
        newColumn.regX = columnImage.width / 2;
        newColumn.regY = columnImage.height / 2;
        if (isUpsideDown) newColumn.rotation = 180;
        newColumn.x = x;
        newColumn.y = y;
        newColumn.velocityX = 150;
        newColumn.updateStatus = function(deltaS) {
            stage.removeChild(this);
            this.x -= this.velocityX * deltaS;

            if (this.x -30 < bird.x + 35 &&
                this.x + 30 > bird.x -35 &&
                this.y - 180 < bird.y + 35 &&
                this.y + 180 > bird.y - 35) {
                bird.kill();
            }
        };
        return newColumn;
    }

    function addColumns() {
        var column1 = makeColumn(w + 100, Math.random() * 250 - 200, true);
        var column2 = makeColumn(w + 100, column1.y + 600, false);
        columns.push(column1);
        columns.push(column2);
    }
}
