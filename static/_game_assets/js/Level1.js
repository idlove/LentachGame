function Level1() {
    var levelFinished;
    var levelTimer;
    var LEVEL_LENGTH = 5;
    var bubble;

    this.handleAssets = function() {
        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") { }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            levelTimer = 0;
            levelFinished = false;
            var background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("l1Background")).drawRect(0,0, w, h);
            background.scaleX = background.scaleY = 2;

            var watcherImage = loader.getResult("l1Putin");
            var watcher = new createjs.Shape();
            watcher.graphics.beginBitmapFill(watcherImage).drawRect(0, 0, watcherImage.width, watcherImage.height);
            watcher.y = h - watcherImage.height + 30;
            watcher.cursor = "pointer";

            var bubbleImage = loader.getResult("l1Bubble");
            bubble = new createjs.Shape();
            bubble.graphics.beginBitmapFill(bubbleImage).drawRect(0, 0, bubbleImage.width, bubbleImage.height);
            bubble.x = watcherImage.width - 10;
            bubble.y = -10;

            stage.addChild(background, watcher);
        }
        else {
            nextPhase();
        }
    };
    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            levelTimer += event.delta / 1000;
            if (levelTimer > LEVEL_LENGTH * 0.3 && !levelFinished) {
                levelFinished = true;
                stage.addChild(bubble);
            }
            if (levelTimer > LEVEL_LENGTH) {nextPhase();}
        }
    }
}