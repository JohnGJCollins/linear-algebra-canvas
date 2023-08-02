let m11 = document.getElementById("m11");
let m12 = document.getElementById("m12");
let m21 = document.getElementById("m21");
let m22 = document.getElementById("m22");
let renderMode = document.getElementById("render-mode");
let clearButton = document.getElementById("clear");
let plane = document.getElementById("plane");
let context = plane.getContext("2d");

let pointRadius = 5;
let pointColor = "rgb(100, 0, 255)";
let lineWidth = 2;
let lineColor = "rgba(0, 255, 0, 128)";

let points = [];
let centerPosition = {x: 0, y: 0};

if(context.fill) {
    render();

    plane.onmousedown = function(e) {
        if(renderMode.value !== "edit") {
            // TODO: add click-drag panning

            render();
            return;
        }

        let rectangle = e.target.getBoundingClientRect();
        let x = e.clientX - rectangle.left - plane.width / 2;
        let y = e.clientY - rectangle.top - plane.height / 2;

        points.push({x: x, y: y});
        render();
    };

    m11.addEventListener("input", render);
    m12.addEventListener("input", render);
    m21.addEventListener("input", render);
    m22.addEventListener("input", render);
    renderMode.addEventListener("input", render);
    clearButton.addEventListener("click", () => {
        points = [];
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
    if(renderMode.value !== "edit") {
        // TODO: axes should be transformed when in render mode
        return;
    }

    context.lineWidth = 1;
    context.strokeStyle = "rgb(0, 0, 0)";

    context.beginPath();
    context.moveTo(plane.width / 2, 0);
    context.lineTo(plane.width / 2, plane.height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, plane.height / 2);
    context.lineTo(plane.width, plane.height / 2);
    context.stroke();
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
    return {x: point.x * matrix[0][0] + point.y * matrix[0][1], y: point.x * matrix[1][0] + point.y * matrix[1][1]};
}