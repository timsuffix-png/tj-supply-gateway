#!/usr/bin/env python3
import sys
import random
import time

t = sys.argv[1] if len(sys.argv) > 1 else "PWRLK"
r = random.randint(1, 100)

if t == "DCIR":
    sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_DCIR, 0, 0, SSSVAL_HAL_TSTART_NONE, 250, 10, 50, 20, 0, 500, 0, 0)\nInterim ACK : data size 9  :  Command Received, 0.0S, 0, 0.000000\nInterim ACK : data size 9  :  Hold phase, 1.0S, 251, 500.000000\nInterim ACK : data size 9  :  Hold phase, 2.0S, 255, 500.000000\nInterim ACK : data size 9  :  Hold phase, 3.0S, 245, 500.000000\nInterim ACK : data size 9  :  Hold phase, 4.0S, 254, 500.000000\nInterim ACK : data size 9  :  Hold phase, 5.0S, 248, 500.000000\nInterim ACK : data size 9  :  Ramping to zero, 6.0S, 250, 500.000000\nACK : data size 9  :  Passed, 8.5S, 254, 500.000000\n\n\n")

elif t == "EBOND":
    if r >= 20:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_EBOND_50, 0, 0, SSSVAL_HAL_TSTART_NONE, 7000, 0, 40, 20, 0, 1500, 0, 0)\nInterim ACK : data size 9  :  Command Received, 0.0S, 0, 0.000000\nInterim ACK : data size 9  :  Hold phase, 0.0S, 1255, 204.000000\nInterim ACK : data size 9  :  Hold phase, 1.0S, 7081, 84.000000\nInterim ACK : data size 9  :  Hold phase, 2.0S, 6882, 86.000000\nInterim ACK : data size 9  :  Hold phase, 3.0S, 7039, 84.000000\nInterim ACK : data size 9  :  Ramping to zero, 4.0S, 7005, 85.000000\nACK : data size 9  :  Passed, 6.0S, 6935, 87.000000\n\n\n")
    else:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_EBOND_50, 0, 0, SSSVAL_HAL_TSTART_NONE, 7000, 0, 40, 20, 0, 1500, 0, 0)\nInterim ACK : data size 9  :  Command Received, 0.0S, 0, 0.000000\nInterim ACK : data size 9  :  Hold phase, 0.0S, 0, 9999.000000\nInterim ACK : data size 9  :  Hold phase, 0.5S, 0, 9999.000000\nInterim ACK : data size 9  :  Hold phase, 0.9S, 0, 9999.000000\nACK : data size 9  :  Failed: result is above upper limit, 1.0S, 0, 9999.000000\n\n\n")

elif t == "HIPOT":
    if r >= 20:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_HIPOT_50, 0, 0, SSSVAL_HAL_TSTART_NONE, 2500, 10, 50, 10, 0, 20, 0, 1)\nInterim ACK : data size 9  :  Command Received, 0.0S, 0, 0.000000\nInterim ACK : data size 9  :  Ramping to target, 0.5S, 1297, 0.070000\nInterim ACK : data size 9  :  Hold phase, 1.0S, 2498, 0.140000\nInterim ACK : data size 9  :  Hold phase, 3.0S, 2497, 0.140000\nInterim ACK : data size 9  :  Hold phase, 5.0S, 2498, 0.140000\nInterim ACK : data size 9  :  Ramping to zero, 6.0S, 2502, 0.140000\nACK : data size 9  :  Passed, 7.0S, 2499, 0.140000\n\n\n")
    else:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_HIPOT_50, 0, 0, SSSVAL_HAL_TSTART_NONE, 2500, 10, 50, 10, 0, 20, 0, 1)\nInterim ACK : data size 9  :  Command Received, 0.0S, 0, 0.000000\nInterim ACK : data size 9  :  Ramping to target, 0.5S, 1300, 0.230000\nInterim ACK : data size 9  :  Hold phase, 1.0S, 2500, 0.450000\nACK : data size 9  :  Aborted: over-current detected, 1.9S, 2499, 0.440000\n\n\n")

else:  # PWRLK
    if r >= 20:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_PWRLK, 0, 0, SSSVAL_HAL_TSTART_NONE, 0, 0, 30, 0, 0, 20, 0, 0, 0, 13, 0, 1)\nInterim ACK : data size 17  :  Command Received, 0.0S, 0, 0.000000, 0.000000, 0.000000\nInterim ACK : data size 17  :  Hold phase, 1.0S, 225, 0.090000, 0.008000, 0.525000\nInterim ACK : data size 17  :  Hold phase, 2.0S, 225, 0.090000, 0.008000, 0.538000\nACK : data size 17  :  Passed, 3.0S, 224, 0.090000, 0.008000, 0.520000\n\n\n")
    else:
        sys.stdout.write("Sending session start command using COM7 at 9600 baud\nSession established - PC and tester are communicating using 9600 baud\n\n>>SSSCMD_HAL_PERFORM_TEST(SSSID_HAL_TEST_TYPE_PWRLK, 0, 0, SSSVAL_HAL_TSTART_NONE, 0, 0, 30, 0, 0, 20, 0, 0, 0, 13, 0, 1)\nInterim ACK : data size 17  :  Command Received, 0.0S, 0, 0.000000, 0.000000, 0.000000\nInterim ACK : data size 17  :  Waiting for start, 0.0S, 0, 0.000000, 0.000000, 0.000000\nACK : data size 17  :  Aborted: abort key was pressed, 0.0S, 0, 0.000000, 0.000000, 0.000000\n\n\n")

time.sleep(0.5)
