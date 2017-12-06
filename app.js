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
       //return Math.sqrt((this.x_ - p.x)**2 + (this.y_ - p.y)**2);
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
    // normal movement
        let newX = this.myPosition.x + secondsElapsed*this.myCurrentXSpeed;
        let newY = this.myPosition.y + secondsElapsed*this.myCurrentYSpeed;
        this.myPosition = new Point(newX, newY);
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

class BirdView {

  constructor(model, pipes1, pipes2) {
    this.birdModel = model;
    this.canvasElement = document.getElementById("game");
    this.gameContext = this.canvasElement.getContext("2d");
    this.birdImage = new Image();
    this.birdImage.src = "https://studio.code.org/blockly/media/skins/flappy/avatar.png";
    this.skyBackgroundImage = new Image();
    this.skyBackgroundImage.src = skyImageData; //"cloud-background.jpg"
  }

  render() {
    this.gameContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.gameContext.drawImage(this.skyBackgroundImage, -(this.birdModel.position.x)% (this.skyBackgroundImage.width-this.canvasElement.width), 0, this.skyBackgroundImage.width, this.skyBackgroundImage.height);
    this.gameContext.drawImage(this.birdImage, 5, Math.trunc(this.birdModel.position.y), this.birdImage.width, this.birdImage.height);
  }
}

class Pipes {
    // 52 x 320
    // 320 x 480
    
    constructor(x, pipeSpeed) {
        this.xPos = x;
        this.pipeGap = 280;
        this.pipeTopPosition = new Point(this.xPos, -2*(Math.trunc(Math.random()*130)));
        this.pipeBottomPosition = new Point(this.xPos, (480+this.pipeTopPosition.y+this.pipeGap));
        this.pipeSpeed = pipeSpeed;
    }
    
