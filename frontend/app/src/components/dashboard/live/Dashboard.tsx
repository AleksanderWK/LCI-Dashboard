import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionActiveContainersState} from "../../../state/session";
import DashboardWrapper from "../DashboardWrapper";
import Container from "./Container";

function Dashboard(): JSX.Element {
    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    return (
        <DashboardWrapper>
            <>
                {Object.values(Variable)
                    .filter((variable) => activeContainers[variable].active)
                    .map((variable) => {
                        return (
                            <Container
                                key={variable}
                                variable={variable}
                                display={activeContainers[variable].display}
                            />
                        );
                    })}
            </>
        </DashboardWrapper>
    );
}

export default Dashboard;
