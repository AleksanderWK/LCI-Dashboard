import React from "react";
import ReactDOM from "react-dom";
import {render, screen} from "@testing-library/react";
import Menu from "../Menu";

it("menu matches snapshot", () => {
    const {baseElement} = render(
        <Menu
            open={true}
            anchorEl={document.body}
            isDetailedView={true}
            onShowMore={() => null}
            onShowLess={() => null}
            onRemoveView={() => null}
            onMenuClose={() => null}
        />
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <Menu
            open={true}
            anchorEl={document.body}
            isDetailedView={true}
            onShowMore={() => null}
            onShowLess={() => null}
            onRemoveView={() => null}
            onMenuClose={() => null}
        />,
        div
    );
});

it("renders show less and remove view buttons", () => {
    render(
        <Menu
            open={true}
            anchorEl={document.body}
            isDetailedView={true}
            onShowMore={() => null}
            onShowLess={() => null}
            onRemoveView={() => null}
            onMenuClose={() => null}
        />
    );
    expect(screen.getAllByText("Show less").pop()).toBeInTheDocument();
    expect(screen.getAllByText("Remove view").pop()).toBeInTheDocument();
});
