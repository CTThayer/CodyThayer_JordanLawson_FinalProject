/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformSprite = "assets/platform.png";
    
    this.WCBounds = [-100, 100, -75, 75]; // [minX, maxX, minY, maxY]
    
    // The camera to view the scene
    this.mCamera = null;
    this.mDyePack1 = null;
    this.mDyePack2 = null;
    this.mDyePack3 = null;
    
    this.mPlatform = null;
    this.mPlatformArray = [];
    
    this.mQuadTree = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    this.mPlatform = null;
    var i;
    for(i = 0; i < 10; i++){
        this.mPlatform = new Platform(this.kPlatformSprite, [0,0]);
        this.mPlatformArray.push(this.mPlatform);
    }
    
    this.mDyePack1 = new DyePack(this.kMinionSprite, this.mPlatformArray, [this.mDyePack2, this.mDyePack3]);
    this.mDyePack2 = new DyePack(this.kMinionSprite, this.mPlatformArray, [this.mDyePack1, this.mDyePack3]);
    this.mDyePack3 = new DyePack(this.kMinionSprite, this.mPlatformArray, [this.mDyePack1, this.mDyePack2]);
    
    this.mPlatformArray[1].mPlatform.getXform().setPosition(0,50);
    this.mPlatformArray[2].mPlatform.getXform().setPosition(0,-50);
    this.mPlatformArray[3].mPlatform.getXform().setPosition(50,50);
    this.mPlatformArray[4].mPlatform.getXform().setPosition(50,-50);
    this.mPlatformArray[5].mPlatform.getXform().setPosition(-50,50);
    this.mPlatformArray[6].mPlatform.getXform().setPosition(-50,-50);
    this.mPlatformArray[7].mPlatform.getXform().setPosition(-50,0);
    this.mPlatformArray[8].mPlatform.getXform().setPosition(50,0);
    
    this.mPlatform = null;

};


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    
    this.mDyePack1.draw(this.mCamera);
    this.mDyePack2.draw(this.mCamera);
    this.mDyePack3.draw(this.mCamera);
    
    var i;
    for(i = 0; i < this.mPlatformArray.length; i++){
        this.mPlatformArray[i].draw(this.mCamera);
    }
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mDyePack1.update(this.mPlatformArray);
    this.mDyePack2.update(this.mPlatformArray);
    this.mDyePack3.update(this.mPlatformArray);
};