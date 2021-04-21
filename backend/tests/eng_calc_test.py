from calculators.eng_calc import EngagementCalculator
from datamodels.wristband import EDADataPoint


def test_calculate():
    calculator = EngagementCalculator()
    for i in range(0, len(test_data), 4):
        points = list(map(lambda row: EDADataPoint(row), test_data[i:i+4]))
        value = calculator.calculate_dataset(points)
        assert value == results[i // 4]

results = [
    -1,
    -1,
    -1,
    -1,
    2.847647374585148,
    3.047828219859208,
    3.3851884807913324,
    3.544680000060932,
    3.327640135768628,
    3.135689346531584
]


test_data = [
    [0.000000],
    [0.833996],
    [1.181441],
    [1.618365],
    [1.703017],
    [1.720952],
    [1.740168],
    [1.742730],
    [1.742730],
    [1.744012],
    [1.761947],
    [1.795256],
    [1.823440],
    [1.817034],
    [1.836251],
    [1.883651],
    [1.900306],
    [1.915679],
    [1.904149],
    [1.888776],
    [1.888776],
    [1.881089],
    [1.872122],
    [1.860592],
    [1.849062],
    [1.840094],
    [1.838813],
    [1.841375],
    [1.842656],
    [1.858029],
    [1.879808],
    [1.910555],
    [1.946425],
    [1.963279],
    [1.987620],
    [2.004274],
    [2.017085],
    [2.017085],
    [2.018366],
    [2.027334]
]