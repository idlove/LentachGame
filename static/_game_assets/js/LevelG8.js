/**
 * Created with PyCharm.
 * User: kuznetsov-m
 * Date: 23.12.14
 * Time: 8:53
 * To change this template use File | Settings | File Templates.
 */
function LevelG8() {
    var player;
    var background, hole, slingshot, wall;
    var isSuccess, isFlying;
    var tourniquet;
    var slingshotLine1, slingshotLine2;
    var failTimer;
    var textInfo;


    this.handleAssets = function() {
        background = new createjs.Shape();
        background.graphics.beginBitmapFill(loader.getResult("g8stage")).drawRect(0,0, w, h);


        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
            stage.addChild(background);
        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            isSuccess = false;
            isFlying = false;
            failTimer = 0;

            player = makePlayer();
            hole = makeHole();

            var slingshotImage = loader.getResult("g8slingshot");
            slingshot = new createjs.Shape();
            slingshot.graphics.beginBitmapFill(slingshotImage).drawRect(0, 0, slingshotImage.width, slingshotImage.height);
            //slingshot.scaleX = slingshot.scaleY = 2;
            slingshot.x = 131;
            slingshot.y = 181;

            textInfo = new createjs.Text("Попади из G8 в светлую жизнь", "40px Verdana", "#0000ff");
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 30;

           stage.addChild(background, player, hole, textInfo, slingshot);


        }
        else {
            stage.addChild(background, slingshot, buttonReplayLevel, buttonNext);
        }
    };


    this.tick = function(event) {
        if (LEVEL_PHASES[currentPhase] == "GAME") {
            var deltaS = event.delta / 1000;
            player.updateStatus(deltaS);
            hole.updateStatus(deltaS);

            stage.removeChild(slingshotLine1, slingshotLine2);

            slingshotLine1 = drawLine(200, 180, 160, 200);
            slingshotLine2 = drawLine(140, 190, 160, 200);
            stage.addChildAt(slingshotLine1, 1);
            stage.addChildAt(slingshotLine2, 4);


            if (failTimer >= 3) {
                if (isSuccess) currentPoints = 100;
                nextPhase();
            }

        }

    };


    function makePlayer() {
        var playerImage = loader.getResult("g8player");

        var SpriteSheet = new createjs.SpriteSheet({
            "images": [playerImage],
            "framerate": 1,
            "frames": {"regX": 0, "regY": 0, "height": 70, "width": 70},
            "animations": {
                "sit": {"frames": [0]},
                "fly": {"frames": [0]},
                "down": {"frames": [1]}
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
            this.velocity[0] = (this.initialX - this.x) * 1.2;
            this.velocity[1] = this.initialY - this.y;
            isFlying = true;

            createjs.Sound.play("soundWhoo", {offset: 500});
        };

        stagePlayer.kill = function() {
            this.rotation = 0;
            this.gotoAndPlay("down");
            if (isSuccess) textInfo.text = "Ура!";
            else textInfo.text = "Почти";
            textInfo.x = w/2 - textInfo.getBounds().width/2;
            textInfo.y = 30;
        };

        stagePlayer.on("mousedown", function (evt) {
				this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
			});

        stagePlayer.on("pressmove", function(event) {
            if (failTimer > 0) return;
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
            if (failTimer > 0) return;
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
                if (this.x > w - 30 && this.velocity[0] > 0) {
                    if (this.y - this.getBounds().height / 2 - 20 >= hole.y && this.y +
                        this.getBounds().height / 2 < hole.y + 170) {
                        isSuccess = true;
                        stage.removeChild(this);
                    }
                    else {
                        this.velocity[0] *= -0.5;
                        this.velocity[1] *= -0.5;
                        createjs.Sound.play("soundSmash", {offset: 500});
                    }
                }

                if (this.y >= 300) {
                    this.kill();
                    createjs.Sound.play("soundSmash", {offset: 500});
                }
            }
            else if (this.currentAnimation == "down") {
                failTimer += deltaS;
            }
        };
        return stagePlayer;
    }

    function makeHole() {
        var holeImage = loader.getResult("g8hole");
        var stageHole = new createjs.Shape();
        stageHole.graphics.beginBitmapFill(holeImage).drawRect(0, 0, holeImage.width, holeImage.height);

        stageHole.x = 910;
        stageHole.y = 0;

        stageHole.velocity = [0, 300];

        stageHole.updateStatus = function(deltaS) {
            this.y += this.velocity[1] * deltaS ;

            if ((this.y < 0  && this.velocity[1] < 0) ||
                (this.y > 200 && this.velocity[1] > 0))
                this.velocity[1] *= -1;

        };
        return stageHole;
    }

    function drawLine(startX, startY, endX, endY) {
        stage.removeChild(line);
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(3);
        line.graphics.beginStroke("FF0000");
        line.graphics.moveTo(startX, startY);
            //startY++;
        var playerX = player.x - 30;
        //var endY = player.y + 35;
        if (playerX < player.initialX + 20 && !isFlying) {
            line.graphics.lineTo(player.x - 30, player.y + 35);
        }
        else line.graphics.lineTo(endX, endY);


        line.graphics.endStroke();
        return line;
        //stage.addChildAt(line, 2);

    }
}