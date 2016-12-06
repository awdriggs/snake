//move this to snake.js
//make the snake
function Snake() {
  this.size = 3;
  this.locations = [
    [25, 25],
    [24, 25],
    [23, 25],
    [22, 25],
    [21, 25],
    [20, 25],
    [19, 25],
    [18, 25],
    [17, 25]
  ];
  this.dir = {
    x: 1,
    y: 0
  };
  this.food = [];
}

Snake.prototype.changeDir = function(key) {
  if (key == 37 && this.dir.x != 1) {
    //left
    this.dir = {
      x: -1,
      y: 0
    };
  } else if (key == 38 && this.dir.y != 1) {
    //up
    this.dir = {
      x: 0,
      y: -1
    };
  } else if (key == 39 && this.dir.x != -1) {
    //right
    this.dir = {
      x: 1,
      y: 0
    };
  } else if (key == 40 && this.dir.y != -1) {
    //down
    this.dir = {
      x: 0,
      y: 1
    };
  }
  return this.dir;
};

Snake.prototype.draw = function() {
  //take the current head, this.locations[0]
  //change the current head by the direction
  //shift in the new head
  //pop out the last element in the array
  //return the popped out function
  var x = this.locations[0][0]
  var y = this.locations[0][1];

  var head = [x + this.dir.x, y + this.dir.y];
  this.locations.unshift(head);

}

Snake.prototype.cutTail = function() {
  return this.locations.pop();
}

Snake.prototype.setFood = function(size) {
  var x = Math.floor(Math.random() * size);
  var y = Math.floor(Math.random() * size);
  this.food = [x, y]
  return this.food;
}

Snake.prototype.checkFood = function() {
  if (this.locations[0][0] == this.food[0] && this.locations[0][1] == this.food[
      1]) {
    return true;
  }
}

Snake.prototype.inBounds = function(size) {
  var x = this.locations[0][0];
  var y = this.locations[0][1];

  //if x is less than 0 or greater than size-1 or y is less than 0 or greater than
  //size-1
  if ((x < 0 || x > size - 1) || (y < 0 || y > size - 1) || this.checkSelf()) {
    console.log('hit wall')
    return false
  } else return true;
}

Snake.prototype.grow = function() {
  for (var i = 0; i <= this.size; i++) {
    //by adding duplicates to the end of the array add length to the snake
    //this basically stalls the tail in it's location as the snake moves on
    this.locations.push([this.locations[this.locations.length - 1][0], this.locations[this.locations.length - 1][1]]);
  }
}

Snake.prototype.checkSelf = function() {

  var x = this.locations[0][0];
  var y = this.locations[0][1];
  
  for(var i = 1; i < this.locations.length; i++){
    var checkX = this.locations[i][0];
    var checkY = this.locations[i][1];

    if(x == checkX && y == checkY){
      return true 
    }
  }
  return false //if it gets to this point, its not touching itself
}


//this will be the callback of a setInterval
//function render,
//call snake.draw, this will return the 'tail'
//for each item in the snake.locations, add the class of snake to each div that
//matches the current location
//take the tail, remove the class of snake fromt he div that matches the tail
function render() {
  snake.draw();
  //if in bounds run render and food stuff
  if (snake.inBounds(size)) {
    for (var i = 0; i < snake.locations.length; i++) {
      var current = document.getElementById(snake.locations[i][0] + "-" + snake
        .locations[
          i][1]);
      current.className = "box snake";
    }

    //control for growth here?
    //call the code to move the food
    //reset the snakes food
    //if it is NOT food, pop the tail 
    //var headDiv = document.getElementById(head[0]+"-"+head[1]);
    //console.log(headDiv.classList);
    if (snake.checkFood()) {
      snake.grow();
      renderFood(size);
      score++;

      //update the score on the screen
      document.getElementById('count').innerHTML = score
      console.log(count);
    } else {
      //fail case, cut off the tail
      var tail = snake.cutTail();
      document.getElementById(tail[0] + "-" + tail[1]).className = "box";
    }
  } else { //snake is out of bounds, lets reset
    console.log('reset');
      score = 0;
      document.getElementById('count').innerHTML = 0 
    snake = setup(size);
  }
}

function setup(size) {
  snake = new Snake();
  //reset the grid
  buildGrid(size);

  return snake;
}

//build the grid
function buildGrid(size) {
  //clear the gird
  var grid = document.getElementsByClassName('grid')[0]
  grid.innerHTML = null;

  for (var i = 0; i < size; i++) {
    var row = document.createElement('div');
    row.className = 'row';

    for (var j = 0; j < size; j++) {
      var box = document.createElement('div');
      box.id = j + "-" + i;
      box.innerHTML = '&#8203'; //this is for formatting, stop the drop
      box.className = 'box';
      row.appendChild(box);
    }
    grid.appendChild(row);
  }

  renderFood(size);
}

function renderFood(size) {
  snake.setFood(size);
  var foodDiv = document.getElementById(snake.food[0] + "-" + snake.food[1]);
  foodDiv.classList.add('food');
}


//move this to app.js
var size = 60
var snake = setup(size); //setup returns a new snake obj
var score = 0; //used to display score and set the speed

//how to make it speed up?
//set interval here instead?
//as a closure?
//setInterval(render, 50 );
function draw(speedFactor, cb){
  var speed = setSpeed(speedFactor) 
  console.log(speed);
  cb(function(){
    render();
    draw(score, setTimeout)
  }, speed);
}

function setSpeed(sFactor){
  var speed = 130 - (sFactor * 10)

  if(speed <= 0){
    speed = 10;
  }

  return speed;
}

//get started
draw(score, setTimeout);


//move this to a document ready
document.addEventListener('keyup', function(e) {
  snake.changeDir(e.which);
})

