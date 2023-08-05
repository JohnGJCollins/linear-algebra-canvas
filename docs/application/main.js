let headerTable = document.getElementById("header-table");
let m11 = document.getElementById("m11");
let m12 = document.getElementById("m12");
let m13 = document.getElementById("m13");
let m21 = document.getElementById("m21");
let m22 = document.getElementById("m22");
let m23 = document.getElementById("m23");
let m31 = document.getElementById("m31");
let m32 = document.getElementById("m32");
let m33 = document.getElementById("m33");
let renderMode = document.getElementById("render-mode");
let transformationMode = document.getElementById("transformation-mode");
let clearButton = document.getElementById("clear-points");
let applyTransformationButton = document.getElementById("apply-transformation");
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

transformationMode.addEventListener("input", () => {
    let isLinear = transformationMode.value === "linear"; 
    
    m13.hidden = isLinear;
    m13.disabled = isLinear;

    m23.hidden = isLinear;
    m23.disabled = isLinear;

    m31.hidden = isLinear;
    m31.disabled = isLinear;

    m32.hidden = isLinear;
    m32.disabled = isLinear;

    m33.hidden = isLinear;
    m33.disabled = isLinear;
});

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
    m13.addEventListener("input", render);
    m21.addEventListener("input", render);
    m22.addEventListener("input", render);
    m23.addEventListener("input", render);
    m31.addEventListener("input", render);
    m32.addEventListener("input", render);
    m33.addEventListener("input", render);
    renderMode.addEventListener("input", () => {
        centerPosition = {x: 0, y: 0};
        render();
    });
    transformationMode.addEventListener("input", render);
    clearButton.addEventListener("click", () => {
        points = [];
        centerPosition = {x: 0, y: 0};
        render();
    });
    applyTransformationButton.addEventListener("click", () => {
        points = points.map(transformPoint);
        m11.value = 1;
        m12.value = 0;
        m13.value = 0;
        m21.value = 0;
        m22.value = 1;
        m23.value = 0;
        m31.value = 0;
        m32.value = 0;
        m33.value = 1;
        render();
    });
    addEventListener("resize", render);
}

function render() {
    plane.height = window.innerHeight - headerTable.offsetHeight;
    plane.width = window.innerWidth;
    context.clearRect(0, 0, plane.width, plane.height);

    drawAxes();

    context.fillStyle = pointColor;
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    
    let transformed = renderMode.value === "edit" ? points : points.map(adjustPoint);

    if(!points.length) {
        return;
    } else if(points.length === 1) {
        drawPoint(transformed[0]);
        return;
    }

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
    context.lineWidth = 2;

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
    if(transformationMode.value === "linear") {
        let matrix = [[m11.value || 0, m12.value || 0], [m21.value || 0, m22.value || 0]];
        return {
            x: point.x * matrix[0][0] + point.y * matrix[0][1],
            y: point.x * matrix[1][0] + point.y * matrix[1][1]
        };
    }

    let matrix = [
        [Number(m11.value) || 0, Number(m12.value) || 0, Number(m13.value) || 0],
        [Number(m21.value) || 0, Number(m22.value) || 0, Number(m23.value) || 0],
        [Number(m31.value) || 0, Number(m32.value) || 0, Number(m33.value) || 0]
    ];
    return {
        x: point.x * matrix[0][0] + point.y * matrix[0][1] + 100 * matrix[0][2],
        y: point.x * matrix[1][0] + point.y * matrix[1][1] - 100 * matrix[1][2] // Translation is negative because the canvas is upside-down relative to standard Cartesian coordinates
    };
}

function adjustPoint(point) {
    let transformed = transformPoint(point);
    return {x: transformed.x - centerPosition.x, y: transformed.y - centerPosition.y};
}