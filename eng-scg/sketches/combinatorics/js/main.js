/**
 * Adapted from https://seeing-theory.brown.edu/compound-probability
 * Source: https://github.com/seeingtheory/Seeing-Theory/tree/master/compound-probability
 * This version by Juan Carlos Ponce Campuzano
 * Date: 15/May/2025
 */

function counting() {
    //Adapted from: https://bl.ocks.org/mbostock/4339083

    // Set up dimensions of SVG
    var margin = { top: 40, right: 40, bottom: 40, left: 40 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Create SVG
    var svgComb = d3.select("#svgComb").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Constants
    var i = 0,
        dur = 750,
        combinations = false,
        size = 4,
        number = 4,
        distNodes = 1,
        root = [];

    //Create Container
    var containerComb = svgComb.append("g");

    //Create Tree Layout
    var tree = d3.layout.tree()
        .size([height, width]);

    //Diagonal function
    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });


    //Initiates a tree of certain depth
    function drawTree(level) {
        var source = { name: "", children: [] };
        var colors = ['A', 'B', 'C', 'D'];
        distNodes = tree.size()[1] / Math.max(1, size);

        //Creates JSON object of all possible permutations without replacement of first 
        //'num' number of elements from 'color'.  This is a recursive implementation.
        function permutationCalc(obj, num, color) {
            for (var i = 0; i < num; i++) {
                obj.children.push({ name: obj.name + color[i], children: [] })
            }
            obj.children.map(function (x, i) {
                var remainingColor = color.slice()
                remainingColor.splice(i, 1);
                permutationCalc(x, num - 1, remainingColor)
            });
            return obj;
        }

        root = permutationCalc(Object.assign({}, source), size, colors);
        root.x0 = tree.size()[0] / 2;
        root.y0 = 0;

        //Hides all children below depth
        function collapse(d, depth) {
            if (d.children && depth >= number) {
                d._children = d.children;
                d._children.forEach(function (x) { collapse(x, depth + 1) });
                d.children = null;
            } else {
                d.children.forEach(function (x) { collapse(x, depth + 1) });
            }
            d._top = true;
        }
        collapse(root, level);
        update(0);
    }


    //ReDraws Tree Layout
    function update(duration) {

        // Compute the new tree layout nodes.
        var nodes = tree.nodes(root).reverse();

        //Update nodes.x and nodes.x0 for combinations
        function removeRepeats(nodeArray) {
            var hashmap = new Map();
            nodeArray.map(function (x) {
                var key = hashAnagram(x.name);
                if (hashmap.has(key)) {
                    var value = hashmap.get(key);
                    value.push(x);
                    hashmap.set(key, value);
                } else {
                    hashmap.set(key, [x]);
                }
            });
            hashmap.forEach(function (value, key) {
                var len = value.length;
                var avgX = value.reduce(function (a, b) { return a + b.x }, 0) / len;
                var avgX0 = value.reduce(function (a, b) { return a + b.x0 }, 0) / len;
                value.map(function (x, i) {
                    if (i != len - 1) x._top = false
                    x.x = avgX;
                    x.x0 = avgX0;
                    //Hard coded for overlap when size is four
                    if (key == hashAnagram('AD')) x.x -= 10;
                    if (key == hashAnagram('BC')) x.x += 10;
                });
            });
        };
        if (combinations) removeRepeats(nodes);
        else nodes.map(function (x) { x._top = true; });

        //Compute new tree layout Links.
        var links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) { d.y = d.depth * distNodes; });

        // Update the nodes…
        var node = containerComb.selectAll("g.node")
            .data(nodes, function (d) { return d.name });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d, i) {
                if (typeof (d.parent) != 'undefined') return "translate(" + d.parent.y0 + "," + d.parent.x0 + ")";
                else return "translate(" + d.y0 + "," + d.x0 + ")";
            });


        nodeEnter.each(function (d, i) {
            for (var j = d.name.length - 1; j >= 0; j--) {
                d3.select(this).append("circle")
                    .attr("r", 1e-6)
                    .attr("cx", j * 9)
                    .attr('class', d.name[j]);
            };
        });

        nodeEnter.append("text")
            .attr("x", -10)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function (d) { return d.name })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.selectAll("circle").each(function () {
            d3.select(this).attr("r", 4.5);
        });

        nodeUpdate.select("text")
            .style("fill-opacity", function (d) { return d._top ? 1 : 1e-6; });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d, i) {
                if (typeof (d.parent) != 'undefined') return "translate(" + d.parent.y + "," + d.parent.x + ")";
                else return "translate(" + d.y + "," + d.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = containerComb.selectAll("path.link")
            .data(links, function (d) { return d.target.name; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: d.source.x0, y: d.source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: d.source.x, y: d.source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Update Table
        table();
    }

    //Display nodes to the level of depth
    function displayChildren() {
        containerComb.selectAll("g.node").each(function (d, i) {
            if (d.depth + 1 == number && !d.children) {
                d.children = d._children;
                d._children = null;
            } else if (d.depth == number) {
                d._children = d.children;
                d.children = null;
            }
        })
    }

    //Combinatoric Functions
    function counter(n, r) {
        return combinations ? nCr(n, r) : nPr(n, r);
    }
    //Calculates number of permutations of r items out of n elements
    function nPr(n, r) {
        var result = 1;
        for (var i = 0; i < r; i++) {
            result = result * (n - i);
        };
        return result ? result : "";
    }

    //Calculates number of combinations of r items out of n elements
    function nCr(n, r) {
        var result = 1;
        for (var i = 0; i < r; i++) {
            result = result * (n - i) / (i + 1);
        };
        return result ? result : "";
    }

    //Hash Code unique for each anagram
    function hashAnagram(s) {
        return s.split("").sort().reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

    //Handles permutation/combination radio buttons
    $("input[name='radioComb']").on("change", function () {
        combinations = (this.value === 'true');
        $(".count_label").toggle();
        update(dur);
    });

    //Handles Input on size
    $('#sizeComb img').click(function () {
        $('#sizeComb img').removeClass('active');
        $(this).toggleClass('active');
        size = $(this).index() + 1;
        number = Math.min(number, size);
        drawTree(0);
        $("colgroup").removeClass("click hover");
        $("#count_table colgroup").eq(number + 1).addClass("click");
    });

    // Update visualization with number
    function update_number(index) {
        oldNumber = number;
        number = index;
        if (Math.abs(number - oldNumber) > 1) {
            drawTree(0);
            update(0);
        } else {
            displayChildren();
            update(dur);
        }
    }

    // Handle table click and hover
    $("#count_table").delegate('td', 'click mouseover mouseleave', function (e) {
        var col = $(this).index() - 1,
            curr = $("#count_table colgroup").eq(col + 1);
        if (0 <= col && col != number && col <= size) {
            if (e.type == 'mouseover' && !curr.hasClass("click")) {
                curr.addClass("hover");
            } else if (e.type == 'click') {
                update_number(col);
                $("colgroup").removeClass("click hover");
                curr.addClass("click");
            } else {
                curr.removeClass("hover");
            }
        };
    });

    // Fill in values of table
    function table() {
        $('#r1').html(counter(size, 1))
        $('#r2').html(counter(size, 2))
        $('#r3').html(counter(size, 3))
        $('#r4').html(counter(size, 4))
    }

    // setup
    drawTree(0);
    update(0);
}
counting();