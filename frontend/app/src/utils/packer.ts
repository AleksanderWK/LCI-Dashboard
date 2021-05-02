import {Layout} from "react-grid-layout";

interface Position {
    x: number;
    y: number;
}

/**
 * Finds the first free gap in a layout that the given container fits in.
 * Searches from the top left corner, row wise.
 * @param {number} w - The width of the container to fit
 * @param {number} h - The height of the container to fit
 * @param {Layout[]} layout - The exisiting layout (a list of objects with width, height and positon)
 * @param {number} maxW - The max width of the layout
 * @returns {Position} - The position where the container fits in
 */
export default function packer(w: number, h: number, layout: Layout[], maxW: number): Position {
    const occupied: Position[] = [];

    // Get all occupied positions from the exisiting layout
    layout.forEach((item) => {
        for (let i = item.x; i < item.x + item.w; i++) {
            for (let j = item.y; j < item.y + item.h; j++) {
                occupied.push({x: i, y: j});
            }
        }
    });

    let y = 0;

    // Go through each row
    while (true) {
        // For each column, check if there is a free space
        for (let x = 0; x < maxW; x++) {
            if (!occupied.some((i) => i.x == x && i.y == y)) {
                let free = true;

                // Position is free, so check if the container fits

                // Check in y direction
                for (let y2 = y; y2 < y + h; y2++) {
                    // Check in x direction
                    if (x + w <= maxW) {
                        for (let x2 = x; x2 < x + w; x2++) {
                            if (occupied.some((i) => i.x == x2 && i.y == y2)) {
                                free = false;
                                break;
                            }
                        }
                    } else {
                        free = false;
                    }

                    if (!free) {
                        break;
                    }
                }

                if (free) {
                    // If the container fits, return the position
                    return {
                        x: x,
                        y: y
                    };
                }
            }
        }

        y += 1;
    }
}
