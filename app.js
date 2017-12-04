/** Class representing a point with 2 coordinates. */
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

    /**
     * Returns the distance between itself and another point
     * @param {Point} p the point to find the distance between
     * @return {number} distance between itself and p
     */
    distance(p) {
        return Math.sqrt((this.x_ - p.x) ** 2 + (this.y_ - p.y) ** 2);
    }
    get x() {
        return this.x_;
    }

    get y() {
        return this.y_;
    }
}

/**
 * A Bird class maintains the position of a bird over time
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
}

class BirdView {
    constructor(bird) {
        this.bird_ = bird;
        this.birdImage_ = new Image();
        this.birdImage_.src = "https://studio.code.org/blockly/media/skins/flappy/avatar.png"
    }

    render(canvasElement, canvasContext) {
        canvasContext.drawImage(this.birdImage_, 5, this.bird_.position.y, this.birdImage_.width, this.birdImage_.height);
    }
}

class Pipe {
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

class PipeWorld {
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

    shiftPipes() {
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

class PipeWorldView {
    constructor(pipeWorld, bird) {
        this.bird_ = bird;
        this.pw_ = pipeWorld;
        this.pipeBottomImage_ = new Image();
        this.pipeTopImage_ = new Image();
        this.pipeBottomImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_bottom.png";
        this.pipeTopImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_top.png";

    }

    render(canvasElement, canvasContext) {

        let currentPipe, pipeXPosition, pipeYPosition;

        for (let i = 0; i < this.pw_.getNumberOfPipes(); i++) {
            currentPipe = this.pw_.getPipeNumber(i);
            pipeXPosition = currentPipe.position.x;
            pipeYPosition = currentPipe.position.y;

            canvasContext.drawImage(this.pipeTopImage_, pipeXPosition - this.bird_.position.x, pipeYPosition, currentPipe.width, currentPipe.height);
            canvasContext.drawImage(this.pipeBottomImage_, pipeXPosition - this.bird_.position.x, ((currentPipe.height) + (pipeYPosition) + currentPipe.gap), currentPipe.width, currentPipe.height);
        }

        //
        document.getElementById("input1").value = (this.bird_.position.x);
        document.getElementById("input4").value = (this.pw_.getArray()[0].position.x);
    }
}

class World {
    constructor() {
        // startPosition, startXSpeed, gravity, flapUpSpeed
        this.bird_ = new Bird(new Point(5, 5), 130, 200, 130);
        this.pw_ = new PipeWorld();
    }

    checkIfPipeOffScreen() {
        //
        document.getElementById("input5").value = (this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width);

        if (this.bird_.position.x > (this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width)) {
            //
            document.getElementById("input6").value = "Yes";

            this.pw_.shiftPipes();
            this.pw_.createNewPipe((this.pw_.getPipeNumber(this.pw_.getNumberOfPipes() - 1).position.x + 250));

            //
            setTimeout(function() {
            document.getElementById("input6").value = "No";}, 300);
        }

    }

    get bird() {
        return this.bird_;
    }

    get pipeWorld() {
        return this.pw_;
    }
}

class WorldView {
    constructor(world) {
        // World + its models (Bird and PipeWorld objects were created in world)
        this.pw_ = world.pipeWorld;
        this.bird_ = world.bird;
        window.addEventListener('click', this.bird_.flap.bind(this.bird_));

        // Views (PipeWorldView and BirdView objects)
        this.pwv_ = new PipeWorldView(this.pw_, this.bird_);
        this.bv_ = new BirdView(this.bird_);

        this.skyBackgroundImage_ = new Image();
        this.skyBackgroundImage_.src = skyImageData;

        this.canvasElement_ = document.getElementById("game");
        this.canvasContext_ = this.canvasElement_.getContext("2d");
    }
    render() {
        this.canvasContext_.clearRect(0, 0, this.canvasElement_.width, this.canvasElement_.height);
        this.canvasContext_.drawImage(this.skyBackgroundImage_, -(this.bird_.position.x) % (this.skyBackgroundImage_.width - this.canvasElement_.width), 0, this.skyBackgroundImage_.width, this.skyBackgroundImage_.height);
        this.bv_.render(this.canvasElement_, this.canvasContext_);
        this.pwv_.render(this.canvasElement_, this.canvasContext_);
    }
}


/********************* YOUR CONTROLLER CODE HERE **********************/
class Controller {
    constructor() {
        this.w_ = new World();
        this.wv_ = new WorldView(this.w_);
    }

    start() {
        this.lastTimeMoved = 0;

        this.runGame = ms => {
            this.w_.bird.move(msToSec(ms - this.lastTimeMoved));
            this.w_.checkIfPipeOffScreen();
            this.wv_.render();
            this.lastTimeMoved = ms;
            requestAnimationFrame(this.runGame);
        }

        requestAnimationFrame(this.runGame);
    } //start()

} // class Contorller(m)

/*********************************************************************/


// ****** GAME STARTS HERE ******
let msToSec = milliseconds => milliseconds / 1000;
// let distance = (v, t) => v * t % (skyBackgroundImage.width - canvasElement.width);

let c = new Controller();
c.start();
