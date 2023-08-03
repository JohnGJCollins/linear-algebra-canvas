let m11 = document.getElementById("m11");
let m12 = document.getElementById("m12");
let m21 = document.getElementById("m21");
let m22 = document.getElementById("m22");
let renderMode = document.getElementById("render-mode");
let clearButton = document.getElementById("clear-points");
let plane = document.getElementById("plane");
let context = plane.getContext("2d");

let pointRadius = 5;
let pointColor = "rgb(100, 0, 255)";
let lineWidth = 2;
let lineColor = "rgba(0, 255, 0, 128)";
let arrowRadius = 5;

let points = [];
let centerPosition = {x: 0, y: 0};
let pan = false;
let panLast = null;

if(context.fill) {
    render();

    plane.onmousedown = function(e) {
        let rectangle = e.target.getBoundingClientRect();
        let x = e.clientX - rectangle.left - plane.width / 2;
        let y = e.clientY - rectangle.top - plane.height / 2;

        if(renderMode.value !== "edit") {
            // TODO: add click-drag panning
            pan = true;
            panLast = {x: x, y: y};
            render();
            return;
        }

        points.push({x: x, y: y});
        render();
    };

    window.onmouseup = function(e) {
        pan = false;
    };

    plane.onmousemove = function(e) {
        if(pan) {
            let rectangle = e.target.getBoundingClientRect();
            let x = e.clientX - rectangle.left - plane.width / 2;
            let y = e.clientY - rectangle.top - plane.height / 2;

            centerPosition.x -= x - panLast.x;
            centerPosition.y -= y - panLast.y;
            panLast = {x: x, y: y};
            render();
        }
    };

    m11.addEventListener("input", render);
    m12.addEventListener("input", render);
    m21.addEventListener("input", render);
    m22.addEventListener("input", render);
    renderMode.addEventListener("input", () => {
        centerPosition = {x: 0, y: 0};
        render();
    });
    clearButton.addEventListener("click", () => {
        points = [];
        centerPosition = {x: 0, y: 0};
        render();
    });
}

function render() {
    context.clearRect(0, 0, plane.width, plane.height);

    drawAxes();

    context.fillStyle = pointColor;
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;

    if(!points.length) {
        return;
    } else if(points.length === 1) {
        drawPoint(transformPoint(points[0]));
        return;
    }

    let transformed = points.map(transformPoint);

    for(let i = 0; i < points.length - 1; i++) {
        drawLine(transformed[i], transformed[i + 1]);
        drawPoint(transformed[i]);   
    }
    drawPoint(transformed[transformed.length - 1]);
}

