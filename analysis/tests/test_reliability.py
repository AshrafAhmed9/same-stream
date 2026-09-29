"""
Cross-checks the `krippendorff` Python package against the same worked
example used in src/lib/krippendorff.test.ts, so the JS results page and
the Python analysis script can never silently disagree.
"""
import numpy as np
import krippendorff


def test_matches_krippendorff_2011_worked_example():
    # Krippendorff (2011), "Computing Krippendorff's Alpha-Reliability",
    # Table 1. Same data as src/lib/krippendorff.test.ts.
    data = [
        [1, 2, 3, 3, 2, 1, 4, 1, 2, np.nan, np.nan, np.nan],
        [1, 2, 3, 3, 2, 2, 4, 1, 2, 5, np.nan, 3],
        [np.nan, 3, 3, 3, 2, 3, 4, 2, 2, 5, 1, np.nan],
        [1, 2, 3, 3, 2, 4, 4, 1, 2, 5, 1, np.nan],
    ]
    alpha = krippendorff.alpha(reliability_data=data, level_of_measurement="nominal")
    assert round(alpha, 3) == 0.743


def test_perfect_agreement_is_one():
    data = [["X", "Y", "X", "Y"], ["X", "Y", "X", "Y"]]
    alpha = krippendorff.alpha(reliability_data=data, level_of_measurement="nominal")
    assert round(alpha, 6) == 1.0
