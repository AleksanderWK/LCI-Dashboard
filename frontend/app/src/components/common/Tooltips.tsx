/*
 * Tooltips with custom placements
 */

import {Tooltip, withStyles} from "@material-ui/core";

export const StyledTooltipBottom = withStyles({
    tooltipPlacementBottom: {
        marginTop: 4
    }
})(Tooltip);

export const StyledTooltipRight = withStyles({
    tooltipPlacementRight: {
        marginLeft: 4
    }
})(Tooltip);
