/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Dec-2018
 */

// Original code:
// Flocking by
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

// This file contains the QuadTree class
// as well as the Cube classe used by the QuadTree

// Cube --------------------------------------------------
// A cube delimiting the volume of a quad tree
// or the volume used for asking boids from a quad tree
class Cube {
    constructor(x, y, z, w, h, d) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.d = d;
        
        this.xMin = x - w;
        this.xMax = x + w;
        this.yMin = y - h;
        this.yMax = y + h;
        this.zMin = z - d;
        this.zMax = z + d;
    }
    
    // Checks if a boid is inside the cube
    contains(boid) {
        let pos = boid.pos;
        return (pos.x >= this.xMin && pos.x <= this.xMax &&
                pos.y >= this.yMin && pos.y <= this.yMax &&
                pos.z >= this.zMin && pos.z <= this.zMax);
    }
    
    // Check if two cubes intersect
    intersects(range) {
        return !(this.xMax < range.xMin || this.xMin > range.xMax ||
                 this.yMax < range.yMin || this.yMin > range.yMax ||
                 this.zMax < range.zMin || this.zMin > range.zMax);
    }
}

// QUAD TREE --------------------------------------------------
// The quad tree stores points in a tree structure
// to minimize the cost of distance calculation
class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // cube giving the borders of the quad tree
        this.capacity = capacity; // Maximum amount of points that can be stored in the quad tree
        this.boids = []; // Array storing the boids in the quad tree
        this.divided = false; // True when the quad tree subdivides
    }
    
    // Insert a boid in the quad tree
    insert(boid) {
        // Return if the boid is not in the area of this layer of quad tree
        if (!this.boundary.contains(boid)) {
            return false;
        }
        
        // Add the boid at this layer or a deeper layer depending on capacity
        if (this.boids.length < this.capacity) {
            // Add the point to this layer if there is still room for it
            this.boids.push(boid);
            return true;
        } else {
            // Otherwise, subdivide to make room for the new boid
            // Subdivision divides the quad tree area into 8 new children quad trees
            if (!this.divided) {
                this.subdivide();
            }
            
            // Add the boid to the relevant subdivision
            // N = North, S = South, E = East, W = West, B = Bottom, T = Top
            if (this.NWT.insert(boid)) {
                return true;
            } else if (this.NET.insert(boid)) {
                return true;
            } else if (this.SET.insert(boid)) {
                return true;
            } else if (this.SWT.insert(boid)) {
                return true;
            } else if (this.NWB.insert(boid)) {
                return true;
            } else if (this.NEB.insert(boid)) {
                return true;
            } else if (this.SEB.insert(boid)) {
                return true;
            } else if (this.SWB.insert(boid)) {
                return true;
            }
        }
    }
    
    // Subdivides the quad tree if it is at full capacity, creating 8 new children quad trees
    subdivide() {
        this.divided = true; // Informs of the subdivision to only subdivide once
        
        let x = this.boundary.x;
        let y = this.boundary.y;
        let z = this.boundary.z;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;
        let d = this.boundary.d / 2;
        
        // Creates the 8 children quad trees with the relevant positions and area
        // North West Top quad tree
        let NWTBoundary = new Cube(x - w, y - h, z - d, w, h, d);
        this.NWT = new QuadTree(NWTBoundary, this.capacity);
        
        // North East Top quad tree
        let NETBoundary = new Cube(x + w, y - h, z - d, w, h, d);
        this.NET = new QuadTree(NETBoundary, this.capacity);
        
        // South East Top quad tree
        let SETBoundary = new Cube(x + w, y + h, z - d, w, h, d);
        this.SET = new QuadTree(SETBoundary, this.capacity);
        
        // South West Top quad tree
        let SWTBoundary = new Cube(x - w, y + h, z - d, w, h, d);
        this.SWT = new QuadTree(SWTBoundary, this.capacity);
        
        // North West Bot quad tree
        let NWBBoundary = new Cube(x - w, y - h, z + d, w, h, d);
        this.NWB = new QuadTree(NWBBoundary, this.capacity);
        
        // North East Bot quad tree
        let NEBBoundary = new Cube(x + w, y - h, z + d, w, h, d);
        this.NEB = new QuadTree(NEBBoundary, this.capacity);
        
        // South East Bot quad tree
        let SEBBoundary = new Cube(x + w, y + h, z + d, w, h, d);
        this.SEB = new QuadTree(SEBBoundary, this.capacity);
        
        // South West Bot quad tree
        let SWBBoundary = new Cube(x - w, y + h, z + d, w, h, d);
        this.SWB = new QuadTree(SWBBoundary, this.capacity);
    }
    
    // Returns all the points in a given range (Cube) and put them in the "found" array
    query(range, found) {
        // The array "found" will check all quad trees intersecting with the range,
        // looking for points intersecting with the range
        if (!found) found = []; // Creates the array at the beginning of the recursion
        
        if (!this.boundary.intersects(range)) {
            return found; // No intersection between the quad tree and the range, no need to check for points
        } else {
            // If the range intersects this quad tree, check for the intersection of its points with the range
            for (let boid of this.boids) {
                if (range.contains(boid)) {
                    found.push(boid); // Add the points intersecting with the range to "found"
                }
            }
            
            // This quad tree intersects with the range, now do the same for its children quad trees
            if (this.divided) {
                this.NWT.query(range, found);
                this.NET.query(range, found);
                this.SET.query(range, found);
                this.SWT.query(range, found);
                this.NWB.query(range, found);
                this.NEB.query(range, found);
                this.SEB.query(range, found);
                this.SWB.query(range, found);
            }
        }
        
        return found;
    }
}
