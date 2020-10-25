//TODO: allow them to choose a size
zentangleSize = 2;
var type = "circle";

function start() {
    var radios = document.getElementsByName("template-radio");
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          // do whatever you want with the checked radio
          type = radios[i].value;
          console.log("type " + type)
          // only one radio can be logically checked, don't check the rest
          break;
        }
    }

    var select = document.getElementById("chunk-count");
    zentangleSize = Math.sqrt(select.value);
    //const a = document.createElement('a');
    //a.id = "startbutton";
    window.location.href = "./draw/index.html?type=" + type + "&size=" + zentangleSize;
    return;
    //a.click();
    
}

/*
1.80, 120, 40
2. 40, 170, 95
3. 200, 200, 50
4. 260, 160, 40
5. 210, 40, 75
6. 160, 40, 60
*/


var imagearray;
var centers, radii, shapes, zen_offsets;
var imagewidth;

var imageindex = 0;

var mode = "draw";

var canvas, zentangle, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var color = "black",
    width = 2;

function drawStyle(style) {
    mode = style;
}

function drawWidth(w) {
    width = w;
}

function drawColor(c) {
    color = c;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    type = getParameterByName("type");
    zentangleSize = getParameterByName("size");


    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    if (type == 'square') {
        imagewidth = 800 / zentangleSize;
        imagearray = new Array(zentangleSize * zentangleSize);
    } else if (type == 'circle') {
        radii = [40*2.5,95*2.5,40*2.5,95*2.5,50,40,75,60];
        
        zen_offsets = [[120,360],[120,360],[70,530],[235,465],[],[],[],[],[],[],[]]
                    
        // for each shape, we need a two item array of the circles that compose it. for each circle, we need
        // x, y, radius, start, end, direction
        shapes = [

            //shape A: circle 1, circle 2
            [[120,160,40*2,0.8*Math.PI,0.11*(Math.PI),false],
            [150,370,95*2,1.577*(Math.PI),1.331*Math.PI,true]],

            //shape B: circle 1, circle 2
            [[120,160,40*2,0.8*Math.PI,0.11*(Math.PI),true],
            [150,370,95*2,1.577*(Math.PI),1.331*Math.PI,true]],

            //shape C: circle 3, circle 2, circle 1, circle 2
            [
            [430,170,50*2,0.665*Math.PI,1.258*Math.PI,false],
            [200,200,95*2,1.82*(Math.PI),1.579*(Math.PI),true],
            [170,-10,40*2,0.11*(Math.PI),0.8*Math.PI,false],
            [200,200,95*2,1.332*(Math.PI),0.096*Math.PI,true]
            ],

            //shape D: circle 2, circle 3
            [[35,265,95*2,1.82*Math.PI,0.096*(Math.PI),false],
            [265,235,50*2,0.665*Math.PI,1.258*Math.PI,false]],
            
            //shape E: circle 2, circle 3, circle 4, circle 3
            [[
                
            ]]

            
        ]

        imagearray = new Array(shapes.length);
        imagewidth = 400;
        drawShape();
        
        // for (let i = 0; i < 6; i++) {
        //     ctx.beginPath();
        //     ctx.arc(centers[i][0], centers[i][1], radii[i], 0, 2 * Math.PI);
        //     ctx.stroke(); 
        // }
    }
}

function drawShape() {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    console.log(imageindex);
    for (i = 0; i < shapes[imageindex].length; i++) {
        ctx.arc(shapes[imageindex][i][0],shapes[imageindex][i][1],shapes[imageindex][i][2],shapes[imageindex][i][3],shapes[imageindex][i][4],shapes[imageindex][i][5]);
    }
    ctx.stroke();

    ctx.clip();
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
}

function nextImage() {
    type = getParameterByName("type");
    zentangleSize = getParameterByName("size");
    var dataURL = canvas.toDataURL();
    imagearray[imageindex] = dataURL;
    console.log("imageindex" + imageindex)
    
    if (++imageindex == imagearray.length) { // last image
        // TODO: eventually call other functions for different templates
        if (type == "square") {
            generateSquareImage();
        } else {
            generateCircleImage();
        }
        
        // hide and display the elements on the page
        document.getElementById("canvas").style.display = "none";
        document.getElementById("next_image").style.display = "none";
        document.getElementById("zentangle").style.display = "block";
        document.getElementById("save_zentangle").style.display = "inline";
    } else {
        // reset drawing canvas
        canvas.width = 400;
        if (type = "circle") {
            drawShape();
        }
    }
}

// Saves the zentangle to the user's computer
function save() {
    zentangle = document.getElementById('zentangle');
    const data = zentangle.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = data;
    a.download = 'zentangle.png';
    a.click();
}

function generateCircleImage() {
    var ctx = document.getElementById('zentangle').getContext('2d');

    for (let i = 0; i < imagearray.length; i++) {
            console.log("drawing")
            var img = new Image();
            img.onload = function () {
                ctx.drawImage(this, zen_offsets[i][0], zen_offsets[i][1], imagewidth, imagewidth);
            }
            img.src = imagearray[i];
        
    }
}

function generateSquareImage() {
    var ctx = document.getElementById('zentangle').getContext('2d');

    for (i = 0; i < zentangleSize; i++) {
        for (j = 0; j < zentangleSize; j++) {
            var img = new Image();
            img.setAtX = i * imagewidth;
            img.setAtY = j * imagewidth;
            img.onload = function () {
                ctx.drawImage(this, this.setAtX, this.setAtY, imagewidth, imagewidth);
            }
            img.src = imagearray[i * zentangleSize + j];
        }
    }

    /*
    * Draw grid lines between squares, vertical and then horizontal
    */
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    for (i = 1; i < zentangleSize; i++) {
        ctx.beginPath();       // Start a new path
        ctx.moveTo(i * imagewidth, 0);    // Move the pen
        ctx.lineTo(i * imagewidth, 800);  // Draw a line
        ctx.stroke();          // Render the path
    }
    for (i = 1; i < zentangleSize; i++) {
        ctx.beginPath();       // Start a new path
        ctx.moveTo(0, i * imagewidth);    // Move the pen
        ctx.lineTo(800, i * imagewidth);  // Draw a line
        ctx.stroke();          // Render the path
    }
    /*
    * Draw a border around the zentangle
    */
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.rect(0, 0, 800, 800);
    ctx.stroke();

}

function findxy(res, e) {
    // on mouse press, record current coordinates in currX/Y
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        //turn on flag for continuous draw
        if (mode == 'draw') {
            flag = true;
        }
    }

    if (res == 'up' && mode == 'line') {
        //release draws the straight line
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
    }
    if (res == 'up' || res == "out") {
        // stop dragging the line
        flag = false;
    }
    if (res == 'move' && mode == 'draw') {
        //draw a new segment on each mouse move
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}