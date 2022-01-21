var canvas;
var ctx;

var cubes;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var arr = []; // for sound later if needed

var width = 1024;
var height = 768;

var n = 1024;
var colorStart = 200;
var colorEnd = 66;

var numComparisons;
var arrayAccess;

function Cube(h, i) {
    this.height = h;
    this.index = i;
    this.zscore = 0;

    this.r = 100;
    this.g = 20;
    this.b = 0;
    this.color = "";
}

function build() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    cubes = new Array();


    loadCanvas();

    window.focus();
}

function onCanvasClick() {

    //  playSound(1000);
}


function shuffleArray(array, callback) {


    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        array[i].index = i;
    }

    callback();
}


function loadCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.style.border = '1px solid #000';

    for (var i = 0; i < n; i++) {
        var cube = new Cube(768 - (i * height / width), i);


        cubes.push(cube);
    }


    shuffleArray(cubes, function () {
        render();
        slowSort();
    });






}

async function slowSort() {
    document.getElementById('sort').innerHTML = "Selection Sort | Expected time: (n)(n + 1)/2";

    numComparisons = 0;
    for (var j = 0; j < cubes.length; j++) {
        await new Promise(r => setTimeout(r, 5));
        var maxHeight = height;
        var maxIndex = -1;
        for (var i = j; i < cubes.length; i++) {
            numComparisons++;
            if (cubes[i].height < maxHeight) {
                // arrayAccess++;
                maxIndex = i;
                maxHeight = cubes[i].height;
            }
        }

        if (maxIndex != -1) {
            var h = cubes[maxIndex].height;
            cubes[maxIndex].height = cubes[j].height;
            cubes[j].height = h;
        }

        setColor(j);
        render();
    }

    shuffleArray(cubes, function () {
        insertionSort();
    });
}

async function insertionSort() {
    document.getElementById('sort').innerHTML = "Insertion Sort | Expected time: n to n^2";

    numComparisons = 0;

    for (var j = 0; j < cubes.length; j++) {
        var keyHeight = cubes[j].height;

        var i = j - 1;
        while (i > 0 && cubes[i].height > keyHeight) {
            cubes[i + 1].height = cubes[i].height;
            setColor(i + 1);
            i--;
            //render();
            numComparisons++;
        }

        await new Promise(r => setTimeout(r, 5));
        setColor(i + 1)
        cubes[i + 1].height = keyHeight;

        render();

    }

    shuffleArray(cubes, function () {
        ms();
    });


}

function ms() {
    document.getElementById('sort').innerHTML = "Merge Sort | Expected time: fast?";
    numComparisons = 0;

    mergeSort(0, cubes.length - 1);

}

var counter = 0;
function mergeSort(p, r) {
   // console.log(p + ", " + r)
    if (p == r) return;
        var q = Math.floor((p + r) / 2);

        mergeSort(p, q);
        mergeSort(q + 1, r);
        merge(p, q, r);
}

/**
 * n1 = q – p + 1
2. n2 = r – q
3. let L[1.. n1+1] and R[1.. n2+1] be new arrays
4. for i = 1 to n1
5. L[i] = A[p + i – 1]
6. for j = 1 to n2
7. R[j] = A[q + j]
8. L[n1+1] = ∞
9. R[n2+1] = ∞
10. i = 1
11. j = 1
 * 
 */

async function merge(p, q, r) {
    n1 = q - p + 1; // size of first subarray
    n2 = r - q; // size of second subarray

    var L = new Array(n1);
    var R = new Array(n2);

    for(var i = 0; i < n1; i++) {
        L[i] = cubes[p + i];
    }

    for(var i = 0; i < n2; i++) {
        R[i] = cubes[q + i + 1];
    }

    var i = 0;
    var j = 0;

    for(var k = p; k < r; k++) {
        if(L[i].height <= R[i].height) {
            await new Promise(r => setTimeout(r, 5));
            cubes[k].height = L[i].height;
            render();
            i++;
        } else {
            await new Promise(r => setTimeout(r, 5));
            cubes[k].height = R[j].height;
            render();
            j++;
        }
    }
}

function setColor(index) {
    var div = (Math.abs(colorStart - colorEnd)) / n * index;
    cubes[index].color = 'hsl(' + (colorEnd - div) + ', 100%, 50%)';
}

function update() {

    // need to 
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var i;
    for (i = 0; i < cubes.length; i++) {
        var c = cubes[i];
        if (cubes[i].color != "") {
            ctx.fillStyle = cubes[i].color;//'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
        }
        ctx.fillRect((i) * (width / n), height - c.height, width / n, c.height);
    }

    document.getElementById('comparisons').innerHTML = "n: " + n + " Comparisons: " + numComparisons;
}

document.onload = build();