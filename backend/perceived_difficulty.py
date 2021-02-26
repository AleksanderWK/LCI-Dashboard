import math

# Table columns: fixationID, init_time, end_time, fixationX, fixationY
data_sample = [
[386, 111, 203, 1054, 720],
[387, 309, 399, 1166, 672],
[388, 467, 539, 1087, 653],
[389, 809, 1219, 1052, 599],
[390, 1308, 1499, 1048, 621],
[391, 1609, 1701, 1069, 664],
[392, 1927, 2044, 717, 566],
[393, 2088, 2239, 856, 636],
[394, 2267, 2358, 821, 652]]

def main_pd(data):
    for i in range(1, len(data)):
        prev_fx = data[i-1][-2]
        prev_fy = data[i-1][-1]
        new_fx = data[i][-2]
        new_fy = data[i][-1]
        # prev_init_time = data[i-1][1]
        prev_end_time = data[i-1][2]
        new_init_time = data[i][1]
        # new_end_time = data[i][2]
        print(calculate_perceived_difficulty(prev_fx, prev_fy, new_fx, new_fy, prev_end_time, new_init_time))


def calculate_perceived_difficulty(fx0, fy0, fx1, fy1, et0, it1):
    # The Euclidian distance between two fixations
    saccade_length = math.dist([fx0, fy0],[fx1, fy1])
    # Duration between end time of previous fixation and start time of the new fixation
    saccade_duration = it1 - et0
    # Defintion of speed/velocity
    saccade_speed = saccade_length / saccade_duration
    # Forumla for perceived difficulty
    perceived_difficulty = 1/(1+saccade_speed)
    return perceived_difficulty

main_pd(data_sample)