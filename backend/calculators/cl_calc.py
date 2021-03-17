import math
import pywt
import numpy as np
import statistics
from calculators.mmdvcalc import MMDVCalculator


class CognitiveLoadCalculator(MMDVCalculator):

    prev_data_point = None
    prev_cl = 0

    def __init__(self):
        pass

    def calculate_dataset(self, data):
        if len(data) == 0:
            return self.prev_cl

        d = []

        # Init time and end time for data batch in seconds
        init_time = data[0].initTime / 1000
        end_time = data[-1].endTime / 1000

        for i in range(0, len(data)):
            lpup = data[i].lpup
            rpup = data[i].rpup

            data_point = None

            # Choose diameter based on presence in data set
            if (not (np.isnan(lpup) or np.isnan(rpup))):
                # Left and right is present; take average
                data_point = (lpup + rpup)/2
            elif (np.isnan(lpup) and not np.isnan(rpup)):
                # Right is present
                data_point = rpup
            elif (not np.isnan(lpup) and np.isnan(rpup)):
                # Left is present
                data_point = lpup
            elif (self.prev_data_point != None):
                # Left and right is not present; take previous diameter
                data_point = self.prev_data_point

            if (data_point != None):
                d.append(data_point)
                self.prev_data_point = data_point

        # Calculate a single LHIPA value for all data points received in this batch
        if (len(d) > 0):
            lhipa = self.lhipa(d, init_time, end_time)
            print("d", d, "\ntt", end_time - init_time, "\nlhipa", lhipa, "\n")
            self.prev_cl = lhipa
            return lhipa

    def lhipa(self, d, init_time, end_time):
        # Find max decomposition level
        w = pywt.Wavelet("sym16")
        maxlevel = pywt.dwt_max_level(len(d), filter_len=w.dec_len)

        # Set high and low frequency band indeces
        hif, lof = 1, int(maxlevel / 2)

        # Get detail coefficients of pupil diameter signal d
        cD_H = pywt.downcoef("d", d, "sym16", "per", level=hif)
        cD_L = pywt.downcoef("d", d, "sym16", "per", level=lof)

        # Normalize by 1/sqrt(2j)
        cD_H[:] = [x / math.sqrt(2**hif) for x in cD_H]
        cD_L[:] = [x / math.sqrt(2**lof) for x in cD_L]

        # Obtain the LH:HF ratio
        cD_LH = cD_L
        for i in range(len(cD_L)):
            cD_LH[i] = cD_L[i] / cD_H[int(((2**lof)/(2**hif)))*i]

        # Detect modulus maxima
        cD_LHm = self.modmax(cD_LH)

        # Threshold using universal threshold lambda_univ = σˆsqrt(2logn)
        # where σˆ is the standard deviation of the noise
        lambda_univ = np.std(cD_LHm) * math.sqrt(2.0 * np.log2(len(cD_LHm)))
        cD_LHt = pywt.threshold(cD_LHm, lambda_univ, mode="less")

        # Get signal duration (in seconds)
        tt = end_time - init_time

        # Compute LHIPA
        ctr = 0
        for i in range(len(cD_LHt)):
            if math.fabs(cD_LHt[i]) > 0:
                ctr += 1
        LHIPA = float(ctr)/tt

        return LHIPA

    # From Duchowski, A. T., Krejtz, K., Krejtz, I., Biele, C., Niedzielska, A., Kiefer, P., . . . Giannopoulos, I.  (2018). The Index of Pupillary Activity: Measuring Cognitive Load vis-à-vis Task Difficulty with Pupil Oscillation.
    def modmax(self, d):
        # Compute signal modulus
        m = [0.0]*len(d)
        for i in range(len(d)):
            m[i] = math.fabs(d[i])

        # If value is larger than both neighbours, and strictly
        # larger than either, then it is a local maximum
        t = [0.0]*len(d)
        for i in range(len(d)):
            ll = m[i - 1] if i >= 1 else m[i]
            oo = m[i]
            rr = m[i+1] if i < len(d)-2 else m[i]
            if (ll <= oo and oo >= rr) and (ll < oo or oo > rr):
                # Compute magnitude
                t[i] = math.sqrt(d[i]**2)
            else:
                t[i] = 0.0

        return t
