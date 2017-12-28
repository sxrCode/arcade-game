// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.duaration = 0.7;
    this.speed = 0;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = "images/enemy-bug.png";
};

Enemy.prototype.toActive = function() {
    this.active = true;
    var row = parseInt(Math.random() * 3 + 1, 10);
    this.y = row * staticDimension.IMAGE_HEIGHT - 10;
    this.speed = parseInt(Math.random() * 2 + 1, 10) * 300;
};

Enemy.prototype.toNegative = function() {
    this.active = false;
    this.duaration = 0;
    this.x = (0 - staticDimension.IMAGE_WIDTH);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (this.active) {
        this.x = this.x + dt * this.speed;
        if (this.x >= staticDimension.GAME_WIDTH) {
            this.toNegative();
        }
    } else {
        this.duaration += dt;
        if (this.duaration > 0.8) {
            this.toActive();
        }
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    if (this.active) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var Player = function() {
    this.x = staticDimension.IMAGE_WIDTH * 2;
    this.y = staticDimension.IMAGE_HEIGHT * 5;
    this.duaration = 0;
    this.realY = this.y;
    this.sprite = "images/char-boy.png";
};

Player.prototype.update = function(dt) {
    this.duaration += dt;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.onLose = function() {
    this.reset();
}

Player.prototype.onWin = function() {
    this.reset();
}

Player.prototype.reset = function() {
    this.x = staticDimension.IMAGE_WIDTH * 2;
    this.y = staticDimension.IMAGE_HEIGHT * 5;
    this.realY = this.y;
}

Player.prototype.handleInput = function(keyCode) {
    if (this.duaration >= 0.2) {
        console.log("key: " + keyCode);
        this.duaration = 0;
        let x = 0;
        let y = 0;
        switch (keyCode) {
            case "left":
                x = this.x - staticDimension.IMAGE_WIDTH;
                this.x = x >= 0 ? x : this.x;
                break;
            case "up":
                y = this.y - staticDimension.IMAGE_HEIGHT;
                this.y = y >= 1 * staticDimension.IMAGE_HEIGHT ? y : this.y;
                this.realY = y;
                break;
            case "right":
                x = this.x + staticDimension.IMAGE_WIDTH;
                this.x = x <= 4 * staticDimension.IMAGE_WIDTH ? x : this.x;
                break;
            case "down":
                y = this.y + staticDimension.IMAGE_HEIGHT;
                this.y = y <= 5 * staticDimension.IMAGE_HEIGHT ? y : this.y;
                break;

            default:
                break;
        }
    }
};

Player.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var staticDimension = {
    IMAGE_WIDTH: 101,
    IMAGE_HEIGHT: 83,
    GAME_WIDTH: 101 * 5,
    GAME_HEIGHT: 83 * 6
};

var allEnemies = [];

var player = new Player();


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: "enter",
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.handleInput(allowedKeys[e.keyCode]);
});

var game = (function() {

    var state = 0;
    let winCount = 0;
    let loseCount = 0;
    var Game = function(player) {
        this.player = player;
    }

    Game.prototype.update = function(dt) {
        if (state === 1) {
            updateEntities(dt);
        } else if (state === 0) {
            playerSelector.update(dt);
        }
    }

    function updateEntities(dt) {
        this.player.update(dt);

        let player = this.player;
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            if (enemy.active && Math.abs(enemy.y - player.y) < 20) {
                if ((enemy.x > (player.x + 101)) || ((enemy.x + 101) < player.x)) {} else {
                    console.log("lose game!");
                    let span = document.getElementsByClassName("failure")[0];
                    span.innerHTML = "" + (++loseCount);
                    player.onLose();
                }
            }
        });
        if (player.realY < staticDimension.IMAGE_HEIGHT) {
            console.log("win Game!");
            let span = document.getElementsByClassName("success")[0];
            span.innerHTML = "" + (++winCount);
            player.onWin();
        }
    }

    Game.prototype.render = function() {
        if (state === 1) {
            renderGaming();
        } else if (state === 0) {
            playerSelector.render();
        }
    };

    Game.prototype.handleInput = function(keyCode) {
        if (state === 1) {
            player.handleInput(keyCode);
        } else if (state === 0) {
            playerSelector.handleInput(keyCode);
        }
    }

    Game.prototype.finishSelect = function() {
        state = 1;
        // 现在实例化你的所有对象
        // 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
        // 把玩家对象放进一个叫 player 的变量里面
        allEnemies.push(new Enemy());
        allEnemies.push(new Enemy());
        allEnemies.push(new Enemy());
        allEnemies.push(new Enemy());
        allEnemies.push(new Enemy());
        //allEnemies.push(new Enemy());
        //allEnemies.push(new Enemy());
    }

    /* 这个函数做了一些游戏的初始渲染，然后调用 renderEntities 函数。记住，这个函数
     * 在每个游戏的时间间隙都会被调用一次（或者说游戏引擎的每个循环），因为这就是游戏
     * 怎么工作的，他们就像是那种每一页上都画着不同画儿的书，快速翻动的时候就会出现是
     * 动画的幻觉，但是实际上，他们只是不停的在重绘整个屏幕。
     */
    function renderGaming() {

        renderBackground();
        renderEntities();
    }

    /* 这个函数会在每个时间间隙被 render 函数调用。他的目的是分别调用你在 enemy 和 player
     * 对象中定义的 render 方法。
     */
    function renderEntities() {
        /* 遍历在 allEnemies 数组中存放的作于对象然后调用你事先定义的 render 函数 */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    function renderChosing() {

    }

    return new Game(player);

})();

