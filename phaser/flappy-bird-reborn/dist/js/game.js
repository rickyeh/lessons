(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy-bird-reborn');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
  // initialize your prefab here
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

  // set the Sprite's Anchor to center
  this.anchor.setTo(0.5, 0.5);

  // Add and play animations
  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  // Add physics
  this.game.physics.arcade.enableBody(this);
  this.enableBody = true;
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Bird;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

  // Enable physics on ground sprite, needed for collision detection
  this.game.physics.arcade.enableBody(this);

  // Start scrolling our ground
  this.autoScroll(-200, 0);

  this.body.allowGravity = false;
  this.body.immovable = true;
  
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;

},{}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');

    // add the ground sprite as a tile
    // and start scrolling in the negative x direction
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    this.ground.autoScroll(-200, 0);

    // Step 1
    // Create a Group To put the title assets in so they can be manipulated together
    this.titleGroup = this.game.add.group();

    // Step 2
    // Create the title sprite and add it to the group
    this.title = this.game.add.sprite (0, 0, 'title');
    this.titleGroup.add(this.title);

    // Step 3
    // Create the bird sprite and add it to the group
    this.bird = this.game.add.sprite (200, 5, 'bird');
    this.titleGroup.add(this.bird);

    // Step 4
    // Add animation to the bird and start it.
    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 12, true);

    // Step 5
    // Set the origination location of the group
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    // Step 6
    // Create an oscillating animatino tween for the group
    this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  
    // Add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5, 0.5);
  },
  update: function() {
  },

  startClick: function() {
    // Start button click handler
    this.game.state.start('play');
  }

};

module.exports = Menu;

},{}],7:[function(require,module,exports){

  'use strict';

  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');

  function Play() {}

  Play.prototype = {

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 500;

      // Add Background sprite
      this.background = this.game.add.sprite(0,0,'background');

      // Create a new bird object
      // and add it to the game
      this.bird = new Bird(this.game, 100, this.game.height/2);
      this.game.add.existing(this.bird);

      // Create and Add new Ground Obj
      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);
    },

    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground);
    }
  };
  
  module.exports = Play;
},{"../prefabs/bird":2,"../prefabs/ground":3}],8:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');

    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])