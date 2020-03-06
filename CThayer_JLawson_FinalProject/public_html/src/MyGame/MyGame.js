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
    this.kMinionPortal = "assets/minion_portal.png";
    this.kBoundingBox = "assets/boundingBox.png";
    this.kBg = "assets/bg.png";
    
    this.WCBounds = [-100, 100, -75, 75]; // [minX, maxX, minY, maxY]
    
    // The camera to view the scene
    this.mCamera = null;
    this.mBg = null;
    this.mDyePackManager = null;
    this.mPatrolManager = null;
    this.mHero = null; 
    this.mMsg = null;
    this.mMsg2 = null
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

    // Large background image
    var bgR = new SpriteRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(200, 200);
    bgR.getXform().setPosition(0, 0);
    this.mBg = new GameObject(bgR);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-99, -69);
    this.mMsg.setTextHeight(3);
    this.mMsg2 = new FontRenderable("Status Message");
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(-99, -72);
    this.mMsg2.setTextHeight(3);
    var center = vec2.fromValues(0, 0);
    this.mDyePackManager = new DyePackManager(this.kMinionSprite);
    this.mHero = new Hero(this.kMinionSprite, center, this.mDyePackManager, this.mCamera);
    this.mPatrolManager = new PatrolManager(this.kMinionSprite, this.kMinionPortal, this.kBoundingBox, [50, -37.5], this.WCBounds, this.mDyePackManager.dyePackArray, this.mHero);
    this.mPatrolManager.spawnPatrol();
    


};


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kMinionPortal);
    gEngine.Textures.loadTexture(this.kBg);
    gEngine.Textures.loadTexture(this.kBoundingBox);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kMinionPortal);
    gEngine.Textures.unloadTexture(this.kBg);
    gEngine.Textures.unloadTexture(this.kBoundingBox);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    
    this.mBg.draw(this.mCamera);
    this.mDyePackManager.draw(this.mCamera);
    this.mPatrolManager.draw(this.mCamera);
    this.mHero.draw(this.mCamera);;
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    this.mMsg2.draw(this.mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    this.mPatrolManager.update();
    this.mDyePackManager.update();
    this.mHero.update();
    
    var msg1 = "Partols: " + this.mPatrolManager.patrolArray.length + " "
    + " DyePacks: " + this.mDyePackManager.dyePackArray.length + " "
    + "Auto Spawning: " + this.mPatrolManager.spawnMode;
    this.mMsg.setText(msg1);
    
    var msg2 = "Spawn: C, Auto-Spawn: P, Head Hit: J, DyePack: Space, DyePack Hit: S, DyePack Slow: D, Hero Hit: Q";
    this.mMsg2.setText(msg2);
};