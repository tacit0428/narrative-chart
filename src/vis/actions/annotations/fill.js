import * as d3 from 'd3';
import Color from '../../visualization/color';
import Annotator from './annotator'
import { ProgressBar } from '../../charts';

const COLOR = new Color();

/**
 * @description An annotator for filling color.
 * 
 * @class
 * @extends Annotator
 */
class Fill extends Annotator {

    /**
     * @description Fill target marks with color.
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        // For progress bar
        if (chart instanceof ProgressBar && !chart.color) {
            // data process
            let processedData = chart.processedData()
            let svg = chart.svg();
            let content = chart.content
            let xEncoding = chart.x
            let totalX = 0
            let processedDict = []

            let curProcessedDict = svg.selectAll('.rects').selectAll('rect').data()
            if (curProcessedDict.length === 0) {
                processedData.forEach((d, i) => {
                    if (target.length === 0) {
                        return true
                    }
                    for (const item of target) {
                        if (d[item.field] === item.value) {
                            let color = 'color' in style ? style['color'] : COLOR.ANNOTATION
                            processedDict.push({...d,[xEncoding]:d[xEncoding],color:[color]})
                        }
                    }
                    totalX += d[xEncoding]
                  })
    
                let scale = d3.scaleLinear()
                .range([0, chart._width])
                    .domain([0, totalX])
                
                let preX = 0
                processedDict.forEach((d, i) => {
                    d.width = scale(d[xEncoding])
                    d.x = preX
                    preX += d.width
                })

                content.append("g")
                    .attr("class", "rects")
                
                this.updateProgressBar(processedDict,chart,style,animation)
            } else {
                processedDict = [...curProcessedDict]
                processedData.forEach((d, i) => {
                    if (target.length === 0) {
                        return true
                    }
                    for (const item of target) {
                        if (d[item.field] === item.value) {
                            let color = 'color' in style ? style['color'] : COLOR.ANNOTATION
                            processedDict.push({...d,[xEncoding]:d[xEncoding],color:[color]})
                        }
                    }
                    totalX += d[xEncoding]
                  })
    
                let scale = d3.scaleLinear()
                .range([0, chart._width])
                    .domain([0, totalX])
                
                let preX = 0
                processedDict.forEach((d, i) => {
                    d.width = scale(d[xEncoding])
                    d.x = preX
                    preX += d.width
                })

                this.updateProgressBar(processedDict,chart,animation)
            }

        } else {
            // For other charts
            let svg = chart.svg();
            d3.selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };
            svg.selectAll(".mark")
                .filter(function (d) {
                    if (target.length === 0) {
                        return true
                    }
                    for (const item of target) {
                        if (d[item.field] === item.value) {
                            return true
                        } 
                    }
                    return false
                })
                .attr("opacity", 1)
                // .moveToFront()
                .transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr("fill", function (d) {
                    if ('color' in style) {
                        return style['color']
                    } else {
                        return COLOR.ANNOTATION
                    }
                })
                .attr("opacity", 1);
        }
    }

    updateProgressBar(data,chart,animation) {
        let content = chart.content
        let progress = content.select(".rects")
        .selectAll("rect")
        .data(data)
        .join('rect')
        .attr('class', 'mark')
        .attr('fill', d=>d.color)
        .attr("opacity", 1)
        .attr('height', chart._width / 8)
        .attr('x', d=>d.x)
            .attr('y', 0)
        
        let defs = content.append('svg:defs');
        defs.append("svg:clipPath")
            .attr("id", "round-corner-left")
            .append("svg:rect")
            .attr('height', chart._width/ 8)
            .attr('width',data[0].width + chart.cornerRadius)
            .attr('rx', chart.cornerRadius)
            .attr('ry', chart.cornerRadius)
        
        defs.append("svg:clipPath")
            .attr("id", "round-corner-right")
            .append("svg:rect")
            .attr('height', chart._width / 8)
            .attr('width',data[data.length-1].width + chart.cornerRadius)
            .attr('rx', chart.cornerRadius)
            .attr('ry', chart.cornerRadius)
        
        progress.attr('clip-path', function (d, i) {
            if (i === 0) {
                return 'url(#round-corner-left)'
            } else if (i === data.length-1 && d.x+d.width >= chart.width) { 
                return 'url(#round-corner-right)'
            } else {
            return ''
            }
        })
          
    // add animation
    progress.transition()
        .duration('duration' in animation ? animation['duration'] : 0)
        .attr('width', d=>d.width)
    }
}

export default Fill