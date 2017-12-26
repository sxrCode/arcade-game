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
// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());
//allEnemies.push(new Enemy());

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var Game = function(player) {
    this.player = player;
}

Game.prototype.update = function(dt) {
    let player = this.player;
    allEnemies.forEach(function(enemy) {
        if (enemy.active && Math.abs(enemy.y - player.y) < 20) {

            if ((enemy.x > (player.x + 101)) || ((enemy.x + 101) < player.x)) {

            } else {
                console.log("lose game!");
                player.onLose();
            }
        }
    });
    if (player.realY < staticDimension.IMAGE_HEIGHT) {
        console.log("win Game!");
        player.onWin();
    }
}

var game = new Game(player);