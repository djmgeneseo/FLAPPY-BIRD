/* Class representing a point with 2 coordinates. */
class Point {
    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        // Fill in code to set attributes of point
        this.x_ = x;
        this.y_ = y;
    }

    get x() {
        return this.x_;
    }

    get y() {
        return this.y_;
    }
}

/**
 * Bird class maintains the position of a bird over time
 */
class Bird {
    /**
     * Create a new Bird.
     * @param {Point} startPosition - The 2D starting position of the Bird (x, y)
     * @param {number} startXSpeed - The starting horizontal speed of the bird (pixels/second)
     * @param {number} gravity - The change in the y velocity due to gravity (pixels/second)
     * @param {number} flapUpSpeed - The y velocity (opposite direction of gravity) caused by a flap
     */

    constructor(startPosition, startXSpeed, gravity, flapUpSpeed) {
        this.gravity_ = gravity;
        this.flapUpSpeed_ = -flapUpSpeed;
        this.currentPosition_ = startPosition;
        this.xSpeed_ = startXSpeed;
        this.ySpeed_ = 0;
        this.width_ = 34;
        this.height_ = 24
    }

    /**
     * Updates the position of the bird (both x and y coordinates)
     * @param {number} secondsElapsed - the number of seconds that passed since the last move
     */

    move(secondsElapsed) {

        let newX = this.currentPosition_.x + secondsElapsed * this.xSpeed_;
        let newY = this.currentPosition_.y + secondsElapsed * this.ySpeed_;
        this.currentPosition_ = new Point(newX, newY);
        this.ySpeed_ = this.ySpeed_ + secondsElapsed * this.gravity_;
    }

    /**
     * Updates the bird's y velocity caused by a flap given by flapUpSpeed
     */

    flap() {
        this.ySpeed_ = this.flapUpSpeed_;
    }

    /**
     * @type {Point}
     */

    get position() {
        // getter for current position of Bird
        return this.currentPosition_;
    }

    get width() {
        // getter for current position of Bird
        return this.width_;
    }

    get height() {
        // getter for current position of Bird
        return this.height_;
    }
}

/**
 * BirdView class stores the image data for the bird renders the position of a bird on a given canvas
 */
class BirdView {
    /**
     * Create a new BirdView.
     * @param {bird} bird - An object that maintains the position of a bird over time
     * with a 2D position (x,y)
     */
    constructor(bird) {
        this.bird_ = bird;
        this.birdImage_ = new Image();
        this.birdImage_.src = "https://studio.code.org/blockly/media/skins/flappy/avatar.png"
    }

    render(canvasContext) {
        canvasContext.drawImage(this.birdImage_, 5, this.bird_.position.y, this.birdImage_.width, this.birdImage_.height);
    }
}

/**
 * Pipe class maintains the position of a pipe and its other attributes
 */
class Pipe {
    /**
     * Create a new Pipe.
     * @param {Point} position - The 2D position of the Pipe (x, y)
     *
     */
    constructor(position) {
        this.position_ = position;
        this.gap_ = 100;
        this.width_ = 52;
        this.height_ = 320;
    }

    get position() {
        return this.position_;
    }

    get gap() {
        return this.gap_;
    }

    get width() {
        return this.width_;
    }

    get height() {
        return this.height_;
    }

}

/**
 * PipeWorld class maintains the position of multiple pipes in an array.
 */
class PipeWorld {
    /**
     * Create a new PipeWorld.
     */
    constructor() {
        this.pipes_ = [];
        let currentPoint = new Point(350, -Math.floor(Math.random() * 260));

        for (let i = 1; i <= 4; i++) {
            this.pipes_.push(new Pipe(currentPoint));
            currentPoint = new Point(currentPoint.x + 250, -Math.floor(Math.random() * 260));
        }
    }

    createNewPipe(posX) {
        this.pipes_.push(new Pipe(new Point(posX, -Math.floor(Math.random() * 260))));
    }

    deleteFirstPipe() {
        this.pipes_.shift();
    }

    getPipeNumber(n) {
        return this.pipes_[n];
    }

    getNumberOfPipes() {
        return this.pipes_.length;
    }

    getArray() {
        return this.pipes_;
    }
}

/**
 * PipeWorldView class stores the image pipe image data and renders the positions of
 * multiple pipes.
 */
class PipeWorldView {
    /**
     * Create a new PipeWorldView.
     * @param {PipeWorld} pipeWorld - An object that maintains multiple pipes in an
     * array. Each individual pipe maintains its own 2D position (x, y)
     *
     */
    constructor(pipeWorld) {
        this.pw_ = pipeWorld;
        this.pipeBottomImage_ = new Image();
        this.pipeTopImage_ = new Image();
        this.pipeBottomImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_bottom.png";
        this.pipeTopImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_top.png";
    }

    render(drawNewPipeFromThisX, canvasContext) {
        let currentTopPipe;

        for (let i = 0; i < this.pw_.getNumberOfPipes(); i++) {
            currentTopPipe = this.pw_.getPipeNumber(i);

            // Draw top Pipe
            canvasContext.drawImage(this.pipeTopImage_, currentTopPipe.position.x - drawNewPipeFromThisX, currentTopPipe.position.y, currentTopPipe.width, currentTopPipe.height);

            // Draw bottom pipe
            canvasContext.drawImage(this.pipeBottomImage_, currentTopPipe.position.x - drawNewPipeFromThisX, (currentTopPipe.height + currentTopPipe.position.y + currentTopPipe.gap + currentTopPipe.height), currentTopPipe.width, -currentTopPipe.height);
        }
    }
}