    move(){
        if (this.pipeTopPosition.x<-52) {
            this.pipeTopPosition = new Point(320, -2*(Math.trunc(Math.random()*130)));
            this.pipeBottomPosition= new Point(320,(480+this.pipeTopPosition.y+this.pipeGap));
            this.pipeTopY = -2*(Math.trunc(Math.random()*130));
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

class PipeView {
    constructor(pipes1, pipes2) {
        this.pipes1 = pipes1;
        this.pipes2 = pipes2;
        this.pipeTopImage = new Image();
        this.pipeTopImage.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_top.png";
        this.pipeBottomImage = new Image();
        this.pipeBottomImage.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_bottom.png";
        
        this.canvasElement = document.getElementById("game");
        this.pipesContext = this.canvasElement.getContext("2d");
    }
    
    render() {
        this.pipesContext.drawImage(this.pipeTopImage, this.pipes1.pipeTopPos.x,  this.pipes1.pipeTopPos.y, this.pipeTopImage.width, this.pipeTopImage.height);
        
        this.pipesContext.drawImage(this.pipeBottomImage, this.pipes1.pipeBottomPos.x, this.pipes1.pipeBottomPos.y, this.pipeBottomImage.width, -this.pipeBottomImage.height);

        this.pipesContext.drawImage(this.pipeTopImage, this.pipes2.pipeTopPos.x,  this.pipes2.pipeTopPos.y, this.pipeTopImage.width, this.pipeTopImage.height);

        this.pipesContext.drawImage(this.pipeBottomImage, this.pipes2.pipeBottomPos.x, this.pipes2.pipeBottomPos.y, this.pipeBottomImage.width, -this.pipeBottomImage.height);
    }
}

class Controller {

  constructor(m, pipes1, pipes2) {
    window.addEventListener("click", m.flap.bind(m));
    this.m = m;
    this.pipes1 = pipes1;
    this.pipes2 = pipes2;
    this.bv = new BirdView(this.m, this.pipes1, this.pipes2);
    this.pv = new PipeView(this.pipes1, this.pipes2);
    this.canvasElement = document.getElementById("game");
    this.controllerContext = this.canvasElement.getContext("2d");
    this.loseScreen = new LoseView(this.m);
  }
    
    start() {
    this.lastTimeBirdMoved=0;
    let runGame = ms => {
      // CHECK: if bird falls into pit
        if(this.m.position.y > 485) { console.log("FALL TO DEATH"); this.loseScreen.render();} 
      // CHECK: If the bird is passing between or hitting into a pipe from pipes1
        else if(this.pipes1.pipeTopPos.x <=34 && this.pipes1.pipeTopPos.x >= -40) {
              // If hits top pipe1
              if(this.m.position.y <= this.pipes1.pipeTopPos.y+320) {console.log("1"); this.loseScreen.render();}
              // If hits bot pipe1
              else if(this.m.position.y >= this.pipes1.pipeBottomPos.y-320-24){console.log("2"); this.loseScreen.render();}
              // Else between pipes, run game normally
              else {
                this.m.move(msToSec(ms - this.lastTimeBirdMoved));
                this.bv.render();
                this.pipes1.move(); // document.getElementById("input").value=this.pipes1.pipeBottomPos.y;
                this.pipes2.move(); // document.getElementById("input2").value=this.pipes2.pipeBottomPos.y;
                      document.getElementById("input5").value=this.m.position.y;
                      document.getElementById("input2").value=this.m.position.y;
                      document.getElementById("input4").value=this.pipes2.pipeTopPos.y+320;
                      document.getElementById("input6").value=this.pipes2.pipeBottomPos.y-320-24;
                      document.getElementById("input1").value=this.pipes1.pipeTopPos.y+320;
                      document.getElementById("input3").value=this.pipes1.pipeBottomPos.y-320-24;
                this.pv.render();
                  // CHEATS
                      this.controllerContext.fillText("PIPES 1",this.pipes1.pipeTopPos.x,this.pipes1.pipeTopPos.y+320);
                      this.controllerContext.fillText("PIPES 2",this.pipes2.pipeTopPos.x,this.pipes2.pipeTopPos.y+320);
                      this.controllerContext.fillRect(34,0,1,500);
                      this.controllerContext.fillRect(this.pipes1.pipeTopPos.x-75,this.pipes1.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes1.pipeBottomPos.x-75,this.pipes1.pipeBottomPos.y-320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeTopPos.x-75,this.pipes2.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeBottomPos.x-75,this.pipes2.pipeBottomPos.y-320,200,1);
                this.lastTimeBirdMoved = ms;
              }
        }
      // CHECK: If the bird is between or hitting into a pipe from pipes2
        else if(this.pipes2.pipeTopPos.x <=34 && this.pipes2.pipeTopPos.x >= -40){
              // If hits top pipe2
              if(this.m.position.y <= this.pipes2.pipeTopPos.y+320){console.log("3"); this.loseScreen.render();}
              // If hits bot pipe2
              else if(this.m.position.y >= this.pipes2.pipeBottomPos.y-320-24){console.log("4"); this.loseScreen.render();}
              // Else between pipes, run game normally
              else {
                this.m.move(msToSec(ms - this.lastTimeBirdMoved));
                this.bv.render();
                this.pipes1.move(); // document.getElementById("input").value=this.pipes1.pipeBottomPos.y;
                this.pipes2.move(); // document.getElementById("input2").value=this.pipes2.pipeBottomPos.y;
                      document.getElementById("input5").value=this.m.position.y;
                      document.getElementById("input2").value=this.m.position.y;
                      document.getElementById("input4").value=this.pipes2.pipeTopPos.y+320;
                      document.getElementById("input6").value=this.pipes2.pipeBottomPos.y-320-24;
                      document.getElementById("input1").value=this.pipes1.pipeTopPos.y+320;
                      document.getElementById("input3").value=this.pipes1.pipeBottomPos.y-320-24;
                this.pv.render();
                  // CHEATS
                      this.controllerContext.fillText("PIPES 1",this.pipes1.pipeTopPos.x,this.pipes1.pipeTopPos.y+320);
                      this.controllerContext.fillText("PIPES 2",this.pipes2.pipeTopPos.x,this.pipes2.pipeTopPos.y+320);
                      this.controllerContext.fillRect(34,0,1,500);
                      this.controllerContext.fillRect(this.pipes1.pipeTopPos.x-75,this.pipes1.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes1.pipeBottomPos.x-75,this.pipes1.pipeBottomPos.y-320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeTopPos.x-75,this.pipes2.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeBottomPos.x-75,this.pipes2.pipeBottomPos.y-320,200,1);
                this.lastTimeBirdMoved = ms;
              }
        } 
      // ELSE NOT between pipes, run game normally
        else {
          this.m.move(msToSec(ms - this.lastTimeBirdMoved));
              this.bv.render();
              this.pipes1.move(); 
              this.pipes2.move(); 
                     document.getElementById("input5").value=this.m.position.y;
                      document.getElementById("input2").value=this.m.position.y;
                      document.getElementById("input4").value=this.pipes2.pipeTopPos.y+320;
                      document.getElementById("input6").value=this.pipes2.pipeBottomPos.y-320-24;
                      document.getElementById("input1").value=this.pipes1.pipeTopPos.y+320;
                      document.getElementById("input3").value=this.pipes1.pipeBottomPos.y-320-24;
              this.pv.render();
                // CHEATS
                      this.controllerContext.fillText("PIPES 1",this.pipes1.pipeTopPos.x,this.pipes1.pipeTopPos.y+320);
                      this.controllerContext.fillText("PIPES 2",this.pipes2.pipeTopPos.x,this.pipes2.pipeTopPos.y+320);
                      this.controllerContext.fillRect(34,0,1,500);
                      this.controllerContext.fillRect(this.pipes1.pipeTopPos.x-75,this.pipes1.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes1.pipeBottomPos.x-75,this.pipes1.pipeBottomPos.y-320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeTopPos.x-75,this.pipes2.pipeTopPos.y+320,200,1);
                      this.controllerContext.fillRect(this.pipes2.pipeBottomPos.x-75,this.pipes2.pipeBottomPos.y-320,200,1);
              this.lastTimeBirdMoved = ms;
        }
        // Continue infinite loop of animation
        requestAnimationFrame(runGame);
    }; // runGame (SHOULD BE INFINITE)
    
    // Initiate start to infinite loop "runGame"
    requestAnimationFrame(runGame);
  } // start()
  
} // class Controller()

class StartUp {
  constructor() {
    this.m = new Bird(new Point(0,75), 6, 290, 150);
    this.pipes1 = new Pipes(320, 1.86);
    this.pipes2 = new Pipes(500, 1.86);
    this.c = new Controller(this.m, this.pipes1, this.pipes2);
    this.c.start();
  }
}

class LoseView {
  constructor(bird) {
    this.playAgainBtn = document.getElementById("play-again-btn");
    this.m = bird;
    this.canvasElement = document.getElementById("game");
    this.loseContext = this.canvasElement.getContext("2d");
    this.loseContext.font = "20px Georgia";
  }
  
  render() {
      this.loseContext.fillStyle = 'white';
      this.loseContext.fillText("You Lose!", this.canvasElement.width/2-34, this.canvasElement.height/2-50);
      this.playAgainBtn.style.display = 'inline';
      this.playAgainBtn.addEventListener("click", function(){
        location.reload(true);});
  }
} // class LoseView()

let msToSec = milliseconds => milliseconds/1000;
let distance = (v, t) => v * t; //%360

// Global Variables - left unchanged
let startNewGame = new StartUp();








