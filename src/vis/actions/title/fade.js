import Titler from './titler'

class Fade extends Titler {
    maketitle(chart, style, animation) {
        let svg = chart.svg();
        let words = style.text.split(" ").filter(d => d !== "");
    
        let virtualE = svg.append("text")
            .attr("font-family", 'Arial-Regular')
            .attr("font-size", 24)
            .text(words[0]);

        let textE = svg.append("text")
            .attr("x","50%")
            .attr("y",-15)
            .attr("dominant-baseline", "central")
            .attr("transform", "translate(" + 310 + "," + (10) + ")")
            .attr("font-family", 'Arial-Regular')
            .attr("font-weight","bold")
            .attr("font-size", 24)
            .attr("text-anchor", "middle");
        
        let maxWidth = Math.max(virtualE.node().getComputedTextLength(), 600);
        const lineHeight = virtualE.node().getBBox().height * 0.9;

        let line = '';
        let rowCount = 0;
        const maxRow = 4;

        // 如果没有定义 duration
        if(animation.duration===-1){
            for (let n = 0; n < words.length; n++) {
                let testLine = line + ' ' + words[n];
                /*  Add line in testElement */
                if(rowCount === maxRow - 1){
                    virtualE.text(testLine+ "…");
                }else{
                    virtualE.text(testLine);
                }
                /* Messure textElement */
                let testWidth = virtualE.node().getComputedTextLength();
                if (testWidth > maxWidth) {
                    if(rowCount === maxRow - 1){//最后一行还有文字没显示
                        line += "…";
                        break;
                    }else{//new row
                        textE.append("tspan")
                            .attr("x", 0)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(2000)
                            .attr("fill-opacity", 1);
                        line = words[n];
                        rowCount ++;
                    }
                } else {
                    line = testLine;
                }
            }
            
            textE.append("tspan")
                .attr("x", 0)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(2000)
                .attr("fill-opacity", 1);
            virtualE.remove();
        }
        // 定义了 duration
        else{
            for (let n = 0; n < words.length; n++) {
                let testLine = line + ' ' + words[n];
                /*  Add line in testElement */
                if(rowCount === maxRow - 1){
                    virtualE.text(testLine+ "…");
                }else{
                    virtualE.text(testLine);
                }
                /* Messure textElement */
                let testWidth = virtualE.node().getComputedTextLength();
                if (testWidth > maxWidth) {
                    if(rowCount === maxRow - 1){//最后一行还有文字没显示
                        line += "…";
                        break;
                    }else{//new row
                        textE.append("tspan")
                            .attr("x", 0)
                            .attr("dy", lineHeight)
                            .text(line)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 1)
                            .transition()
                            .duration(animation.duration/2)
                            .attr("fill-opacity", 0)
                            .remove();
                        line = words[n];
                        rowCount ++;
                    }
                } else {
                    line = testLine;
                }
            }
            
            textE.append("tspan")
                .attr("x", 0)
                .attr("dy", lineHeight)
                .text(line)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 1)
                .transition()
                .duration(animation.duration/2)
                .attr("fill-opacity", 0)
                .remove();
            virtualE.remove();
            
        }
    }
}

export default Fade