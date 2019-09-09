function GetRGBGradientString(percentColor) {
    var r = Math.floor(255* percentColor).toString();
    var g = 0;
    var b = 255 - Math.floor(255* percentColor).toString();
    var str = "rgb(" + r + "," + g + "," + b + ")";
    console.log(str);
    return str;
}

function DrawPolyline(points, svg, percentColor) {

    var lineFunc = d3.svg.line()
        .x(function(d) {return d[0]*20 + 10;})
        .y(function(d) {return d[1]*10 + 10;})
        .interpolate("linear")

    var lineGraph = svg.append("path")
        .attr("d", lineFunc(points))
        .attr("stroke", GetRGBGradientString(percentColor))
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.5)
        .attr("fill", "none");
}

// returns binary representation of dec, padded out with 0s to
// len inputLen.
function GetInputWord(dec, inputLen){
    var stringRep = (dec >>> 0).toString(2);
    stringRep = stringRep.padStart(inputLen, '0');
    return stringRep.split("");
}

function HammingDistance(a,b) {
    var numDifferentBits = 0;
    console.assert(a.length == b.length);
    for (var i = 0; i < a.length; i++) {
        numDifferentBits += a[i] != b[i];
    }
    return numDifferentBits;
}

function MinHammingDistance(word, codewords) {
    var minDistanceSoFar = word.length;
    for (codeword of codewords) {
        minDistanceSoFar = Math.min(minDistanceSoFar, HammingDistance(word, codeword));
    }
    return minDistanceSoFar;
}


// params are first and second param of Hamming code (7,4) for example.
function GetHammingCodewords(generatorMat, svg) {
    var codewordLen = math.size(generatorMat).get([0]);
    var inputLen = math.size(generatorMat).get([1]);

    numPaths = Math.pow(2, inputLen);

    var codewords = [];

    for (var i = 0; i < numPaths; i++) {
        var inputRaw = GetInputWord(i, inputLen);
        var inputVec = math.transpose(math.matrix(inputRaw));
        var codeword = math.multiply(generatorMat, inputVec);
        // take codeword mod 2.
        codeword = codeword.map(function(e) {
            return e % 2;
        });
        codewords.push(codeword.toArray());
        var points = GetPointsFromCodeword(codeword);
        DrawPolyline(points, svg, i/numPaths);
    }
    return codewords;
}

function GetPointsFromCodeword(codeword) {
    var x = 0;
    // we decide where to place the y coord of the first point based on
    // the codeword size - since we branch up or down at each step, we
    // want to make sure we never go below y=0.
    var y = codeword.size()[0] + 5;
    var points = [[x,y]];
    for (var i = 0; i < codeword.size(); i++) {
        x += 1;
        if (codeword.get([i]) == 1) {
            y += 1;
        } else {
            y -= 1;
        }
        points.push([x,y]);
    }
    return points;
}

var width = 600;
var height = 600;
var svg = d3.select("#svg-container").append("svg").attr("width", width).attr("height", height);

svg.append("rect");

const generatorMat = math.matrix([[1, 1, 0, 1],
                                  [1, 0, 1, 1],
                                  [1, 0, 0, 0],
                                  [0, 1, 1, 1],
                                  [0, 1, 0, 0],
                                  [0, 0, 1, 0],
                                  [0, 0, 0, 1]]);

var codewords = GetHammingCodewords(generatorMat, svg);


// console.log("codewords: ", codewords);

// just curious, let's go through words of length 7 and check them against the
// codewords and see how far the max distance is.
for (var i = 0; i < Math.pow(2, 7); i++) {
    var word = GetInputWord(i, 7);
    console.log(MinHammingDistance(word, codewords));
}
// Max distance is just 1.

// How to let user input this?
