
function LevelGreenMen() {
    var greenMan;
    var background, greenRoom, blackBackground;

    var greenMenCount;
    var greenMenTimer;

    var greenMenTimerText;
    var textInfo;

    this.handleAssets = function() {
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("TitleBackground")).drawRect(0,0, w, h);

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {

        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            greenMenCount = 5;
            greenMenTimer = 10;
            textInfo = new createjs.Text("Найди зеленых человечков в зеленом Крыму!", "30px Verdana", "#ffffff");
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 10;

            greenMenTimerText = new createjs.Text(Math.round(greenMenTimer), "30px Verdana", "#ffffff");
            greenMenTimerText.x = w -  greenMenTimerText.getBounds().width * 2;
            greenMenTimerText.y = 10;

            blackBackground = new createjs.Shape();
            blackBackground.graphics.beginFill("#000000").drawRect(0, 0, w, h);

            var greenRoomImage = loader.getResult("greenRoom");
            greenRoom = new createjs.Shape();
            greenRoom.graphics.beginBitmapFill(greenRoomImage).drawRect(0, 0, greenRoomImage.width, greenRoomImage.height);
            greenRoom.scaleX = 2;
            greenRoom.scaleY = 2;

            greenRoom.x = 0;
            greenRoom.y = 50;
            stage.addChild(blackBackground, greenRoom, textInfo, greenMenTimerText);
            for (var i = 0; i < greenMenCount; i++) {
                greenMan = addGreenMan();
                greenMan.x = Math.floor(900 * Math.random()) + 70;
                greenMan.y = 80 + Math.floor(300 * Math.random()) ;
                greenMan.rotation = 360 * Math.random();

                stage.addChild(greenMan);
            }
        }
        else if (LEVEL_PHASES[currentPhase] == "RESULTS") {
            stage.addChild(blackBackground, greenRoom, buttonReplayLevel, buttonNext);
        }

    };


    function addGreenMan() {
        var greenManImage = loader.getResult("greenMan");
        var greenMan = new createjs.Shape();
        greenMan.graphics.beginBitmapFill(greenManImage).drawRect(0, 0, greenManImage.width, greenManImage.height);
        greenMan.regX = greenManImage.width / 2;
        greenMan.regY = greenManImage.height / 2;

        greenMan.on("pressup", function() {
            createjs.Sound.play("soundAlien");
            stage.removeChild(this);
            currentPoints += 10;
            greenMenCount--;
            if (greenMenCount <= 0) nextPhase();
        });

        return greenMan;
    }

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            greenMenTimer -= event.delta/1000;
            if (greenMenTimerText != undefined) greenMenTimerText.text = ":" + Math.ceil(greenMenTimer);
            if (greenMenTimer <= 0) nextPhase();
        }

    }
}