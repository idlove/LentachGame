function LevelDress() {
    var levelDone;
    var background, wardrobe, boy, pants;
    var pantsImage;

    var textInfo;

    this.handleAssets = function() {
        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {}

        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            levelDone = false;
            pants = [];
            pantsImage = loader.getResult("dressPants");

            textInfo = new createjs.Text("Выберите самые патриотичные трусики для распятия", "30px Verdana", "#ffffff");
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 30;

            background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("dressBackground")).drawRect(0, 0, w, h);
            background.scaleX = background.scaleY = 2;

            var wardrobeImage = loader.getResult("dressWardrobe");
            wardrobe = new createjs.Shape();
            wardrobe.graphics.beginBitmapFill(wardrobeImage).drawRect(0, 0,
                wardrobeImage.width, wardrobeImage.height);
            wardrobe.x = 20;
            wardrobe.y = h - wardrobeImage.height;

            var boyImage = loader.getResult("dressBoy");
            boy = new createjs.Shape();
            boy.graphics.beginBitmapFill(boyImage).drawRect(0, 0,
                boyImage.width, boyImage.height);

            boy.x = wardrobe.x + wardrobeImage.width + 300;
            boy.y = h - boyImage.height;


            var pts = new createjs.Shape();
            pts.graphics.beginBitmapFill(pantsImage).drawRect(0, 0, w, h);

            for (var i = 0; i < 4; i++) {
                pants.push(makePants(i));
            }
            stage.addChild(background, wardrobe,boy, textInfo);

            //finishLevel();
        }

        else {
            nextPhase();
        }

    };


    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            for (var i = 0; i < pants.length; i++) {
                pants[i].updateStatus();

                stage.addChild(pants[i]);
            }
        }

    };

    function makePants(number) {
        var SpriteSheet = new createjs.SpriteSheet({
            "images": [pantsImage],
            "framerate": 1,
            "frames": {"regX": 0, "regY": 0, "height": 42, "width": 71},
            "animations": { "static": {"frames": [number]} }

        });
        var newPants = new createjs.Sprite(SpriteSheet, "static");

        newPants.initialX = newPants.x = 80;
        newPants.initialY = newPants.y = 130 + 65 * number;

        newPants.isRight = number > 2;

        newPants.on("mousedown", function() {
            finishLevel(this.isRight);
            this.putOn();
        });

        newPants.putOn = function() {
            this.x = 554;
            this.y = 268;
        };
        newPants.putOff = function() {
            this.x = this.initialX;
            this.y = this.initialY;
        };
        newPants.updateStatus = function() {
            stage.removeChild(this);
        };
        return newPants;
    }


    function finishLevel(isRight) {

        for (var i = 0; i < pants.length; i++) {
            pants[i].putOff();
        }

        if (!levelDone) {
            levelDone = true;
            var textFinish;
            if (isRight) {
                textFinish = "Правильно!";
                currentPoints = 100;
                var fanfareSound = createjs.Sound.play("soundFanfare");
                fanfareSound.volume = 0.1;
            }
            else {
                textFinish = "Не угадал!";
                currentPoints = 0;
                stage.addChild(buttonReplayLevel);
                createjs.Sound.play("soundAlien");
            }
            textInfo.text = textFinish;
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            stage.addChild(buttonNext);

        }
    }





}