function drawAxes() {
    let axisHeight = plane.height / 2 - centerPosition.y;
    let axisDisplacement = plane.width / 2 - centerPosition.x;

    if(axisHeight < 0) {
        axisHeight = 1;
    } else if(axisHeight > plane.height) {
        axisHeight = plane.height - 1;
    }

    if(axisDisplacement < 0) {
        axisDisplacement = 1;
    } else if(axisDisplacement > plane.width) {
        axisDisplacement = plane.width - 1;
    }

    context.strokeStyle = "rgb(0, 0, 0)";
    context.lineWidth = 1;

    // x-axis line
    context.beginPath();
    context.moveTo(0, axisHeight);
    context.lineTo(plane.width, axisHeight);
    context.stroke();

    // y-axis line
    context.beginPath();
    context.moveTo(axisDisplacement, 0);
    context.lineTo(axisDisplacement, plane.height);
    context.stroke();

    context.lineWidth = 2;

    // left arrow
    context.beginPath();
    context.moveTo(1, axisHeight);
    context.lineTo(1 + arrowRadius, axisHeight - arrowRadius);
    context.stroke();

    context.beginPath();
    context.moveTo(1, axisHeight);
    context.lineTo(1 + arrowRadius, axisHeight + arrowRadius);
    context.stroke();

    // right arrow
    context.beginPath();
    context.moveTo(plane.width - 1, axisHeight);
    context.lineTo(plane.width - 1 - arrowRadius, axisHeight - arrowRadius);
    context.stroke();

    context.beginPath();
    context.moveTo(plane.width - 1, axisHeight);
    context.lineTo(plane.width - 1 - arrowRadius, axisHeight + arrowRadius);
    context.stroke();

    // top arrow
    context.beginPath();
    context.moveTo(axisDisplacement, 1);
    context.lineTo(axisDisplacement - arrowRadius, 1 + arrowRadius);
    context.stroke();
    
    context.beginPath();
    context.moveTo(axisDisplacement, 1);
    context.lineTo(axisDisplacement + arrowRadius, 1 + arrowRadius);
    context.stroke();

    // bottom arrow
    context.beginPath();
    context.moveTo(axisDisplacement, plane.height - 1);
    context.lineTo(axisDisplacement - arrowRadius, plane.height - 1 - arrowRadius);
    context.stroke();
    
    context.beginPath();
    context.moveTo(axisDisplacement, plane.height - 1);
    context.lineTo(axisDisplacement + arrowRadius, plane.height - 1 - arrowRadius);
    context.stroke();

        // if(centerPosition.y + plane.height / 2 < 0) {

        // } else if(centerPosition.y - plane.height / 2 > plane.height) {
            
        // } else {
        //     // x-axis line
        //     context.beginPath();
        //     context.moveTo(0, plane.height / 2 - centerPosition.y);
        //     context.lineTo(plane.width, plane.height / 2 - centerPosition.y);
        //     context.stroke();

        //     // left arrow
        //     context.beginPath();
        //     context.moveTo(0, plane.height / 2 - centerPosition.y);
        //     context.lineTo(arrowRadius, plane.height / 2 - centerPosition.y - arrowRadius);
        //     context.stroke();

        //     context.beginPath();
        //     context.moveTo(0, plane.height / 2 - centerPosition.y);
        //     context.lineTo(arrowRadius, plane.height / 2 - centerPosition.y + arrowRadius);
        //     context.stroke();

        //     // right arrow
        //     context.beginPath();
        //     context.moveTo(plane.width, plane.height / 2 - centerPosition.y);
        //     context.lineTo(plane.width - arrowRadius, plane.height / 2 - centerPosition.y - arrowRadius);
        //     context.stroke();

        //     context.beginPath();
        //     context.moveTo(plane.width, plane.height / 2 - centerPosition.y);
        //     context.lineTo(plane.width - arrowRadius, plane.height / 2 - centerPosition.y + arrowRadius);
        //     context.stroke();
        // }

        // if(centerPosition.x + plane.width / 2 < 0) {

        // } else if(centerPosition.x - plane.width / 2 > plane.width) {
            
        // } else {
        //     // y-axis line
        //     context.beginPath();
        //     context.moveTo(plane.width / 2 - centerPosition.x, 0);
        //     context.lineTo(plane.width / 2 - centerPosition.x, plane.height);
        //     context.stroke();

        //     // top arrow
        //     context.beginPath();
        //     context.moveTo(plane.width / 2 - centerPosition.x, 0);
        //     context.lineTo(plane.width / 2 - centerPosition.x - arrowRadius, arrowRadius);
        //     context.stroke();

        //     context.beginPath();
        //     context.moveTo(plane.width / 2 - centerPosition.x, 0);
        //     context.lineTo(plane.width / 2 - centerPosition.x + arrowRadius, arrowRadius);
        //     context.stroke();

        //     // bottom arrow
        //     context.beginPath();
        //     context.moveTo(plane.width / 2 - centerPosition.x, plane.height);
        //     context.lineTo(plane.width / 2 - centerPosition.x - arrowRadius, plane.height - arrowRadius);
        //     context.stroke();

        //     context.beginPath();
        //     context.moveTo(plane.width / 2 - centerPosition.x, plane.height);
        //     context.lineTo(plane.width / 2 - centerPosition.x + arrowRadius, plane.height - arrowRadius);
        //     context.stroke();
        // }
}

function drawPoint(point) {
    context.fillRect(point.x - pointRadius + plane.width / 2, point.y - pointRadius + plane.height / 2, pointRadius * 2, pointRadius * 2);
}

function drawLine(start, end) {
    context.beginPath();
    context.moveTo(start.x + plane.width / 2, start.y + plane.height / 2);
    context.lineTo(end.x + plane.width / 2, end.y + plane.height / 2);
    context.stroke();
}

function transformPoint(point) {
    if(renderMode.value === "edit") {
        return point;
    }

    let matrix = [[m11.value || 0, m12.value || 0], [m21.value || 0, m22.value || 0]];
    return {x: point.x * matrix[0][0] + point.y * matrix[0][1] - centerPosition.x, y: point.x * matrix[1][0] + point.y * matrix[1][1] - centerPosition.y};
}