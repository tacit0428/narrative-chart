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
        if (chart instanceof ProgressBar) {
            // data process
            let processedData = chart.processedData()
            let total = 0
            let find = processedData.filter((d) => {
                total += d[chart.x]
                if (target.length === 0) {
                    return true
                }
                if (d[target[0].field] === target[0].value) {
                    return true
                }
                return false
            })
            let innerWidth = 0
            if (find.length > 0) {
                innerWidth = find[0][chart.x] / total * chart._width
            }

            // add fill
            let content = chart.content
            let progress = content.append('rect')
                .attr('class', 'mark')
                .attr('rx', chart.cornerRadius)
                .attr('ry', chart.cornerRadius)
                .attr('fill', function (d) {
                    if ('color' in style) {
                        return style['color']
                    } else {
                        return COLOR.ANNOTATION
                    }
                })
                .attr("opacity", 1)
                .attr('height', chart._width / 8)
                .attr('x', 0)
                .attr('y', 0)

            // add animation
            progress.transition()
                .duration('duration' in animation ? animation['duration'] : 0)
                .attr('width', innerWidth);
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
                            continue
                        } else {
                            return false
                        }
                    }
                    return true
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
}

export default Fill