function renderBackground() {
    /* 这个数组保存着游戏关卡的特有的行对应的图片相对路径。 */
    var rowImages = [
            'images/water-block.png', // 这一行是河。
            'images/stone-block.png', // 第一行石头
            'images/stone-block.png', // 第二行石头
            'images/stone-block.png', // 第三行石头
            'images/grass-block.png', // 第一行草地
            'images/grass-block.png' // 第二行草地
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
             * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
             * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
             */
            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        }
    }
}

var playerSelector = (function() {
    var cards = [];
    let oldSelectNumber = 0;
    let selectNumber = 0;

    function Selector() {

    }

    Selector.prototype.init = function() {
        cards.push(new Card("images/char-boy.png", staticDimension.IMAGE_WIDTH, staticDimension.IMAGE_HEIGHT + 20));
        cards.push(new Card("images/char-cat-girl.png", staticDimension.IMAGE_WIDTH * 2, staticDimension.IMAGE_HEIGHT + 20));
        cards.push(new Card("images/char-horn-girl.png", staticDimension.IMAGE_WIDTH * 3, staticDimension.IMAGE_HEIGHT + 20));
        cards.push(new Card("images/char-pink-girl.png", staticDimension.IMAGE_WIDTH * 2 - 50, staticDimension.IMAGE_HEIGHT * 2 + 50));
        cards.push(new Card("images/char-princess-girl.png", staticDimension.IMAGE_WIDTH * 3 - 50, staticDimension.IMAGE_HEIGHT * 2 + 50));
        cards[0].select();
    }

    Selector.prototype.update = function(dt) {
        cards[oldSelectNumber].unSelect();
        cards[selectNumber].select();
    };

    Selector.prototype.render = function() {
        renderBackground();
        cards.forEach(function(card) {
            card.render();
        });
    };

    Selector.prototype.handleInput = function(keyCode) {
        console.log("keycode: " + keyCode);
        oldSelectNumber = selectNumber;
        switch (keyCode) {
            case "left":
            case "up":
                selectNumber--;
                if (selectNumber < 0) {
                    selectNumber = 4;
                }
                break;
            case "right":
            case "down":
                selectNumber++;
                if (selectNumber > 4) {
                    selectNumber = 0;
                }
                break;
            case "enter":
                console.log("select " + selectNumber);
                player.setSprite(cards[selectNumber].getSprite());
                game.finishSelect();
                break;
        }
    };

    function Card(sprite, x, y) {
        this.x = x;
        this.y = y;
        this.isSelect = false;
        this.sprite = sprite;
    }

    Card.prototype.getSprite = function() {
        return this.sprite;
    };

    Card.prototype.select = function() {
        this.isSelect = true;
    };

    Card.prototype.unSelect = function() {
        this.isSelect = false;
    };

    Card.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        if (this.isSelect) {
            ctx.strokeStyle = "#0000ff";
            ctx.strokeRect(this.x - 5, this.y + 50, staticDimension.IMAGE_WIDTH + 10, staticDimension.IMAGE_HEIGHT + 30);
        }
    };
    let selector = new Selector();
    selector.init();
    return selector;
})();