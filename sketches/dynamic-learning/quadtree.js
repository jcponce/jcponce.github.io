class QuadTreeItem {
    
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
    
}

class QuadTreeBin {
    
    /*
     * @param maxDepth The maximum number of permitted subdivisions.
     * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
     * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
     * @param depth For internal use only.
     */
    constructor(maxDepth, maxItemsPerBin, extent, depth = 0) {
        this.rect = extent.copy();
        this.bins = null;
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.items = [];
        this.depth = depth;
    }
    
    /*
     * Check if a point is within the extent of a `QuadTreeBin` instance.
     * Returns true if so, false otherwise.
     * @param range Used to check if a point is within a radius of the extent border.
     */
    checkWithinExtent(x, y, range = 0) {
        return x >= this.rect.x - range && x < this.rect.x + this.rect.width + range &&
        y >= this.rect.y - range && y < this.rect.y + this.rect.height + range;
    }
    
    /*
     * Adds an item to the `QuadTreeBin`.
     * @param item An instance of `QuadTreeItem`.
     */
    addItem(item) {
        if (this.bins === null) {
            this.items.push(item);
            if (this.depth < this.maxDepth && this.items !== null && this.items.length > this.maxItemsPerBin)
                this.subDivide();
        } else {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }
    }
    
    /*
     * Returns a list of items from the bin within the specified radius of the coordinates provided.
     */
    getItemsInRadius(x, y, radius, maxItems) {
        const radiusSqrd = radius ** 2;
        let items = [];
        
        if (this.bins) {
            for (let b of this.bins)
                if (b.checkWithinExtent(x, y, radius))
                    items.push(...b.getItemsInRadius(x, y, radius, maxItems));
        } else {
            for (let item of this.items) {
                const distSqrd = (item.x - x) ** 2 + (item.y - y) ** 2;
                if (distSqrd <= radiusSqrd)
                    items.push({ distSqrd: distSqrd, data: item.data });
            }
        }
        
        return items;
    }
    
    /*
     * Split a `QuadTreeBin` into 4 smaller `QuadTreeBin`s.
     * Removes all `QuadTreeItem`s from the bin and adds them to the appropriate child bins.
     */
    subDivide() {
        if (this.bins !== null) return;
        this.bins = [];
        let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
        for (let i = 0; i < 4; ++i)
            this.bins.push(new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(this.rect.x + i % 2 * w, this.rect.y + Math.floor(i * 0.5) * h, w, h), this.depth + 1));
        
        for (let item of this.items) {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }
        
        this.items = null;
    }
    
    /*
     * Renders the borders of the `QuadTreeBin`s within this `QuadTreeBin`.
     * For debugging purposes.
     */
    debugRender(renderingContext) {
        noFill();
        //stroke('#aaa');
        //strokeWeight(1);
        noStroke();
        rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        if (this.bins)
            for (let b of this.bins)
                b.debugRender(renderingContext);
    }
    
    /*
     * Private.
     */
    _getBinIndex(x, y, range = 0) {
        if (!this.checkWithinExtent(x, y)) return -1;
        let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
        let xx = Math.floor((x - this.rect.x) / w);
        let yy = Math.floor((y - this.rect.y) / h);
        return xx + yy * 2;
    }
    
}



/*
 * A public class representing a QuadTree structure.
 */
class QuadTree {
    
    /*
     * @param maxDepth The maximum number of permitted subdivisions.
     * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
     * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
     */
    constructor(maxDepth, maxItemsPerBin, extent) {
        this.extent = extent.copy();
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.clear();
    }
    
    /*
     * Remove all `QuadTreeItem`s and `QuadTreeBin`s from the QuadTree leaving it completely empty.
     */
    clear() {
        this.rootBin = new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));
    }
    
    /*
     * Add an item at a specified position in the `QuadTree`.
     * @param x The x coordinate of the item.
     * @param y The y coordinate of the item.
     * @param item The user-defined data structure to store in the `QuadTree`.
     */
    addItem(x, y, item) {
        this.rootBin.addItem(new QuadTreeItem(x, y, item));
    }
    
    /*
     * Returns a list of items within the specified radius of the specified coordinates.
     */
    getItemsInRadius(x, y, radius, maxItems) {
        if (maxItems === undefined) {
            return this.rootBin.getItemsInRadius(x, y, radius);
        } else {
            return this.rootBin.getItemsInRadius(x, y, radius)
            .sort((a, b) => a.distSqrd - b.distSqrd)
            .slice(0, maxItems)
            .map(v => v.data);
        }
    }
    
    /*
     * Renders the borders of the `QuadTreeBin`s within this `QuadTree`.
     * For debugging purposes.
     */
    debugRender(renderingContext) {
        this.rootBin.debugRender(renderingContext);
    }
    
}