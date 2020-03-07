/* File: Platform.js 
 *
 * Creates and initializes a ploatform object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Platform(texture, position) {
    this.mPlatform = new TextureRenderable(texture);

    this.mPlatform.setColor([1, 1, 1, 0]);
    this.mPlatform.getXform().setPosition(position[0], position[1]);
    this.mPlatform.getXform().setSize(30, 3.75);
    this.mXform = this.mPlatform.getXform();
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.mPlatform);
}
gEngine.Core.inheritPrototype(Platform, GameObject);