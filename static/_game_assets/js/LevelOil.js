function LevelOil() {
    var player;
    var isFlying;
    var background, backgroundStage, hole, slingshot;
    var slingshotLine1, slingshotLine2;
    var failTimer;
    var textInfo;

    this.handleAssets = function() {
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("oilStage")).drawRect(0,0, w, h);


        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {

        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            failTimer = 0;
            isFlying = false;
            player = makePlayer();
            var slingshotImage = loader.getResult("oilSlingshot");
            slingshot = new createjs.Shape();
            slingshot.graphics.beginBitmapFill(slingshotImage).drawRect(0, 0, slingshotImage.width, slingshotImage.height);

            slingshot.x = 131;
            slingshot.y = 181;

            textInfo = new createjs.Text("Попади деньгами мимо Роснефти", "40px Verdana", "#0000ff");
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 30;

            stage.addChild(background, player, textInfo, slingshot);

        }
        else {
            stage.addChild(background, slingshot, buttonReplayLevel, buttonNext);
        }
    };

    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            player.updateStatus(deltaS);

            stage.removeChild(slingshotLine1, slingshotLine2);
            slingshotLine1 = drawLine(200, 180, 160, 200);
            slingshotLine2 = drawLine(140, 190, 160, 200);
            stage.addChildAt(slingshotLine1, 1);
            stage.addChildAt(slingshotLine2, 4);


            if (failTimer >= 5) {
                currentPoints = - Math.round(Math.random() * 50);
                nextPhase();
            }
        }
    };


    function makePlayer() {
        var playerImage = loader.getResult("oilPlayer");

        var SpriteSheet = new createjs.SpriteSheet({
            "images": [playerImage],
            "framerate": 1,
            "frames": {"regX": 0, "regY": 0, "height": 70, "width": 70},
            "animations": {
                "sit": {"frames": [0]},
                "fly": {"frames": [0]},
                "down": {"frames": [0]}
            }

        });
        var stagePlayer = new createjs.Sprite(SpriteSheet, "sit");

        stagePlayer.setBounds(0, 0, 70, 70);
        stagePlayer.initialX = 185;
        stagePlayer.initialY = 185;

        stagePlayer.x = stagePlayer.initialX;
        stagePlayer.y = stagePlayer.initialY;
        stagePlayer.offset = {x: 0, y: 0};
        stagePlayer.velocity = [0, 0];
        stagePlayer.regX = 35;
        stagePlayer.regY = 35;
        stagePlayer.rotationDirection = 1;

        stagePlayer.fly = function() {
            this.gotoAndPlay("fly");
            this.velocity[0] = this.initialX - this.x;
            this.velocity[1] = this.initialY - this.y;
            isFlying = true;

            createjs.Sound.play("soundWhoo", {offset: 500});
        };

        stagePlayer.kill = function() {
            this.rotation = 0;
            this.gotoAndPlay("down");
            textInfo.text = "Почти";
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 30;
        };

        stagePlayer.on("mousedown", function (evt) {
            if (isFlying) return;
				this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
			});

        stagePlayer.on("pressmove", function(event) {
            if (isFlying) return;
            if (this.currentAnimation == "sit") {
                this.x = event.stageX + this.offset.x;
			    this.y = event.stageY + this.offset.y;
                if (this.x < 0) this.x = 0;
                if (this.x > this.initialX) this.x = this.initialX;
                if (this.y > 300) this.y = 300;
                if (this.y < 85) this.y = 85;
            }
        });

        stagePlayer.on("pressup", function (event) {
            if (isFlying) return;
            this.fly();
		});

        stagePlayer.updateStatus = function(deltaS) {
            if (this.currentAnimation == "fly") {
                this.x += this.velocity[0] * deltaS * 10;
                this.y += this.velocity[1] * deltaS * 10;
                this.velocity[1] += deltaS * 200;
                this.rotation += deltaS * this.rotationDirection * 1000;
                if (this.y < 0 && this.velocity[1] < 0) {
                    this.velocity[1] *= -1;
                    this.rotationDirection *= -1;
                    createjs.Sound.play("soundSmash", {offset: 500});
                }
                if (this.x > w - 30 && this.velocity[0] > 0 && this.y < h/2) {
                    createjs.Sound.play("soundSmash", {offset: 500});
                    this.velocity[0] *= -1;
                }

                if (this.x > w + 200 ) this.kill();
                if (this.y > 300) {

                    this.y = 300;
                    if (this.rotationDirection < 0) this.rotationDirection *= -1;
                    if (this.velocity[0] <= 0 ) this.velocity[0] = 10;
                }
            }
            else if (this.currentAnimation == "down") {
                failTimer += deltaS;
            }
        };
        return stagePlayer;
    }

    function drawLine(startX, startY, endX, endY) {
        stage.removeChild(line);
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(3);
        line.graphics.beginStroke("FF0000");
        line.graphics.moveTo(startX, startY);
        var playerX = player.x - 30;
        if (playerX < player.initialX && !isFlying) {
            line.graphics.lineTo(player.x - 30, player.y + 35);
        }
        else line.graphics.lineTo(endX, endY);

        line.graphics.endStroke();
        return line;

    }
}