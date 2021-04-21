import {render, screen} from "@testing-library/react";
import {Variable} from "../../../../constants";
import {RecoilRoot} from "recoil";
import CalculatingIndicator from "../CalculatingIndicator";

it("renders correctly", () => {
    render(
        <RecoilRoot>
            <CalculatingIndicator variable={Variable.CognitiveLoad} />
        </RecoilRoot>
    );
    expect(screen.getByText(/Calculating.../i)).toBeInTheDocument();
});
