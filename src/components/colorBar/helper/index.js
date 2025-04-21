import * as d3 from "d3";

export const COLOR_MAP = {
    rdylgn: d3.interpolateRdYlGn, //imerg
    turbo: d3.interpolateTurbo, //sst
    bupu_r: (t) => d3.interpolateBuPu(1-t), //viirs,modis // todo: review
    viridis: d3.interpolateViridis, //cygnss // todo: review
    greys: d3.interpolateGreys, // goes 8
    greys_r: (t) => d3.interpolateGreys(1-t), //goes02 (reversed)
    cubehelix: (t) => d3.interpolateCubehelixDefault(t), //goes13 // todo: review
    magma: d3.interpolateMagma,
    reds: d3.interpolateReds,
    gist_earth: (t) => d3.interpolateGreys(1-t), // (reversed)
    default: d3.interpolatePlasma
}

export const createColorbar = (colorbar, VMIN=-92, VMAX=100, STEP=30, colorMap="default", skipStep=false) => {
    // Create a color scale using D3
    const colorScale = d3
        .scaleSequential(COLOR_MAP[colorMap])
        .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

    colorbar
        .append("svg")
        .attr("class", "colorbar-svg")
        .append("g")
        .selectAll("rect")
        .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / 100)) // Adjust the number of color segments as needed
        .enter()
        .append("rect")
        .attr("height", 12) // height of the svg color segment portion
        .attr("width", "100%") // Adjust the width of each color segment
        .attr("x", (d, i) => i * 3)
        .attr("fill", (d) => colorScale(d));

    if (skipStep) {
        return;
    }

    // Define custom scale labels
    const scaleLabels = generateScale(VMIN, VMAX, STEP);

    // Create a container for color labels
    colorbar
        .append("div")
        .attr("class", "colorbar-scale-tick-label-container")
        .selectAll("div")
        .data(scaleLabels)
        .enter()
        .append("div")
        .attr("class", "colorbar-scale-tick-label")
        .text((d) => d); // Set the tick label text
}

function generateScale(min, max, step) {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
        if (Number(i)%1 !== 0 ) {
            numbers.push(Number(i).toFixed(2));
        } else {
            numbers.push(i);
        }
    }
    numbers[numbers.length - 1] += "+";
    return numbers;
}
  