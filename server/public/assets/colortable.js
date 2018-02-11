
var col = document.getElementsByClassName("num-cell");
var full = document.getElementsByClassName("num-cell-fullrange")
var joys = document.getElementsByClassName("joy");


for (var n of col) {
    var r,g,b;
    var val = Number(n.innerHTML);
    if (val <= 0.5)
    {
        r = Math.floor(255 * val*2);
        g = 255;
        b = Math.floor(255 * val*2);
    }
    else
    {
        r = 255;
        g = Math.floor((1 - (val - 0.5) * 2) * 255);
        b = Math.floor((1 - (val - 0.5) * 2) * 255);
    }

    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    n.style.background = color;
};

for (var n of full) {
    var r,g,b;
    var val = Number(n.innerHTML);
    if (val > 0)
    {
        r = Math.floor(255 * (1-val));
        g = 255;
        b = Math.floor(255 * (1-val));
    }
    else if (val < 0)
    {
        r = 255;
        g = Math.floor((1+val) * 255);
        b = Math.floor((1+val) * 255);
    }
    else
    {
        r = 255;
        g = 255;
        b = 255;
    }

    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    n.style.background = color;
};

for (var n of joys) {
    var r,g,b;
    var val = Number(n.innerHTML);
    if (val >= 0.5)
    {
        r = Math.floor((1 -((val - 0.5) * 2)) * 255);
        g = 255;
        b = Math.floor((1 -((val - 0.5) * 2)) * 255);
    }
    else
    {
        r = 255;
        g = Math.floor(val*2 * 255);
        b = Math.floor(val*2 * 255);
    }

    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    n.style.background = color;
    console.log(color);
};
