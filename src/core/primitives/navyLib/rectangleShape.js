export default class RectangleShape {

    // Overlay ref, canvas ctx
    constructor(core) {
        this.T = core.props.config.TOOL_COLL
        this.core = core
    }

    update(p1, p2) {
        const layout = this.core.layout

        // Main points
        this.x1 = layout.time2x(p1[0])
        this.y1 = layout.value2y(p1[1])
        this.x2 = layout.time2x(p2[0])
        this.y2 = layout.value2y(p2[1])

        // Four corners
        this.topLeft = [Math.min(this.x1, this.x2), Math.min(this.y1, this.y2)]
        this.topRight = [Math.max(this.x1, this.x2), Math.min(this.y1, this.y2)]
        this.bottomRight = [Math.max(this.x1, this.x2), Math.max(this.y1, this.y2)]
        this.bottomLeft = [Math.min(this.x1, this.x2), Math.max(this.y1, this.y2)]

        // Update pin positions in the data object (p1, p2, p3, p4)
        // this.core.data.p1 = [layout.x2time(this.topLeft[0]), layout.y2value(this.topLeft[1])]
        // this.core.data.p2 = [layout.x2time(this.topRight[0]), layout.y2value(this.topRight[1])]
        // this.core.data.p3 = [layout.x2time(this.bottomRight[0]), layout.y2value(this.bottomRight[1])]
        // this.core.data.p4 = [layout.x2time(this.bottomLeft[0]), layout.y2value(this.bottomLeft[1])]
    }

    // Draw the rectangle
    draw(ctx) {
        ctx.moveTo(this.topLeft[0], this.topLeft[1])
        ctx.lineTo(this.topRight[0], this.topRight[1])
        ctx.lineTo(this.bottomRight[0], this.bottomRight[1])
        ctx.lineTo(this.bottomLeft[0], this.bottomLeft[1])
        ctx.lineTo(this.topLeft[0], this.topLeft[1])
    }

    // Collision function (check if mouse is inside the rectangle)
    collision(x, y) {
        return (
            x >= Math.min(this.x1, this.x2) &&
            x <= Math.max(this.x1, this.x2) &&
            y >= Math.min(this.y1, this.y2) &&
            y <= Math.max(this.y1, this.y2)
        )
    }
}