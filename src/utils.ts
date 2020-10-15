// Combines two transforms by doing a matrix multiplication.
// The first transform applied is a, followed by b, which
// is normally written b * a.
export function multiply(a, b) {
    return [
        [ a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] ],
        [ a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0, a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] ]
    ] as Transform;
}
  
// Creates a "move" transform.
export function move(x, y) {
    return [
        [1, 0, x],
        [0, 1, y]
    ] as Transform;
}
  
// Creates a "rotate" transform.
export function rotate(theta) {
    return [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0]
    ] as Transform;
}

// Calculates the distance between two points
export function pointsDistance(x1, x2, y1, y2) {
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
  