import Annotator from './annotator'

class Fade extends Annotator {
    annotate(chart, target, style, animation) {
        let svg = chart.svg();
        svg.selectAll(".mark")
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
            })
            .transition()
            .duration('duration' in animation ? animation['duration']: 0)
            .attr("opacity", 0.3)
    }
}

export default Fade