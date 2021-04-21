import {Layout} from "react-grid-layout";

/*
 *  Finds the first free gap in a layout that the given container fits in.
 *  Searches from the top left corner, row wise.
 */
export default function packer(w: number, h: number, layout: Layout[], maxW: number): {x: number; y: number} {
    const occupied: {x: number; y: number}[] = [];

    layout.forEach((item) => {
        for (let i = item.x; i < item.x + item.w; i++) {
            for (let j = item.y; j < item.y + item.h; j++) {
                occupied.push({x: i, y: j});
            }
        }
    });

    let y = 0;

    while (true) {
        for (let x = 0; x < maxW; x++) {
            if (!occupied.some((i) => i.x == x && i.y == y)) {
                let free = true;

                for (let y2 = y; y2 < y + h; y2++) {
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
