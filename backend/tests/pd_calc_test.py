from datamodels.eye_tracking import EyeTrackingDataPoint
from calculators.pd_calc import PerceivedDifficultyCalculator


def test_calculate():
    calculator = PerceivedDifficultyCalculator()
    for i in range(len(test_data)):
        row = test_data[i]
        point = EyeTrackingDataPoint(row)
        value = calculator.calculate_dataset([point])


results_calculate = [
    50.0,
    0,
    50.0,
    33.33333333333333,
    50.0,
    60.0,
    50.0,
    57.14285714285714,
    62.5,
    55.55555555555556,
    60.0,
    54.54545454545454,
    58.333333333333336,
    61.53846153846154,
    64.28571428571429,
    71.42857142857143,
    71.42857142857143,
    73.33333333333333,
    80.0,
    75.0,
    68.75,
    62.5,
    64.70588235294117,
    64.28571428571429
]


test_data = [
    [386,111,203,3.664,3.572,1054,720],
    [387,309,399,-1,3.548,1166,672],
    [388,467,539,3.78,3.5175,1087,653],
    [389,809,1219,3.799411765,3.604285714,1052,599],
    [390,1308,1499,3.951111111,3.676,1048,621],
    [391,1609,1701,-1,3.688,1069,664],
    [392,1927,2044,4.232,3.738333333,717,566],
    [393,2088,2239,4.01,3.7575,856,636],
    [394,2267,2358,3.84,3.7,821,652],
    [395,2670,2940,3.694285714,3.482142857,527,792],
    [396,2967,3142,3.856666667,3.471111111,559,810],
    [397,3447,3675,3.759166667,3.450833333,938,663],
    [398,3705,3843,3.632857143,3.417142857,959,649],
    [399,3870,5002,3.766111111,3.522807018,943,671],
    [400,5025,5274,3.786923077,3.595384615,882,677],
    [401,5325,5574,3.826923077,3.602307692,941,633],
    [402,5604,5713,-1,3.546666667,971,578],
    [403,5746,5842,3.8,3.544,961,598],
    [404,5907,5982,3.7375,3.5225,953,668],
    [405,6227,6394,3.622222222,3.35875,980,569],
    [406,6609,6680,3.62,3.41,889,697],
    [407,6804,6880,3.635,3.43,880,659],
    [408,6909,7078,3.648888889,3.382222222,881,584],
    [409,7687,7900,3.664545455,3.490909091,826,648]
]