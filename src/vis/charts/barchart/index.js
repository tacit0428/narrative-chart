import * as d3 from 'd3';
import Chart from '../chart';
import Color from '../../visualization/color';
import Background from '../../visualization/background';


const COLOR = new Color();
const background = new Background();
const offset = 65;


/**
 * @description A bar chart is a chart type.
 *
 * @class
 * @extends Chart
 */
class BarChart extends Chart {


    /**
     * @description Main function of drawing bar chart.
     *
     * @return {function} It represents the canvas that has been created, on which subsequent charts, titles, and other content expand.
     */
    visualize() {
        let margin = this.margin()

        this.Hscaleratio = this.height() / 640
        this.Wscaleratio = this.width() / 640

        this.width(this.width() - margin.left - margin.right);
        this.height(this.height() - margin.top - margin.bottom);

        // this._svg = d3.select(this.container())
        //         .append("svg")
        //         .attr("width", this.width() + margin.left + margin.right)
        //         .attr("height", this.height() + margin.top + margin.bottom)
        //         .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.cornerRadius = this.markStyle()['corner-radius'] ? this.markStyle()['corner-radius'] : 0;
        this.binSpacing = this.markStyle()['bin-spacing'] ? this.markStyle()['bin-spacing'] : 0.5;
        this.stroke = this.markStyle()['stroke'] ? this.markStyle()['stroke'] : COLOR.DEFAULT;
        this.strokeWidth = this.markStyle()['stroke-width'] ? this.markStyle()['stroke-width'] : 0;
        this.strokeOpacity = this.markStyle()['stroke-opacity'] ? this.markStyle()['stroke-opacity'] : 1;
        this.fillOpacity = this.markStyle()['fill-opacity'] ? this.markStyle()['fill-opacity'] : 1;

        this.drawBackground();

        let svg = this.svg();

        if (this.markStyle()["fill"]) {
            this.fill = this.markStyle()["fill"]
        } else if (this.markStyle()["background-image"]) {
            this.checkImgSize(this.markStyle()["background-image"], (imgWidth, imgHeight) => {
                const ratio = Math.max(this.width() / imgWidth, this.height() / imgHeight)
                let margin = this.margin()
                let chartbackgroundsize = {
                    width: imgWidth * ratio,
                    height: imgHeight * ratio
                }
                let defs = svg.append('svg:defs');
                defs.append("svg:pattern")
                    .attr("id", "chart-background-image")
                    .attr("width", chartbackgroundsize.width)
                    .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartbackgroundsize.height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", this.markStyle()["background-image"])
                    .attr("width", chartbackgroundsize.width)
                    .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartbackgroundsize.height)
                    .attr("x", 0)
                    .attr("y", 0);
            })
            this.fill = "url(#chart-background-image)"
        } else if (this.style()["mask-image"]) {
            this.checkImgSize(this.style()["mask-image"], (imgWidth, imgHeight) => {
                const ratio = Math.max(this.width() / imgWidth, this.height() / imgHeight)
                let margin = this.margin()
                let chartmasksize = {
                    width: imgWidth * ratio,
                    height: imgHeight * ratio
                }
                let defs = svg.append('svg:defs');
                defs.append("svg:pattern")
                    .attr("id", "chart-mask-image")
                    .attr("width", chartmasksize.width)
                    .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartmasksize.height)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("xlink:href", this.style()["mask-image"])
                    .attr("preserveAspectRatio", "xMidYMid slice")
                    .attr("width", chartmasksize.width)
                    .attr("height", margin.top === 130 * this.Hscaleratio ? 480 * this.Hscaleratio : chartmasksize.height)
                    .attr("x", -2)
                    .attr("y", 0);
            })
            this.fill = "url(#chart-mask-image)"
        } else {
            this.fill = COLOR.DEFAULT
        }

        this.axis = svg.append("g")
            .attr("class", "axis")
        this.content = svg.append("g")
            .attr("class", "content")
            .attr("chartWidth", this.width())
            .attr("chartHeight", this.height())

        return this.svg();
    }

    /**
     * @description Draw Background for bar chart.
     *
     * @return {void}
     */
    drawBackground() {
        let margin = this.margin()


        let chartbackgroundsize = {
            width: 600 * this.Wscaleratio,
            height: 615 * this.Hscaleratio
        }

        let container = this.container()


        d3.select(container)
            .append("svg")
            .attr("width", this.width() + margin.left + margin.right)
            .attr("height", this.height() + margin.top + margin.bottom)
            .style("background-color", COLOR.BACKGROUND)

        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "svgBackGrnd")
            .append("rect")
            .attr("width", this.Wscaleratio * 640)
            .attr("height", this.Hscaleratio * 640)


        d3.select(container)
            .select("svg")
            .append("g")
            .attr("id", "chartBackGrnd")
            .append("rect")
            .attr("width", chartbackgroundsize.width)
            .attr("height", margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height)
            .attr("transform", "translate(" + (20 * this.Wscaleratio) + "," + margin.top + ")");


        const axisTextOffset_y = 5;
        this._svg = d3.select(container)
            .select("svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + axisTextOffset_y) + ")");


        if (background.Background_Image) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "svg-backgroundimage")
                .attr("width", 1)
                .attr("height", 1)
                .attr("patternUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", background.Background_Image.url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", background.Background_Image.opacity ?? 1)
                .attr("filter", background.Background_Image.grayscale ? "grayscale(" + background.Background_Image.grayscale + "%)" : "grayscale(0%)")
                .attr("width", this.Wscaleratio * 640)
                .attr("height", this.Hscaleratio * 640)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#svgBackGrnd").attr("fill", "url(#svg-backgroundimage)")
        } else if (background.Background_Color) {
            d3.select("#svgBackGrnd").attr("fill", background.Background_Color.color ?? "white").attr("fill-opacity", background.Background_Color.opacity ?? 1)
        }
        else {
            d3.select("#svgBackGrnd").remove()
        }

        if (this.style()['background-color']) {
            d3.select("#chartBackGrnd").attr("fill", this.style()['background-color'].color ?? "white").attr("fill-opacity", this.style()['background-color'].opacity ?? 1)
        }
        else if (this.style()['background-image']) {
            let defs = d3.select(container).select("svg").append('svg:defs');
            defs.append("svg:pattern")
                .attr("id", "chart-backgroundimage")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", this.style()["background-image"].url)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .attr("opacity", this.style()["background-image"].opacity ?? 1)
                .attr("filter", this.style()["background-image"].grayscale ? "grayscale(" + this.style()["background-image"].grayscale + "%)" : "grayscale(0%)")
                .attr("width", chartbackgroundsize.width)
                .attr("height", margin.top === 130 * this.Hscaleratio ? 505 * this.Hscaleratio : chartbackgroundsize.height)
                .attr("x", 0)
                .attr("y", 0);
            d3.select("#chartBackGrnd").attr("fill", "url(#chart-backgroundimage)")
        }
        else {
            d3.select("#chartBackGrnd").attr("fill-opacity", 0)
        }

    }

    /**
     * @description Draw Axis for bar chart.
     *
     * @return {void}
     */
    drawAxis() {
        if (this.x && this.y) {
            let x = this.x,
                y = this.y;
            let svg = this.svg();
            let width = this.width(),
                height = this.height() - offset;
            let fontsize = 16, strokeWidth = 2;
            const padding = fontsize,
                triangleSize = Math.ceil(Math.sqrt(height * width) / 10);

            let axis = svg.select('.axis');
            svg.select(".axis_x").remove();
            svg.select(".axis_y").remove();

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", padding - 1)
                .attr("font-size", fontsize)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("fill", COLOR.TEXT)
                .text(x || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(${width - triangleSize / 25 * 2}, ${height})rotate(90)`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", COLOR.AXIS);
            axis.append("line")
                .attr("x1", -strokeWidth / 2)
                .attr("x2", width)
                .attr("y1", height)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", COLOR.AXIS);
            axis.append("text")
                .attr("transform", `translate(${-padding}, ${height / 2}) rotate(-90)`)
                .attr("font-size", fontsize)
                .attr("text-anchor", "middle")
                .attr("fill", COLOR.TEXT)
                .text(y || "Count");
            axis.append("path")
                .attr("class", "triangle")
                .attr("transform", `translate(0, ${triangleSize / 25 * 2})`)
                .attr("d", d3.symbol().type(d3.symbolTriangle).size(triangleSize))
                .attr("fill", COLOR.AXIS);
            axis.append("line")
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke-width", strokeWidth)
                .attr("stroke", COLOR.AXIS);
        }

    }

    /**
     * @description Draw bars with xy encoding.
     *
     * @return {void}
     */
    encodeXY() {
        if (this.x && this.y) {
            let svg = this.svg();
            let width = this.width(),
                height = this.height() - offset;
            const processedData = this.processedData();
            const xEncoding = this.x,
                yEncoding = this.y;

            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width - 12])
                .domain(processedData.map(d => d[xEncoding]))
                .padding(this.binSpacing);

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(processedData, d => d[yEncoding])])
                .nice();

            /** draw axis */
            let axis = svg.append("g")
                .attr("class", "axis"),
                content = svg.append("g")
                    .attr("class", "content")
                    .attr("chartWidth", width)
                    .attr("chartHeight", height);

            let axisX = d3.axisBottom(xScale);
            let axisY = d3.axisLeft(yScale)
                .ticks(5)
                .tickSize(0, 0, 0)
                .tickPadding(5)
                .tickFormat(function (d) {
                    if ((d / 1000000) >= 1) {
                        d = d / 1000000 + "M";
                    } else if ((d / 1000) >= 1) {
                        d = d / 1000 + "K";
                    }
                    return d;
                });

            axis.append("g")
                .attr("class", "axis_x")
                .attr('transform', `translate(0, ${height})`)
                .call(axisX);

            axis.append("g")
                .attr("class", "axis_y")
                .call(axisY);

            // specify color for axis elements
            // tick
            axis.selectAll(".tick line")
                .attr("stroke", COLOR.AXIS);
            // domain path
            axis.selectAll(".domain")
                .attr("stroke", COLOR.AXIS);
            // tick label
            axis.selectAll(".tick")
                .selectAll("text")
                .attr("fill", COLOR.AXIS);

            // draw y axis path
            axis.selectAll(".axis_y")
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height);

            axis.selectAll(".axis_y .tick text")
                .attr("transform", "translate(3, 0)");

            // axix-label
            const labelPadding = 24, fontsize = 16;

            axis.append("text")
                .attr("x", width / 2)
                .attr("y", svg.selectAll(".axis_x").select("path").node().getBBox().height + offset - 5)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(xEncoding);

            axis.append("text")
                .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);

            /** draw grid */
            axis.selectAll(".axis_y .tick line")
                .attr("class", "gridline")
                .attr("stroke", d => {
                    if (d === 0) return 0;
                    else return COLOR.DIVIDER;
                });

            /* draw rects */
            content.append("g")
                .attr("class", "rects")
                .selectAll("rect")
                .data(processedData)
                .enter().append("rect")
                .attr("class", "mark")
                .attr("x", d => xScale(d[xEncoding]))
                .attr("y", d => yScale(d[yEncoding]))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d[yEncoding]))
                .attr("fill", COLOR.DEFAULT);
        }
    }

    /**
    * @description Using X-axis to encode a data field.
    *
    * @return {void}
    */
    encodeX(axis = {}) {
        if (this.x) {
            let svg = this.svg();
            let width = this.width(),
                height = this.height() - offset;
            const processedData = this.processedData();
            const xEncoding = this.x;

            /** set the ranges */
            this.xScale = d3.scaleBand()
                .range([0, width - 12])
                .domain(processedData.map(d => d[xEncoding]))
                .padding(this.binSpacing);

            let axisX = d3.axisBottom(this.xScale);

            let axis_X = this.axis.append("g")
                .attr("class", "axis_x")
                .attr('transform', `translate(0, ${height})`)
                .call(axisX);

            // specify color for axis elements
            // tick
            axis_X.selectAll(".tick line")
                .attr("stroke", COLOR.AXIS);
            // domain path
            axis_X.selectAll(".domain")
                .attr("stroke", COLOR.AXIS);
            // tick label
            axis_X.selectAll(".tick")
                .selectAll("text")
                .attr("fill", COLOR.AXIS)
                .attr("font-size", axis['labelFontSize'] || 10)
                .attr("text-anchor", "end")
                .attr("transform", `rotate(-${axis['labelAngle'] || 45} 0 10)`)

            // axix-label
            const fontsize = 16;

            axis_X.append("text")
                .attr("x", width / 2)
                .attr("y", svg.selectAll(".axis_x").select("path").node().getBBox().height + offset - 5)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(xEncoding);
        }
    }

    /**
    * @description Using Y-axis to encode a data field.
    *
    * @return {void}
    */
    encodeY() {
        if (this.y) {
            let width = this.width(),
                height = this.height() - offset;
            const processedData = this.processedData();
            const yEncoding = this.y;

            let obj = {};
            this.bardata = [];

            if (this.x) {
                processedData.forEach(item => {
                    if (obj.hasOwnProperty(item[this.x])) {
                        obj[item[this.x]] = obj[item[this.x]] + item[this.y]
                    }
                    else {
                        obj[item[this.x]] = item[this.y]
                    }
                })
                for (let key in obj) {
                    let temp = {};
                    temp[this.x] = key
                    temp[this.y] = obj[key]
                    this.bardata.push(temp)
                }
            }
            else {
                console.log("encode x lacks")
            }

            /** set the ranges */
            // this.yScale = d3.scaleLinear()
            //     .range([height, 0])
            //     .domain([0, d3.max(processedData, d => d[yEncoding])])
            //     .nice();

            this.yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(this.bardata, d => d[yEncoding])])
                .nice();

            let axisY = d3.axisLeft(this.yScale)
                .ticks(5)
                .tickSize(0, 0, 0)
                .tickPadding(5)
                .tickFormat(function (d) {
                    if ((d / 1000000) >= 1) {
                        d = d / 1000000 + "M";
                    } else if ((d / 1000) >= 1) {
                        d = d / 1000 + "K";
                    }
                    return d;
                });

            let axis_Y = this.axis.append("g")
                .attr("class", "axis_y")
                .call(axisY);

            // specify color for axis elements
            // tick
            axis_Y.selectAll(".tick line")
                .attr("stroke", COLOR.AXIS);
            // domain path
            axis_Y.selectAll(".domain")
                .attr("stroke", COLOR.AXIS);
            // tick label
            axis_Y.selectAll(".tick")
                .selectAll("text")
                .attr("fill", COLOR.AXIS);

            // draw y axis path
            axis_Y.selectAll(".axis_y .tick")
                .append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width)
                .attr("y2", 0);

            axis_Y.selectAll(".axis_y .tick text")
                .attr("transform", "translate(3, 0)");

            // axix-label
            const labelPadding = 24, fontsize = 16;

            axis_Y.append("text")
                .attr("transform", `translate(${-labelPadding}, ${height / 2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("font-size", fontsize)
                .attr("fill", COLOR.AXIS)
                .text(yEncoding);

            /** draw grid */
            axis_Y.selectAll(".axis_y .tick line")
                .attr("class", "gridline")
                .attr("stroke", d => {
                    if (d === 0) return 0;
                    else return COLOR.DIVIDER;
                });
        }
    }

    /**
     * @description Coloring bars with color encoding.
     *
     * @return {void}
     */
    encodeColor(animation = {}) {
        // if colorEncoding, clear and redraw
        if (this.color) {
            let width = this.width(),
                height = this.height() - offset;
            const data = this.data();
            const xEncoding = this.x,
                yEncoding = this.y;
            const colorEncoding = this.color;
            let content = d3.select(".content");


            /** clear rects */
            d3.selectAll(".rects").remove();

            /** process data */
            // get series
            let seriesData = {};
            data.forEach(d => {
                if (seriesData[d[colorEncoding]]) {
                    seriesData[d[colorEncoding]].push(d);
                } else {
                    seriesData[d[colorEncoding]] = [d];
                }
            });
            let series = Object.keys(seriesData);
            let seriesDict = {}
            series.forEach(d => seriesDict[d] = 0)

            // adjust data structure to fit stackdata
            const processedData = this.processedData()
            let processedDict = {}
            processedData.forEach((d, i) => {
                let temp = {}
                temp[d[colorEncoding]] = d[yEncoding]
                processedDict[d[xEncoding]] = { ...processedDict[d[xEncoding]], ...temp }
            })
            let stackProcessedData = []
            for (let key in processedDict) {
                let temp2 = {}
                temp2[xEncoding] = key
                stackProcessedData.push({ ...seriesDict, ...temp2, ...processedDict[key] })
            }
            let stackData = d3.stack().keys(series)(stackProcessedData);


            /** set the ranges */
            let xScale = d3.scaleBand()
                .range([0, width - 12])
                .domain(data.map(d => d[xEncoding]))
                .padding(this.binSpacing);

            let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(stackData[stackData.length - 1], d => d[1])])
                .nice();

            let yTop = []
            for (let d of stackData[stackData.length - 1]) {
                yTop.push(d[1])
            }

             /** Trick for single side corner */
            let defs = content.append('svg:defs');
            
            /** draw rect layers */
            let rectLayers = content.append("g")
                .selectAll("g")
                .data(stackData)
                .join("g")
                .attr("class", "rectLayer")
                // .attr("fill", (d, i) => COLOR.CATEGORICAL[i]);
                .attr("fill", COLOR.DEFAULT);
            rectLayers.selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                .attr("class", "mark")
                .attr("x", d => {
                    d[xEncoding] = d.data[xEncoding]
                    return xScale(d.data[xEncoding])
                })
                .attr("y", d =>  yScale(d[1]) )
                .attr("width", xScale.bandwidth())
                .attr("height", d => Math.abs(yScale(d[1]) - yScale(d[0])) )
                .attr("fill-opacity", this.fillOpacity)
                .attr("stroke", this.stroke)
                .attr("stroke-width", this.strokeWidth)
                .attr("stroke-opacity", this.strokeOpacity)
                .attr('clip-path', (d, i) => {
                    if (d[0] < d[1] && d[1] === yTop[i]) {
                        defs.append("svg:clipPath")
                            .attr("id", `round-corner-${d[xEncoding]}`)
                            .append("svg:rect")
                            .attr('width', xScale.bandwidth())
                            .attr('height',Math.abs(yScale(d[1]) - yScale(d[0]))+this.cornerRadius)
                            .attr('rx', this.cornerRadius)
                            .attr('ry', this.cornerRadius)
                            .attr('x', xScale(d.data[xEncoding]))
                            .attr('y',yScale(d[1]))
                        return `url(#round-corner-${d[xEncoding]})`
                    } else {
                        return ''
                    }
                })
            
            d3.selectAll(".rectLayer")
                .transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill", (d, i) => COLOR.CATEGORICAL[i % COLOR.CATEGORICAL.length]);
        }
    }

    /**
     * @description Add encoding and redraw bars.
     *
     * @return {void}
     */
    addEncoding(channel, field, animation = {}, axis = {}) {
        if (!this[channel]) {
            this[channel] = field;

            let changeX = false;
            let changeY = false;

            switch (channel) {
                case "x":
                    changeX = true;
                    this.encodeX(axis);
                    break;
                case "y":
                    changeY = true;
                    this.encodeY()
                    break;
                case "color":
                    this.encodeColor(animation);
                    break;
                default:
                    console.log("no channel select");
            }

            if ((this.x && this.y) && (changeX || changeY)) {
                this.content.append("g")
                    .attr("class", "rects")
                    .selectAll("rect")
                    .data(this.bardata)
                    .enter().append("rect")
                    .attr("class", "mark")
                    .attr("x", d => this.xScale(d[this.x]))
                    .attr("y", this.height() - offset)
                    .attr("width", this.xScale.bandwidth())
                    .attr("height", 0)
                    .attr("fill", this.fill)
                    .attr("rx", this.cornerRadius)
                    .attr("ry", this.cornerRadius)
                    .attr("fill-opacity", this.fillOpacity)
                    .attr("stroke", this.stroke)
                    .attr("stroke-width", this.strokeWidth)
                    .attr("stroke-opacity", this.strokeOpacity);
                if ('duration' in animation) {
                    this.animationGrowTogether(animation);
                }
                else {
                    this.content.selectAll(".mark")
                        .attr("y", d => this.yScale(d[this.y]))
                        .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
                }

            }
        }
    }

    /**
     * @description Modify encoding and redraw bars.
     *
     * @return {void}
     */
    modifyEncoding(channel, field, animation = {}) {
        if (this[channel]) {
            this[channel] = field;

            switch (channel) {
                case 'x':
                    new Promise((resolve, reject) => {
                        this.content.selectAll(".mark")
                            .transition()
                            .duration('duration' in animation ? animation['duration'] / 2 : 0)
                            .style('opacity', 0)
                            .on("end", resolve)
                    })
                        .then(() => {
                            this.svg().selectAll(".rects").remove();
                            this.svg().selectAll(".axis_x").remove();
                            this.svg().selectAll(".axis_y").remove();
                        })
                        .then(() => {
                            this.encodeX();
                            this.encodeY();
                            this.content.append("g")
                                .attr("class", "rects")
                                .selectAll("rect")
                                .data(this.bardata)
                                .enter().append("rect")
                                .attr("class", "mark")
                                .attr("x", d => this.xScale(d[this.x]))
                                .attr("y", this.height() - offset)
                                .attr("width", this.xScale.bandwidth())
                                .attr("height", 0)
                                .attr("fill", this.fill)
                                .attr("rx", this.cornerRadius)
                                .attr("ry", this.cornerRadius)
                                .attr("fill-opacity", this.fillOpacity)
                                .attr("stroke", this.stroke)
                                .attr("stroke-width", this.strokeWidth)
                                .attr("stroke-opacity", this.strokeOpacity);
                            if ('duration' in animation) {
                                animation['duration'] = animation['duration'] / 2
                                this.animationGrowTogether(animation)
                            }
                            else {
                                this.content.selectAll(".mark")
                                    .attr("y", d => this.yScale(d[this.y]))
                                    .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
                            }
                        })
                    break;
                case 'y':
                    this.svg().selectAll(".axis_y").remove();
                    this.encodeY();
                    if ('duration' in animation) {
                        this.animationGrowTogether(animation)
                    }
                    else {
                        this.content.selectAll(".mark")
                            .attr("y", d => this.yScale(d[this.y]))
                            .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
                    }
                    break;
                case 'color':
                    this.encodeColor(animation)
                    break;
                default:
                    console.log("no channel select")
            }
        }
    }

    /**
     * @description Remove encoding and redraw bars.
     *
     * @return {void}
     */
    removeEncoding(channel, animation = {}) {
        this[channel] = null;

        if (channel === 'x') {
            new Promise((resolve, reject) => {
                this.content.selectAll(".mark")
                    .transition()
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
            })
                .then(() => {
                    this.svg().selectAll(".rects").remove();
                    this.svg().selectAll(".axis_x").remove();
                })
        }
        if (channel === 'y') {
            new Promise((resolve, reject) => {
                this.content.selectAll(".mark")
                    .transition()
                    .duration('duration' in animation ? animation['duration'] - 100 : 0)
                    .style('opacity', 0)
                    .on("end", resolve)
            })
                .then(() => {
                    this.svg().selectAll(".rects").remove();
                    this.svg().selectAll(".axis_y").remove().on("end", this.removemark = true);
                })
        }
        if (channel === 'color') {
            new Promise((resolve, reject) => {
                this.content.selectAll(".rectLayer")
                    .transition()
                    .duration('duration' in animation ? animation['duration'] : 0)
                    .attr("fill", COLOR.DEFAULT)
                    .on("end", resolve)
            })
                .then(() => {
                    this.svg().selectAll(".rectLayer").remove();
                    let processedData = this.processedData();
                    this.content.append("g")
                        .attr("class", "rects")
                        .selectAll("rect")
                        .data(processedData)
                        .enter().append("rect")
                        .attr("class", "mark")
                        .attr("x", d => this.xScale(d[this.x]))
                        .attr("y", d => this.yScale(d[this.y]))
                        .attr("width", this.xScale.bandwidth())
                        .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
                        .attr("fill", this.fill)
                        .attr("rx", this.cornerRadius)
                        .attr("ry", this.cornerRadius)
                        .attr("fill-opacity", this.fillOpacity)
                        .attr("stroke", this.stroke)
                        .attr("stroke-width", this.strokeWidth)
                        .attr("stroke-opacity", this.strokeOpacity);
                })
        }
    }

    /**
     * @description Adding grow(one by one) animation to the chart
     *
     * @param {{delay: number, duration: number}} animation Animation parameters of the action.
     *
     * @return {void}
    */
    animationGrow(animation) {
        let processedData = this.processedData();
        //let barduration = animation['duration']/processedData.length
        let unitnum = d3.sum(processedData, item => item[this.y]);
        let unitduration = animation['duration'] / unitnum;
        let duration = 0;
        let transDelay = d3.scaleBand()
            .range([0, animation['duration']])
            .domain(processedData.map(d => d[this.x]))

        this.content.selectAll(".mark")
            .data(this.bardata)
            .transition()
            //.duration(barduration)
            .duration(d => { duration = d[this.y] * unitduration; return duration })
            .ease(d3.easeLinear)
            .attr("y", d => this.yScale(d[this.y]))
            .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
            //.delay((d, i) => {return (i*barduration)})
            .delay(d => { return transDelay(d[this.x]) })
        //.delay((d, i) => {if(i===0){delay = 0}else{delay = delay + durationlist[i-1];};return delay})
    }

    /**
      * @description Adding grow(together) animation to the chart
      *
      * @param {{delay: number, duration: number}} animation Animation parameters of the action.
      *
      * @return {void}
     */
    animationGrowTogether(animation) {
        this.content.selectAll(".mark")
            .data(this.bardata)
            .transition()
            //.duration(barduration)
            .duration(animation['duration'])
            .ease(d3.easeLinear)
            .attr("y", d => this.yScale(d[this.y]))
            .attr("height", d => this.height() - offset - this.yScale(d[this.y]))
    }

    /**
      * @description get image size
      * @param {string} fileUrl url of image
      * @param {function} callback a callback to get imgWidth & imgHeight
      * @return {function}
      */
    checkImgSize = (fileUrl, callback) => {
        if (fileUrl) {
            const img = new Image();
            img.src = fileUrl;
            img.onload = () => {
                callback(img.width, img.height)
            };
        }
    };

}
export default BarChart;
