function LevelSpice() {

    var background;

    var tripStarted;
    var tripTimer;
    var TRIP_TIME = 30;
    var nextCharTimer;
    var NEXT_CHAR_TIME = 1;
    var colorShift;

    var characters;
    var numberOfCharacters;
    var TOTAL_NUMBER_OF_CHARACTERS = 10;

    var filter;
    var charsImage;

    this.handleAssets = function() {
        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {

        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("spiceBackground")).drawRect(0, 0, 960, 400);

            tripStarted = false;
            tripTimer = 0;
            nextCharTimer = 0;

            colorShift = 1;

            characters = [];
            numberOfCharacters = 0;
            background.scaleX = background.scaleY = 2;

            filter = new createjs.ColorFilter(1, 1, 1, 1);

            charsImage = loader.getResult("spiceCharacters");

            background.on("click", function() {
                if (!tripStarted) tripStarted = true;
            });
            background.cursor = "pointer";
            //stage.filters = [filter];
            stage.addChild(background);
            stage.cache(0, 0, w, h);
        }
        else {
            stage.addChild(buttonNext, buttonReplayLevel);
        }

    };

    this.tick = function(event) {

        if (LEVEL_PHASES[currentPhase] == "GAME") {

            var deltaS = event.delta / 1000;
            colorShift += deltaS / 15;
            if (tripStarted) {
                stage.filters = [new createjs.ColorFilter(colorShift,
                    colorShift,
                    colorShift,
                    1)];
                stage.updateCache();
                //stage.updateCache();

                tripTimer += deltaS;
                if (numberOfCharacters < TOTAL_NUMBER_OF_CHARACTERS) {
                    nextCharTimer += deltaS;
                    if (nextCharTimer > NEXT_CHAR_TIME) {
                        nextCharTimer = 0;
                        characters.push(makeCharacter(numberOfCharacters));
                        numberOfCharacters++;

                    }
                }
                for (var i = 0; i < characters.length; i++) {
                    characters[i].updateStatus(deltaS);
                    stage.addChild(characters[i]);
                }

                if (tripTimer > TRIP_TIME) {
                    stage.filters = [];
                    stage.uncache();
                    currentPoints = Math.round(Math.random() * 50);
                    nextPhase();
                }
            }

        }


    };

    function makeCharacter(number) {
        var SpriteSheet = new createjs.SpriteSheet(
            {
                framerate: 1,
                "images": [charsImage],
                "frames": {"regX": 0, "regY": 0, "height": 200, "width": 100},
                "animations": {
                    "fly": {"frames": [number]}
                }
            }
        );
        var character = new createjs.Sprite(SpriteSheet, "fly");


        character.regX = 100;
        character.regY = 50;

        character.scaleX = character.scaleY = 1+ (Math.random() - 0.5);
        character.rotationSpeed = Math.random() * 100;

        character.x = Math.random() * (w - 250) + 150;
        character.y = Math.random() * (h - 50) + 50;
        character.velocityY = (Math.random() - 0.5) * 600;
        character.updateStatus = function(deltaS) {
            stage.removeChild(this);

            this.rotation += this.rotationSpeed * deltaS;
            this.y += this.velocityY * deltaS;
            if ((this.y <= 0 && this.velocityY < 0) ||
                (this.y >= h && this.velocityY > 0))
                this.velocityY *= -1;

        };
        return character;
    }
}
