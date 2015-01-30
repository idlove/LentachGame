function LevelCrimea() {
    var background;
    var levelFinished;
    var buttonRight;
    var textQuestion;



    this.handleAssets = function() {
        //stage.addChild(buttonReplayLevel, buttonNext);
        if (LEVEL_PHASES[currentPhase] == "GAME") {

            levelFinished = false;
            background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("crimeaBackground")).drawRect(0, 0, w, h);
            background.scaleX = background.scaleY = 2;

            var buttonRightImage = loader.getResult("crimeaRight");
            buttonRight = new createjs.Shape();
            buttonRight.graphics.beginBitmapFill(buttonRightImage).drawRect(0, 0, buttonRightImage.width, buttonRightImage.height);


            textQuestion = new createjs.Text("Так чей же Крым?", "50px Verdana", "#FC9B2B");
            textQuestion.x = w/2 - textQuestion.getBounds().width/2;
            textQuestion.y = 220;
            stage.addChild(background, textQuestion);

            for (var i = 0; i < 4; i++) {
                stage.addChild(addButton(i));

            }
            for (var i1 = 0; i1 < 4; i1++) {
                stage.addChild(addText(i1));
            }

        }

        if (LEVEL_PHASES[currentPhase] == "RESULTS") {
            nextPhase();
            //stage.addChild(buttonReplayLevel, buttonNext);
        }

    };

    this.tick = function(event) {

    };

    function addButton(number) {
        var chooseImage = loader.getResult("crimeaChoose");
        var chooseButton = new createjs.Shape();

        chooseButton.graphics.beginBitmapFill(chooseImage).drawRect(0, 0, chooseImage.width, chooseImage.height);
        chooseButton.cursor = "pointer";
        chooseButton.choiceNumber = number;

        if (number < 2 ) chooseButton.y = 296;  else chooseButton.y = 349;
        if (number == 0 || number == 2) chooseButton.x = 143; else chooseButton.x = 482;

        chooseButton.on("mousedown", function() {
            if (!levelFinished) {
                levelFinished = true;
                buttonRight.x = this.x;
                buttonRight.y = this.y;

                var fanfareSound = createjs.Sound.play("soundFanfare");
                fanfareSound.volume = 0.1;
                if (this.choiceNumber < 3) currentPoints = 25; else currentPoints = 50;

                stage.addChildAt(buttonRight, 6);
                stage.addChild(buttonNext);
            }
        });

        return chooseButton;

    }

    function addText(number) {
        var textAnswer = new createjs.Text("", "40px Verdana", "#FC9B2B");
        textAnswer.x = 0;
        textAnswer.y = 0;

        var prefix;
        switch (number) {
            case 0:
                prefix = "A: ";
                break;
            case 1:
                prefix = "B: ";
                break;
            case 2:
                prefix = "C: ";
                break;
            case 3:
                prefix = "D: ";
                break;
        }
        var suffix;
        if (number == 3) suffix = "!"; else suffix = "";
        textAnswer.text = prefix + "Наш" + suffix;
        if (number < 2 ) textAnswer.y = 299;  else textAnswer.y = 352;
        if (number == 0 || number == 2) textAnswer.x = 163; else textAnswer.x = 502;

        return textAnswer;
    }

}
