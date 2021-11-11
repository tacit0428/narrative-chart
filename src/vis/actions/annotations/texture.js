import Annotator from './annotator'

class Texture extends Annotator {
    annotate(chart, target, style) {
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
            });
    }
}

export default Texture;