class LoseView {
    constructor() {
        this.playAgainBtn = document.querySelector(".play-again-btn-off");
        this.scoreBox = document.querySelector(".score");
        this.canvasElement = document.getElementById("game");
        this.loseContext = this.canvasElement.getContext("2d");
        this.loseContext.font = "25px Helvetica";
        this.loseContext.save();
    }

    render(score) {
        this.loseContext.fillStyle = 'white';
        this.loseContext.shadowOffsetX = 3;
        this.loseContext.shadowOffsetY = 4;
        this.loseContext.shadowBlur = 2;
        this.loseContext.shadowColor = "#008080";
        this.loseContext.fillText("Y O U  L O S E", this.canvasElement.width / 2 - 85, this.canvasElement.height / 2 - 50);
        // this render keeps calling, so changing chadow blur again after calling the text creates a text animation.
        this.loseContext.shadowBlur = 15;

//        this.scoreBox.style.left = "100px";
//        this.scoreBox.style.top = "240px";
        this.scoreBox.classList.add("lose-screen-score-box");

        // Play button
        this.playAgainBtn.classList.add("play-again-btn-on");
        this.playAgainBtn.addEventListener("click", function () {
            location.reload(true);
        });
    }
} // class LoseView()


/**
 * World class both creates and stores every model (MVC) object requisite for Flappy Bird.
 */
class World {
    /**
     * Create a new World.
     */
    constructor() {
        // startPosition, startXSpeed, gravity, flapUpSpeed
        this.bird_ = new Bird(new Point(5, 5), 130, 200, 130);
        this.pw_ = new PipeWorld();
    }

    checkIfPipeOffScreen() {
        if (this.bird_.position.x > (this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width)) {
            this.pw_.deleteFirstPipe();
            this.pw_.createNewPipe((this.pw_.getPipeNumber(this.pw_.getNumberOfPipes() - 1).position.x + 250));
        }
    }

    /* Returns true if collision, false if no collision
     CHECK IF:
        1) The bird is within range of a pipe
        2) The bird has NOT passed the pipe
        3) The bird is safely between the pipes -> false
            else, true
    */
    checkForCollision() {
        // IF the bird is approaching the first pipe at a distance of AT LEAST 10 pixles
        if ((this.bird_.position.x >= (this.pw_.getPipeNumber(0).position.x - this.bird_.width))) {
            // IF the bird has NOT passed the pipe (the +10 is to compensate for the imperfection of the bird's image - the game ends when the back-end of the bird does not quite hit the pipe on its way out of the pipe gap)
            if (!(this.bird_.position.x+10 >= this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width)) {
                // IF the bird is within the y-bounds of the gap, return true. Else, return false
                if ((this.bird_.position.y > (this.pw_.getPipeNumber(0).position.y + this.pw_.getPipeNumber(0).height)) && (this.bird_.position.y < (this.pw_.getPipeNumber(0).position.y + this.pw_.getPipeNumber(0).height + this.pw_.getPipeNumber(0).gap - this.bird.height))) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    get bird() {
        return this.bird_;
    }

    get pipeWorld() {
        return this.pw_;
    }
}

/**
 * WorldView class both creates and stores every view (MVC) object requisite for Flappy Bird.
 */
class WorldView {
    /**
     * Create a new WorldView.
     * @param {World} world - An object that both creates and maintains every model
     * object requisite for Flappy Bird.
     *
     */
    constructor(world) {
        // All models (Bird and PipeWorld objects were created in world)
        this.pw_ = world.pipeWorld;
        this.bird_ = world.bird;
        window.addEventListener('click', this.bird_.flap.bind(this.bird_));

        // Views
        this.pwv_ = new PipeWorldView(this.pw_, this.bird_);
        this.bv_ = new BirdView(this.bird_);
        this.lv_ = new LoseView();

        // Sky background
        this.skyBackgroundImage_ = new Image();
        this.skyBackgroundImage_.src = skyImageData;

        // Canvas element and context
        this.canvasElement_ = document.getElementById("game");
        this.canvasContext_ = this.canvasElement_.getContext("2d");
    }

    get loseScreen() {
        return this.lv_;
    }

    render() {
        this.canvasContext_.clearRect(0, 0, this.canvasElement_.width, this.canvasElement_.height);
        this.canvasContext_.drawImage(this.skyBackgroundImage_, -(this.bird_.position.x) % (this.skyBackgroundImage_.width - this.canvasElement_.width), 0, this.skyBackgroundImage_.width, this.skyBackgroundImage_.height);
        this.bv_.render(this.canvasContext_);
        this.pwv_.render(this.bird_.position.x, this.canvasContext_);
    }
}


/**
 * Controller class (MVC) both creates and stores the World and WorldView objects.
 */
class Controller {
    /**
     * Create a new Controller.
     */
    constructor() {
        this.w_ = new World();
        this.wv_ = new WorldView(this.w_);
    }

    start() {
        this.lastTimeMoved = 0;

        this.runGame = ms => {
            // Score
            document.querySelector(".score").value = this.w_.bird.position.x.toFixed(2);
            // Check if pipe's off screen
            this.w_.checkIfPipeOffScreen();
            // Check for collision
            if (this.w_.checkForCollision()) {
                this.wv_.loseScreen.render(this.w_.bird.position.x);
            } else {
                this.w_.bird.move(msToSec(ms - this.lastTimeMoved));
                this.wv_.render();
                this.lastTimeMoved = ms;
            }
            requestAnimationFrame(this.runGame);
        };

        requestAnimationFrame(this.runGame);
    } //start()

}

// ****** GAME STARTS HERE ******
let msToSec = milliseconds => milliseconds / 1000;

let c = new Controller();
c.start();






