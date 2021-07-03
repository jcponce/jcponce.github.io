/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 */

// CIRCLE/CIRCLE
function circleCircle(c1x, c1y,  c1r, c2x, c2y,  c2r) {
    
    // get distance between the circle's centers
    // use the Pythagorean Theorem to compute the distance
    let distX = c1x - c2x;
    let distY = c1y - c2y;
    let distance = sqrt( (distX*distX) + (distY*distY) );
    
    // if the distance is less than the sum of the circle's
    // radii, the circles are touching!
    if (distance <= c1r+c2r) {
        return true;
    }
    return false;
}


// LINE/CIRCLE
function lineCircle( x1,  y1,  x2, y2,  cx,  cy,  r) {
    
    // either end inside the circle?
    let inside = pointCircle(x1,y1, cx,cy,r);
    if (inside) return true;
    inside = pointCircle(x2,y2, cx,cy,r);
    if (inside) return true;
    
    // get length of the line
    let distX = x1 - x2;
    let distY = y1 - y2;
    let len = sqrt( (distX*distX) + (distY*distY) );
    
    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);
    
    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));
    
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = linePoint(x1,y1,x2,y2, closestX,closestY);
    if (!onSegment) return false;
    
    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    let distance = sqrt( (distX*distX) + (distY*distY) );
    
    if (distance <= r) {
        return true;
    }
    return false;
}


// POINT/CIRCLE
function pointCircle( px, py,  cx, cy,  r) {
    
    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    let distX = px - cx;
    let distY = py - cy;
    let distance = sqrt( (distX*distX) + (distY*distY) );
    
    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= r) {
        return true;
    }
    return false;
}


// LINE/POINT
function linePoint( x1,  y1, x2,  y2, px,  py) {
    
    // get distance from the point to the two ends of the line
    let d1 = dist(px,py, x1,y1);
    let d2 = dist(px,py, x2,y2);
    
    // get the length of the line
    let lineLen = dist(x1,y1, x2,y2);
    
    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 5;    // higher # = less accurate
    
    // if the two distances are equal to the line's length, the
    // point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
        return true;
    }
    return false;
}


// CIRCLE/RECTANGLE
function circleRect( cx, cy,  radius,  rx,  ry,  rw, rh) {
    
    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;
    
    // which edge is closest?
    if (cx < rx)         testX = rx;        // compare to left edge
    else if (cx > rx+rw) testX = rx+rw;     // right edge
    if (cy < ry)         testY = ry;        // top edge
    else if (cy > ry+rh) testY = ry+rh;     // bottom edge
    
    // get distance from closest edges
    let distX = cx-testX;
    let distY = cy-testY;
    let distance = sqrt( (distX*distX) + (distY*distY) );
    
    // if the distance is less than the radius, collision!
    if (distance <= radius) {
        return true;
    }
    return false;
}
