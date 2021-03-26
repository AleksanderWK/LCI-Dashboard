from math import sqrt
from calculators.mmdvcalc import MMDVCalculator
from datamodels.skeletal import SkeletalNodeCollection, JOINT_AMOUNT

class EnergySpentFatigue(MMDVCalculator):

    last_positions = None
    last_total_vel = None
    last_total_acc = None
    last_total_jerk = None

    def __init__(self):
        pass

    def calculate_dataset(self, data: SkeletalNodeCollection):
        self.set_last_values(data)
        if self.last_total_jerk != None:
            return self.last_total_jerk
        else:
            return 0

    def total_distance(self, last_positions, current_positions):
        result = 0
        for i in range(JOINT_AMOUNT):
            dx = current_positions.nodes[i].x - last_positions.nodes[i].x
            dy = current_positions.nodes[i].y - last_positions.nodes[i].y
            dz = current_positions.nodes[i].z - last_positions.nodes[i].z

            dist = sqrt(dx**2 + dy**2 + dz**2)
            result += dist
        return result

    def total_vel(self, last_positions, current_positions):
        return self.total_distance(last_positions, current_positions) / (current_positions.time - last_positions.time)
    
    def total_acc(self, last_positions, current_positions):
        return self.total_vel(last_positions, current_positions) / (current_positions.time - last_positions.time)

    def total_jerk(self, last_positions, current_positions):
        return self.total_acc(last_positions, current_positions) / (current_positions.time - last_positions.time)

    def set_last_values(self, data):
        if len(data.nodes) == 0 or data.time == None:
            return

        if self.last_total_acc != None:
            self.last_total_jerk = self.total_jerk(self.last_positions, data)
        
        if self.last_total_vel != None:
            self.last_total_acc = self.total_acc(self.last_positions, data)
        
        if self.last_positions != None:
            self.last_total_vel = self.total_vel(self.last_positions, data)

        self.last_positions = data