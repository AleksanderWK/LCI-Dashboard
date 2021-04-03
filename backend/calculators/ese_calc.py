
from calculators.mmdvcalc import MMDVCalculator


class EducationSpecificEmotionsCalculator(MMDVCalculator):

    def __init__(self):
        pass

    def calculate_dataset(self, data):
        result = {}
        result["boredom"] = self.calculate_boredom(data)
        result["frustration"] = self.calculate_frustration(data)
        result["confusion"] = self.calculate_confusion(data)
        result["delight"] = self.calculate_delight(data)
        return result

    def get_au(self, au_number, data):
        for point in data:
            value = 0
            if len(point.au_list) > 0:
                value = point.au_list[au_number]
            if value:
                return True
        return False

    def calculate_boredom(self, data):
        return self.get_au(4, data) and self.get_au(7, data) and self.get_au(12, data)

    def calculate_frustration(self, data):
        return self.get_au(12, data) and self.get_au(45, data)

    def calculate_confusion(self, data):
        return self.get_au(1, data) and self.calculate_boredom(data)

    def calculate_delight(self, data):
        return self.get_au(25, data) and self.get_au(26, data) and self.calculate_boredom(data)
