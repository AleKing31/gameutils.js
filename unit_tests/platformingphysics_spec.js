'use strict';

describe('PlatformingPhysics', function() {
    var testCollider = function(width, x, y) {
        var c = new PlatformingCharacter();
        c.init({x: x, y: y});
        c.getRect = function() {
            return new Rect(this.x - width * 0.5,
                            this.x + width * 0.5,
                            this.y - width * 0.5,
                            this.y + width * 0.5);        
        }
        return c;
    };
    
    var testInitParams = {
        width: 4,
        height: 3,
        initTile: PlatformingPhysics.initFromData(['    ', '    ', '    '], false)
    };
    
    describe('PlatformingCharacter', function() {
        it('initializes', function() {
            var c = new PlatformingCharacter();
            c.init({x: 12, y: 3});
            expect(c.x).toBe(12);
            expect(c.y).toBe(3);
        });

        it('has a default collision rectangle', function() {
            var c = new PlatformingCharacter();
            c.init({x: 12, y: 3});
            var rect = c.getRect();
            expect(rect.left).toBe(11.5);
            expect(rect.right).toBe(12.5);
            expect(rect.top).toBe(2);
            expect(rect.bottom).toBe(4);
        });
    });
    
    describe('PlatformingLevel', function() {
        it('initializes', function() {
            var level = new PlatformingLevel();
            expect(level._objects.length).toEqual(0);
            expect(level._tileMapObjects.length).toEqual(0);
            expect(level._colliders['all'].length).toEqual(0);
        });
        
        it('updates when empty', function() {
            var level = new PlatformingLevel();
            var deltaTime = 1 / 60;
            level.update(deltaTime);
        });

        it('adds objects to the "all" collision group', function() {
            var level = new PlatformingLevel();
            var c = testCollider(1, 12, 3);
            level.pushObject(c, []);
            expect(level._objects[0]).toBe(c);
            expect(level._colliders['all'][0]).toBe(c);
        });

        /*it('adds tilemap objects to the "all" collision group', function() {
            var level = new PlatformingLevel();
            var c = testCollider(1, 12, 3);
            level.pushTileMapObject(c, []);
            expect(level._tileMapObjects[0]).toBe(c);
            expect(level._colliders['all'][0]).toBe(c);
        });*/

        it('updates when it has one object', function() {
            var level = new PlatformingLevel();
            level.pushObject(testCollider(1, 12, 3), []);
            var deltaTime = 1 / 60;
            level.update(deltaTime);
        });
    });

    it('handles collisions between objects', function() {
        var tilemap = new TileMap(testInitParams);
        var colliders = [];
        var colliderWidth = 0.2;
        
        var origY = 1.0;
        var origX1 = 1.0; 
        var origX2 = origX1 + colliderWidth + 0.0001;

        colliders.push(testCollider(colliderWidth, origX1, origY));
        colliders.push(testCollider(colliderWidth, origX2, origY));
        colliders.push(tilemap);
        
        // Move in y direction
        colliders[0].dy = 0.1;
        colliders[1].dy = 0.1;
        
        // Collide with each other in x direction
        colliders[0].dx = 0;
        colliders[1].dx = -0.1;
        
        var deltaTime = 0.01;
        for (var i = 0; i < colliders.length; ++i) {
            if (!(colliders[i] instanceof TileMap)) {
                PlatformingPhysics.moveAndCollide(colliders[i], deltaTime, 'x', colliders);
                PlatformingPhysics.moveAndCollide(colliders[i], deltaTime, 'y', colliders);
            }
        }
        expect(colliders[0].x).toBeCloseTo(origX1, 4);
        expect(colliders[0].y).toBeCloseTo(origY + colliders[0].dy * deltaTime, 4);
        expect(colliders[1].x).toBeCloseTo(origX1 + colliderWidth, 3);
        expect(colliders[1].y).toBeCloseTo(origY + colliders[1].dy * deltaTime, 4);
    });
    
    describe('PlatformingLevel', function() {
        it('initializes', function() {
            var level = new PlatformingLevel();
        });
    });
});
