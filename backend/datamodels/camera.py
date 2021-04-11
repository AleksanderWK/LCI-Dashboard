
class OpenFaceDataPoint:

    # List of AUs where 01 is on index 1, 45 on 45 etc. (some positions can have None since not all AUs are in the dataset)
    au_list = []

    def __init__(self, headerRow, dataRow):
        try:
            start_index = headerRow.index(" AU01_c")
            self.au_list = [None] * 46
            for i in range(start_index, len(headerRow)):
                self.au_list[int(headerRow[i][3:5])] = int(float(dataRow[i]))
        except IndexError:
            pass
