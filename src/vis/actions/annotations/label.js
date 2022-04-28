import Annotator from './annotator';
import { Scatterplot } from '../../charts';
import Color from '../../visualization/color';

const COLOR = new Color();

/**
 * @description An annotator for drawing labels.
 * 
 * @class
 * @extends Annotator
 */
class Label extends Annotator {

    /**
     * @description Draw labels for target marks.
     * 
     * @param {Chart} chart src/vis/charts/chart.js
     * @param {Array} target It describes the data scope of the annotation, which is defined by a list of filters: [{field_1: value_1}, ..., {field_k, value_k}]. By default, the target is the entire data.
     * @param {{color: string}} style Style parameters of the annotation.
     * @param {{delay: number, duration: number}} animation Animation parameters of the annotation.
     * 
     * @return {void}
     */
    annotate(chart, target, style, animation) {
        let svg = chart.svg();

        const yEncoding = chart.y;
         
        let focus_elements = svg.selectAll(".mark")
            .filter(function(d) {
                if (target.length === 0) {
                    return true
                }
                for (const item of target) {
                    if (d[item.field] === item.value) {
                        return true
                    }
                }
                return false
            });
        
        // if the focus defined in the spec does not exist
        if (focus_elements.length === 0) {
            return;
        }

        for(let focus_element of focus_elements.nodes()) {
           
            // get node data info
            let formatData
            if ("text" in style) {
                formatData = style["text"];
            }
            else if ("field" in style) {
                formatData = focus_element.__data__[style["field"]]
            } else if (chart instanceof Scatterplot) {
                formatData = focus_element.__data__[yEncoding]
            } else {
                let data_d = parseFloat(focus_element.__data__[yEncoding]);
                if ((data_d / 1000000) >= 1) {
                    formatData = data_d / 1000000 + "M";
                } else if ((data_d / 1000) >= 1) {
                    formatData = data_d / 1000 + "K";
                }else {
                    formatData = data_d + "";
                }
            }

            // identify the position
            let data_x, data_y, data_r, offset_y;
            const nodeName = focus_element.nodeName;

            if (nodeName === "circle") { // get center
                data_x = parseFloat(focus_element.getAttribute("cx"));
                data_y = parseFloat(focus_element.getAttribute("cy"));
                data_r = parseFloat(focus_element.getAttribute("r"));
                offset_y = - data_r - 10;
            } else if (nodeName === "rect") {
                const bbox = focus_element.getBBox();
                data_x = bbox.x + bbox.width / 2;
                data_y = bbox.y;
                offset_y = -10;
            } else { // currently not support
                return;
            }
            // draw text
            svg.append("text")
                .attr("class", "text")
                .attr("x", data_x)
                .attr("y", data_y + offset_y)
                .text(formatData)
                .attr("font-size", () => {
                    if ("font-size" in style) {
                        return style["font-size"];
                    } else {
                        return 12;
                    }
                })
                .attr("fill", () => {
                    if ("color" in style) {
                        return style["color"];
                    } else {
                        return COLOR.TEXT;
                    }
                })
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "Alphabetic")
                .attr("fill-opacity", 0)
                .transition()
                .duration('duration' in animation ? animation['duration']: 0)
                .attr("fill-opacity", 1);
    }
            
    }
}

export default Label;