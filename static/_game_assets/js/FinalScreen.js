function FinalScreen() {
    var background;
    var textFinalResult;


    //var buttonVK;
    var BUTTON_IMAGES = ['finalShareVK', 'finalShareTwitter', 'finalShareFacebook', 'finalShareOK'];

    this.handleAssets = function() {

        if (LEVEL_PHASES[currentPhase] == "DESCRIPTION") {
            nextPhase();
        }
        else if (LEVEL_PHASES[currentPhase] == "GAME") {
            musicBackground.stop();
            background = new createjs.Shape();
            background.graphics.beginBitmapFill(loader.getResult("TitleBackground")).drawRect(0,0, w, h);

            textFinalResult = new createjs.Text("ВАШ СЧЕТ: " + totalPoints, "50px Verdana", "#ffffff");
            textFinalResult.textAlign = "center";
            textFinalResult.x = w/2;
            textFinalResult.y = 300;

            stage.addChild(background, textFinalResult, buttonNext);
            /*for (var i = 0; i < BUTTON_IMAGES.length; i++) {
                stage.addChild(makeButton(i));
            }*/
        }
        else {
            nextPhase();

        }
    };

    this.tick = function(event) {};

    var MAIN_URL = 'https://многоходовочка.москва/';
    var PREFIX_TEXT = "Я набрал ";
    var SUFFIX_TEXT = " очков в Многоходовочке! Попробуй побить мой рекорд! Переиграй их всех!";
    var IMAGE_URL = "/static/_game_assets/images/TitleBackground.jpg";
    var WINDOW_NAME = "Sharing";
    var WINDOW_SETTINGS = "width=500,height=400,resizable=yes,scrollbars=yes,status=yes";

    function makeButton(socialIndex) {
        var img = loader.getResult(BUTTON_IMAGES[socialIndex]);
        var newButton = new createjs.Shape();
        newButton.graphics.beginBitmapFill(img).drawRect(0, 0, img.width, img.height);
        newButton.cursor = 'pointer';

        newButton.y = 300;
        newButton.x = 300 + 100 * socialIndex;
        newButton.socialIndex = socialIndex;

        newButton.on('mousedown', function() {
            var descriptionText = PREFIX_TEXT + totalPoints + SUFFIX_TEXT;

            var url;
            if (this.socialIndex == 0) {
                url = "https://vk.com/share.php?url=" + MAIN_URL +"&title=" + descriptionText + "&image=" + IMAGE_URL;
            }
            else if (this.socialIndex == 1) {
                url = "https://twitter.com/home?status=" + descriptionText + " " + MAIN_URL;
            }
            else if (this.socialIndex == 2) {
                /*url = "https://www.facebook.com/dialog/feed?" + "app_id=405491516275151&" +
                    "link=" + MAIN_URL + "&" +
                    '&name=Многоходовочка!&' +
                    "caption=Переиграй их всех!&" +
                    "picture=" + IMAGE_URL + "&" +
                    "description=" + descriptionText + "&" +
                    "redirect_uri=https://www.facebook.com/&" +
                    "display=popup"*/
                url = "https://www.facebook.com/sharer.php?u=" + MAIN_URL;

            }
            else if (this.socialIndex == 3) {
                url = "https://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + MAIN_URL + "&st.comments=" + descriptionText;
            }

            if (url != undefined) {
                window.open(url, WINDOW_NAME, WINDOW_SETTINGS);
            }
        });

        return newButton;
    }

}