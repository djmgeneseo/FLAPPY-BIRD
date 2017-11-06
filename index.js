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
    
    /**
     * Returns the distance between itself and another point
     * @param {Point} p the point to find the distance between
     * @return {number} distance between itself and p
     */
    distance(p) {
       return Math.sqrt((this.x_ - p.x)**2 + (this.y_ - p.y)**2);
    }
    
    get x() {
      return this.x_; //this.myPosition.x
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
    this.myPosition = startPosition;
    this.myCurrentXSpeed = startXSpeed;
    this.myGravity = gravity;
    this.flapSpeed = -flapUpSpeed;
    this.myCurrentYSpeed = 0;
  }
  
  /**
   * Updates the position of the bird (both x and y coordinates)
   * @param {number} secondsElapsed - the number of seconds that passed since the last move
   */
  
  move(secondsElapsed) {
    // document.getElementById("input").value=secondsElapsed;
    this.newX = this.myPosition.x + secondsElapsed*this.myCurrentXSpeed;
    this.newY = this.myPosition.y + secondsElapsed*this.myCurrentYSpeed;
    this.myPosition = new Point(this.newX, this.newY);
    this.myCurrentYSpeed = this.myCurrentYSpeed + secondsElapsed*this.myGravity;
  }
  
  /**
   * Updates the bird's y velocity caused by a flap given by flapUpSpeed
   */
  
  flap() {
    this.myCurrentYSpeed = this.flapSpeed;
  }
  
  /**
   * @type {Point}
   */
  get position() {
    // getter for current position of Bird
    return this.myPosition;
  }
}

class WorldView {

  constructor(model, pipes1, pipes2) {
    this.birdModel = model;
    this.canvasElement = document.getElementById("game");
    this.gameContext = this.canvasElement.getContext("2d");
    this.birdImage = new Image();
    this.birdImage.src = "https://studio.code.org/blockly/media/skins/flappy/avatar.png";
    this.skyBackgroundImage = new Image();
    this.skyBackgroundImage.src = skyImageData; //"cloud-background.jpg"
    
    // ******** OBSTACLES ********
    this.pipes1 = pipes1;
    this.pipes2 = pipes2;
    this.pipeTopImage = new Image();
    this.pipeTopImage.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_top.png";
    this.pipeBottomImage = new Image();
    this.pipeBottomImage.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_bottom.png";
  }

  render() {
    this.gameContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.gameContext.drawImage(this.skyBackgroundImage, -(this.birdModel.position.x)% (this.skyBackgroundImage.width-this.canvasElement.width), 0, this.skyBackgroundImage.width, this.skyBackgroundImage.height);
    this.gameContext.drawImage(this.birdImage, 5, Math.trunc(this.birdModel.position.y), this.birdImage.width, this.birdImage.height);
    
    // ******** OBSTACLES ********
      this.gameContext.drawImage(this.pipeTopImage, this.pipes1.pipeTopPos.x,  this.pipes1.pipeTopPos.y, this.pipeTopImage.width, this.pipeTopImage.height);
    /*this.gameContext.drawImage(this.pipeTopImage,this.pipeTopX,this.pipeTopY, this.pipeTopImage.width, this.pipeTopImage.height);*/
   
      this.gameContext.drawImage(this.pipeBottomImage, this.pipes1.pipeBottomPos.x, this.pipes1.pipeBottomPos.y, this.pipeBottomImage.width, -this.pipeBottomImage.height);

    this.gameContext.drawImage(this.pipeTopImage, this.pipes2.pipeTopPos.x,  this.pipes2.pipeTopPos.y, this.pipeTopImage.width, this.pipeTopImage.height);

      this.gameContext.drawImage(this.pipeBottomImage, this.pipes2.pipeBottomPos.x, this.pipes2.pipeBottomPos.y, this.pipeBottomImage.width, -this.pipeBottomImage.height);
      
      this.pipes1.move();
      this.pipes2.move(); /*this.gameContext.drawImage(this.pipeBottomImage,this.pipeBottomX,this.pipeBottomY, this.pipeBottomImage.width, -this.pipeBottomImage.height);*/
    // ******** OBSTACLES ********
  }
}

class Pipes {
    
    constructor(x) {
        this.xPos = x;
        this.pipeGap = 260;
        this.pipeTopPosition = new Point(this.xPos, -(Math.trunc(Math.random()*320)));
        this.pipeBottomPosition = new Point(this.xPos, (480+this.pipeTopPosition.y+this.pipeGap));
        this.pipeSpeed = 2.5;
    }
    
    move(){
        if (this.pipeTopPosition.x<-52) {
            this.pipeTopPosition = new Point(320, -(Math.trunc(Math.random()*320)));
            this.pipeBottomPosition= new Point(320,(480+this.pipeTopPosition.y+this.pipeGap));
            this.pipeTopY = -(Math.trunc(Math.random()*320));
            this.pipeTopX = 320;
        }
        else {
            this.pipeTopPosition = new Point(this.pipeTopPosition.x-this.pipeSpeed, this.pipeTopPosition.y);
            this.pipeBottomPosition = new Point(this.pipeBottomPosition.x-this.pipeSpeed, this.pipeBottomPosition.y);
        }
    } // move()
    
    get pipeTopPos() {
        return this.pipeTopPosition;
    }
    
    get pipeBottomPos() {
        return this.pipeBottomPosition;
    }

} // class Pipes

class Controller {

  constructor(m, pipes1, pipes2) {
    window.addEventListener("click", m.flap.bind(m));
    this.m = m;
    this.pipes1 = pipes1;
      this.pipes2 = pipes2;
    this.v = new WorldView(this.m, this.pipes1, this.pipes2);
  }
  
  start() {
    this.lastTimeBirdMove=0;
    this.runGame = ms => {
      this.m.move(msToSec(ms - this.lastTimeBirdMove));
      this.v.render();
      this.lastTimeBirdMove = ms;
      requestAnimationFrame(this.runGame);
    };
    
    // Initial start to infinite loop "runGame"
    requestAnimationFrame(this.runGame);
  } // start()
  
}

let msToSec = milliseconds => milliseconds/1000;
let distance = (v, t) => v * t; //%360

// Global Variables - left unchanged
let startX = 0;
let birdXSpeed =  6; // pixels per second

// Initialize objects and start rendering
let start = new Point(startX,10);
let m = new Bird(start, birdXSpeed, 200, 130);
let pipes1 = new Pipes(320);
let pipes2 = new Pipes(500);
let c = new Controller(m, pipes1, pipes2);
c.start();