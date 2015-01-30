
function TitleMenu() {

     this.handleAssets =  function() {
        //hideLoading();
        currentPhase = 2;
        var background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("TitleBackground")).drawRect(0,0, w, h);

        var imageButtonStart = loader.getResult("buttonStartGame");
        var buttonStartGame = new createjs.Shape();
        buttonStartGame.graphics.beginBitmapFill(imageButtonStart).drawRect(
            0,
            0,
            imageButtonStart.width,
            imageButtonStart.height);
        buttonStartGame.x = w/2;
        buttonStartGame.y = h - imageButtonStart.height;
        buttonStartGame.regX = imageButtonStart.width / 2;
        buttonStartGame.regY = imageButtonStart.height / 2;
        buttonStartGame.cursor = "pointer";


        buttonStartGame.on("mouseover", function(event) {
            this.scaleX = 1.2;
            this.scaleY = 1.2;
        });

        buttonStartGame.on("mouseout", function(event) {
            this.scaleX = 1.;
            this.scaleY = 1.;

        });

        buttonStartGame.on("mousedown", function() {
            musicBackground = createjs.Sound.play("soundMusic", {loop: -1});
            musicBackground.volume = 0.25;

            nextPhase();
        });

        var textTitle = new createjs.Text("МногоХодовОчка", "80px Verdana", "#ffffff");
        textTitle.x = w/2 - textTitle.getBounds().width/2;
        textTitle.y = 30;

        var textSubtitle = new createjs.Text("Переиграй их всех!", "40px Verdana", "#880000");
        textSubtitle.x = w/2 - textSubtitle.getBounds().width/2;
        textSubtitle.y = textTitle.getBounds().y + textTitle.getBounds().height + 40;

        stage.addChild(background, buttonStartGame);
     };

    this.tick = function(event) {

    };
}
