import pandas as pd
# Below thing is suppresing warnings made by pandas for the DataFrame we are working for
pd.options.mode.chained_assignment = None
from datetime import datetime
import math
from functools import reduce
from datetime import timedelta
from flask import jsonify

def CompressionFunction(currentTime, PriorSelections, FixedSelections):

    dataframe = pd.read_excel('C:/Users/Dell/Desktop/Rescheduler/Backend/PythonCode/Schedule.xlsx')

    Work = dataframe['Work']
    Start = dataframe['Start']
    End = dataframe['End']

    Work_List = list(Work)
    Start_List = list(Start)
    End_List = list(End)

    print("What is the time, where you want the change?[In HH:MM]")
    print("Example Time:   4/11/23 10:00:00")
    inp_time = currentTime
    cur_time = datetime.strptime(inp_time, "%d/%m/%y %H:%M:%S")

    print("Which past things, you want ahead according to number?")
    print(Work)
    Input_Prev_Work = PriorSelections
    Prev_Work = Input_Prev_Work.split(",")[:]
    print("So you want", list(Work[int(x)] for x in (Prev_Work)))
    Prev_Work_List = list(Work[int(x)] for x in (Prev_Work))
    Complete_Fragments = Prev_Work_List[:]

    print("So what will be the pinned times in Schedule")
    print(Work)
    Input_Pin_Work = FixedSelections
    Pinned_Work = Input_Pin_Work.split(",")[:]
    Pinned_Work_List = list(Work[int(x)] for x in (Pinned_Work))
    Pinned_Work_StartTiming = list(Start[int(x)] for x in (Pinned_Work))
    Pinned_Work_EndTiming = list(End[int(x)] for x in (Pinned_Work))

    # print("So your Pinned Works are", Pinned_Work_List)
    # print("So your Pinned Works timing are", Pinned_Work_StartTiming)

    # Ensures that the Time_Duration on which the cur_time falls get automatically chosen and get compressed in the schedule.
    boolean_list = []
    for i in range (0, len(Start_List)):
        if (cur_time >= Start_List[i] and cur_time < End_List[i]):
            boolean_list.append("True")
        else: 
            boolean_list.append("False")

    Fragment_Dictionary = {}
    Fragment_Dictionary.update({"Fragment_" + str(1) : Prev_Work_List + list(Work[boolean_list.index("True"): int(Pinned_Work[0])])})

    for i in range(0, len(Pinned_Work_List)-1):
        Fragment_Dictionary.update({"Fragment_" + str(i+2) : list(Work[int(Pinned_Work[i])+1 : int(Pinned_Work[i+1])])})
    print(Fragment_Dictionary)
    print("\n")
    # Output: {'Fragment_1': ['Work 1', 'Work 2', 'Work 2 Break', 'Work 3', 'Work 3 Break', 'Work 4', 'Work 4 Break'], 'Fragment_2': ['Sona', 'Work 5', 'Work 5 Break'], 'Fragment_3': ['Work 6', 'Free 1'], 'Fragment_4': ['Free 2']}

    Nested_Fragments_List = []
    for i in Fragment_Dictionary:
        Nested_Fragments_List.append(Fragment_Dictionary[i])
    print("Nested_Fragments_List: ", Nested_Fragments_List)
    print("\n")
    # Output: [['Work 1', 'Work 2', 'Work 2 Break', 'Work 3', 'Work 3 Break', 'Work 4', 'Work 4 Break'], ['Sona', 'Work 5', 'Work 5 Break'], ['Work 6', 'Free 1'], ['Free 2']]

    Complete_Fragments = [item for sublist in Nested_Fragments_List for item in sublist]
    print("Complete Fragments: ", Complete_Fragments)
    print("\n")

    LenTills_Addition = 0
    LenTills_Dictionary = {}
    LenTills_List = []
    for i in range(0, len(Nested_Fragments_List)):
        LenTills_Addition += len(Nested_Fragments_List[i])
        LenTills_Dictionary.update({"LenTillPin" + str(i+1) : LenTills_Addition})
        LenTills_List.append(LenTills_Addition)
    print("LenTills_Dictionary: ", LenTills_Dictionary)
    print("\n")
    # Output: {'LenTillPin1': 7, 'LenTillPin2': 10, 'LenTillPin3': 12, 'LenTillPin4': 13}
    print("LenTills_List: ", LenTills_List)
    # Output: [7, 10, 12, 13]
    print("\n")

    LenBtwPins_Dictionary = {}
    for i in range(0, len(Nested_Fragments_List)):
        LenBtwPins_Dictionary.update({"LenBtwPin" + str(i+1) : len(Nested_Fragments_List[i])})
    print("LenBtwPins_Dictionary: ", LenBtwPins_Dictionary)
    print("\n")
    # Output: {'LenBtwPin1': 7, 'LenBtwPin2': 3, 'LenBtwPin3': 2, 'LenBtwPin4': 1}

    Fragment_Dur_Dict = {}
    Fragment_Dur_Dict.update({"Fragment_" + str(1) + "_Duration" : Pinned_Work_StartTiming[0] - cur_time})

    for i in range(0, len(Pinned_Work_List)-1):
        Fragment_Dur_Dict.update({"Fragment_" + str(i+2) + "_Duration" : Pinned_Work_StartTiming[i+1] - Pinned_Work_EndTiming[i]})
    print("Fragment_Dur_Dict: ",Fragment_Dur_Dict)
    print("\n")
    # Output: {'Fragment_1_Duration': Timedelta('0 days 03:00:00'), 'Fragment_2_Duration': Timedelta('0 days 03:00:00'), 'Fragment_3_Duration': Timedelta('0 days 04:00:00'), 'Fragment_4_Duration': Timedelta('0 days 01:30:00')}

    Total_Fragment_Duration = timedelta(0)
    for i in Fragment_Dur_Dict:
        Total_Fragment_Duration += Fragment_Dur_Dict[i]
    print("Total_Fragment_Duration(Total Time Left): ", Total_Fragment_Duration)
    print("\n")
    # Output: 0 days 11:30:00

    # #Finding the ratios
    Time_Interval_List = []
    Time_Interval_List_Ratio = []

    for i in range(0, len(Start)-1):
        Time_Interval = Start[i+1] - Start[i]
        Time_Interval_List.append(int(Time_Interval.total_seconds() / 60))
    print("Time Interval List: ", Time_Interval_List)
    # Output: [60, 60, 60,..]
    print("\n")

    # # Here reduce plays role of iteration(ek ek karke dena because there is a whole list present)
    Hcf = reduce(math.gcd, Time_Interval_List)
    for i in Time_Interval_List:
        Ratio = i/Hcf
        Time_Interval_List_Ratio.append(int(Ratio))
    print("Time Interval List Ratio: ", Time_Interval_List_Ratio)
    # Output: [4, 4, 4,..]
    print("\n")

    # Complete_Fragments_Index vo saare kaam ka index hai jo ki left out hai karne ko
    Complete_Fragments_Index = []
    List_Work = list(Work)
    for i in Complete_Fragments:
        Complete_Fragments_Index.append(List_Work.index(i))
    print("Complete Fragments Index: ",Complete_Fragments_Index)
    # Output: [2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15, 16, 18]
    print("\n")

    # Required_Ratio_List tells vo left out kaam jinka ratio jaanna hai, naki sabka.
    Required_Ratio_List = []
    for i in Complete_Fragments_Index:
        Required_Ratio_List.append(Time_Interval_List_Ratio[i])
    print("Required Ratio List: ", Required_Ratio_List)
    # Output: [4,4,1..]
    print("\n")

    # Finding the sum of ratios
    Sum_Of_Ratios = 0
    for i in Required_Ratio_List:
        Sum_Of_Ratios += i
    print("Sum Of Ratios: ", Sum_Of_Ratios)
    print("\n")
    # Output: 54

    # Duration_According_Ratio tells what time should be given to each work according to ratio so that it get completed
    #  on time
    Duration_According_Ratio = []
    for i in Required_Ratio_List:
        Duration_According_Ratio.append(round(i/Sum_Of_Ratios * (Total_Fragment_Duration.total_seconds() / 60)))
    print("Duration According Ratio: ",Duration_According_Ratio)
    print("\n")
    # # Output: [51, 51, 26...]

    # Sum_Dur_Acc_Rat is the sum of Duration_According_Ratio
    Sum_Dur_Acc_Rat = 0
    for i in Duration_According_Ratio:
        Sum_Dur_Acc_Rat += i
    print("Sum_Dur_Acc_Rat: ", Sum_Dur_Acc_Rat, "minutes")
    print("\n")
    # # Output: 691

    # This part of code will ensure that the Sum of Ratios would not cross the line or say the "Proposed Left Time" or "Total Fragment Duration"
    if (Sum_Dur_Acc_Rat > (Total_Fragment_Duration.total_seconds() / 60)):
        Difference = int(Sum_Dur_Acc_Rat - (Total_Fragment_Duration.total_seconds() / 60))
        Duration_According_Ratio[-1] -= Difference

    # Creating a new DataFrame for Ratio Compressed Output
    TimeDelta_Minutes = []
    for i in range(0, len(Duration_According_Ratio)):
        TimeDelta_Minutes.append(timedelta(minutes=int(Duration_According_Ratio[i])))
    # print("TimeDelta_Minutes: ",TimeDelta_Minutes)
    # Output: [datetime.timedelta(seconds=3060), datetime.timedelta(seconds=3060),...]

    # Adding The Starting Time
    Compressed_Data = [[cur_time, cur_time + TimeDelta_Minutes[0], Prev_Work_List[0]]]  

    # Adding The Pinned Times
    for i in range(0, len(Pinned_Work_List)):  
        Compressed_Data.append([Pinned_Work_StartTiming[i], Pinned_Work_EndTiming[i], Pinned_Work_List[i]])

    # Making the DataFrame
    Compressed_DataFrame = pd.DataFrame(Compressed_Data, columns=['Start_', 'End_', 'Work_'])

    # Pinned_Timing_Reached Indicates till how many pinned timings have we compressed the schedule.
    Pinned_Timing_Reached = 0

    # New_Data_Created counts the newData which gets created by disintegrating a data in parts becasue of Pinned Timing overlapping.
    New_Data_Created = 0

    # Updated_Complete_Fragments is an updated list of Complete_Fragments list covering the changes made in the DataFrame including Pinned_Timings, new Timings and New_Data_Created which is also applicable for Updated_Dur_Acc_Rat and Updated_TimeDel_Min
    Updated_Complete_Fragments = Complete_Fragments[:]
    Updated_Dur_Acc_Rat = Duration_According_Ratio[:]

    Updated_LenTills_Dictionary = {}
    Updated_LenTills_List = []

    for i in range(0, len(Nested_Fragments_List)):
        Updated_LenTills_Dictionary.update({"Updated_LenTillPin" + str(i+1) : 0})
    print("Updated_LenTills_Dictionary: ", Updated_LenTills_Dictionary)
    # Output: {'Updated_LenTillPin1': 0, 'Updated_LenTillPin2': 0, 'Updated_LenTillPin3': 0, 'Updated_LenTillPin4': 0}
    print("\n")

    # Below is function which updates the Updated_LenTills_List when Updated_LenTills_Dictionary gets updated
    def updateLenTillsList(Updated_LenTills_Dictionary, Updated_LenTills_List):
        Updated_LenTills_List.clear()
        for i in Updated_LenTills_Dictionary.values():
            Updated_LenTills_List.append(i)
        
    updateLenTillsList(Updated_LenTills_Dictionary, Updated_LenTills_List)
    print("Updated_LenTills_List: ", Updated_LenTills_List)
    # Output: [0, 0, 0, 0]
    print("\n")

    LenBtwUpdatedPins_Dic = {}
    previous_value = None
    differences = {}
    for key, value in Updated_LenTills_Dictionary.items():
        if previous_value is not None:
            difference = value - previous_value
            differences[key] = difference
        previous_value = value

    newDuration = []
    Loop_Dataframe = []

    # print("\n")
    # print("Below is Raw Compressed Dataframe: ")
    # print(Compressed_DataFrame)

    for key1, key2, btwKey, LenKey in zip(LenTills_Dictionary.keys(), Updated_LenTills_Dictionary.keys(), LenBtwPins_Dictionary.keys(), range(0, len(Updated_LenTills_List))):
        
        # Adding the timings between Pinned_Timing 1 in a very wise way. Understand it Carefully. Thanks ChatGPT
        # We have used such type of range to cover the portion between start and First Pinned_work.
        if (len(Updated_Complete_Fragments) == len(Complete_Fragments)):
            for i in range(1, LenTills_Dictionary[key1]):
                newData = [[Compressed_DataFrame.End_[i-1], Compressed_DataFrame.End_[i-1] + TimeDelta_Minutes[i], Complete_Fragments[i]]]
                upper_part = Compressed_DataFrame.loc[:i - 1]
                lower_part = Compressed_DataFrame.loc[i:]
                Compressed_DataFrame = pd.concat([upper_part, pd.DataFrame(newData, columns=['Start_', 'End_', 'Work_'], index=[i]), lower_part], ignore_index=True)
        else:
            for i in range(Updated_LenTills_List[LenKey-1], LenTills_List[LenKey] + Pinned_Timing_Reached + New_Data_Created):
                newData = [[Compressed_DataFrame.End_[i-1], Compressed_DataFrame.End_[i-1] + Updated_TimDel_Min[i], Updated_Complete_Fragments[i]]]
                upper_part = Compressed_DataFrame.loc[:i - 1]
                lower_part = Compressed_DataFrame.loc[i:]
                Compressed_DataFrame = pd.concat([upper_part, pd.DataFrame(newData, columns=['Start_', 'End_', 'Work_'], index=[i]), lower_part], ignore_index=True)


        #Sorting the rows on the basis of 'Start_' column with respect to time and resetting the index of dataframe.
        Compressed_DataFrame = Compressed_DataFrame.sort_values(by='Start_').reset_index(drop=True)
        # print("\n")
        # print("Below is Compressed Data without any Structured Editing: ")
        # print(Compressed_DataFrame)

        # Rearranging the dataframe till Pinned Timing 1 to make the timings continous in nature rather than broken apart.
        # We have used j for loop so to add those Pinned Time Diff without disturbing the break used in i's for loop.
        for i in range(0, LenTills_Dictionary[key1] + Pinned_Timing_Reached + New_Data_Created): 
            if(Compressed_DataFrame.End_[i] > Compressed_DataFrame.Start_[i+1]):
                Pinned_Time_Diff = Compressed_DataFrame.End_[i+1] - Compressed_DataFrame.Start_[i+1]
                Intersec_Diff = Compressed_DataFrame.End_[i] - Compressed_DataFrame.Start_[i+1]
                Compressed_DataFrame.End_[i] -= Intersec_Diff
                for j in range(0, len(Compressed_DataFrame['Start_'])-1):
                    if(Compressed_DataFrame.End_[j] > Compressed_DataFrame.Start_[j+1]):
                        Compressed_DataFrame.Start_[j+1] += Pinned_Time_Diff
                        Compressed_DataFrame.End_[j+1] += Pinned_Time_Diff
                        # Making a broken and adjusted copy of a work(Work 5) which was colliding with Pinned Work 2
                newData = [[Compressed_DataFrame.End_[i+1], Compressed_DataFrame.End_[i+1] + Intersec_Diff, Compressed_DataFrame.Work_[i]]]
                upper_part = Compressed_DataFrame.loc[:i + 1]
                lower_part = Compressed_DataFrame.loc[i + 2:]
                Compressed_DataFrame = pd.concat([upper_part, pd.DataFrame(newData, columns=['Start_', 'End_', 'Work_']), lower_part], ignore_index=True)
                New_Data_Created += 1
                break


        if (len(Updated_Complete_Fragments) == len(Complete_Fragments)):
            # print("\n")
            print("Structured Code: ", "(", LenKey, ")")
            print(Compressed_DataFrame)
            print("\n")
            # print("len(Updated_Complete_Fragments) == len(Complete_Fragments)")
            Pinned_Timing_Reached += 1
            Updated_LenTills_Dictionary[key2] = LenTills_Dictionary[key1] + Pinned_Timing_Reached + New_Data_Created

            updateLenTillsList(Updated_LenTills_Dictionary, Updated_LenTills_List)

            # print("Updated_Fragments for debugging: ", Updated_Complete_Fragments[0: LenTills_Dictionary[key1]])
            Updated_Complete_Fragments[0: LenTills_Dictionary[key1]] = Compressed_DataFrame.Work_[0: LenTills_Dictionary[key1] + Pinned_Timing_Reached + New_Data_Created]

            # print("Updated_LenTills_Dictionary[key2]: ", Updated_LenTills_Dictionary[key2])
            # print("LenBtwPins_Dictionary[btwKey]: ", LenBtwPins_Dictionary[btwKey])
            print("Updated_LenTills_List: ", Updated_LenTills_List)
            print("Updated Complete Fragments: ", Updated_Complete_Fragments)
            # Output: ['Work 1', 'Work 2', 'Work 2 Break',..]
            print('\n')

            for i in range(0, Updated_LenTills_Dictionary[key2]):
                newDuration.append(int((Compressed_DataFrame.End_[i] - Compressed_DataFrame.Start_[i]).total_seconds()/60))
            Updated_Dur_Acc_Rat[0: LenTills_Dictionary[key1]] = newDuration[0: LenTills_Dictionary[key1] + Pinned_Timing_Reached + New_Data_Created]
            print("Updated_Dur_Acc_Rat: ", Updated_Dur_Acc_Rat)
            # Output: [51, 51, 13,...]
            print("\n")

            # Updated_TimeDel_Min is the updated version of TimeDelta_Minutes accompanying the change made in dataframe.
            Updated_TimDel_Min = []
            for i in range(0, len(Updated_Dur_Acc_Rat)):
                Updated_TimDel_Min.append(timedelta(minutes=int(Updated_Dur_Acc_Rat[i])))
            # print("Updated_TimeDel_Min: ", Updated_TimDel_Min)
            # Output: [datetime.timedelta(seconds=3060), datetime.timedelta(seconds=3060),..]
            print("\n")
        else:
            # print("\n")
            print("Structured Code: ", "(", LenKey, ")")
            print(Compressed_DataFrame)
            print("\n")
            # print("len(Updated_Complete_Fragments) != len(Complete_Fragments)")
            Pinned_Timing_Reached += 1
            Updated_LenTills_Dictionary[key2] = LenTills_Dictionary[key1] + Pinned_Timing_Reached + New_Data_Created

            updateLenTillsList(Updated_LenTills_Dictionary, Updated_LenTills_List)

            # print("Updated_Fragments for debugging: ", Updated_Complete_Fragments[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey-1] + LenBtwPins_Dictionary[btwKey]])

            # print("Second Updated_Fragments for debugging: ", Compressed_DataFrame.Work_[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey]])

            Updated_Complete_Fragments[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey-1] + LenBtwPins_Dictionary[btwKey]] = Compressed_DataFrame.Work_[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey]]

            print("Updated_LenTills_List: ", Updated_LenTills_List)
            print("Updated Complete Fragments: ", Updated_Complete_Fragments)

            # print("LenKey: ", LenKey)
            # print("LenBtwPins_Dictionary[btwKey]: ", LenBtwPins_Dictionary[btwKey])
            # print("Updated LenTills Dictionary: ", Updated_LenTills_Dictionary)
            # print("Updated Complete Fragments: ", Updated_Complete_Fragments)
            # Output: ['Work 1', 'Work 2', 'Work 2 Break',..]
            print('\n')

            for i in range(Updated_LenTills_List[LenKey-1], Updated_LenTills_List[LenKey]):
                newDuration.append(int((Compressed_DataFrame.End_[i] - Compressed_DataFrame.Start_[i]).total_seconds()/60))
            Updated_Dur_Acc_Rat[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey-1] + LenBtwPins_Dictionary[btwKey]] = newDuration[Updated_LenTills_List[LenKey-1]: Updated_LenTills_List[LenKey]]
            print("Updated_Dur_Acc_Rat: ", Updated_Dur_Acc_Rat)
            # Output: [51, 51, 13,...]
            # print("Len of Updated_Dur_Acc_Rat: ", len(Updated_Dur_Acc_Rat))
            print("\n")

            # Updated_TimeDel_Min is the updated version of TimeDelta_Minutes accompanying the change made in dataframe.
            Updated_TimDel_Min = []
            for i in range(0, len(Updated_Dur_Acc_Rat)):
                Updated_TimDel_Min.append(timedelta(minutes=int(Updated_Dur_Acc_Rat[i])))
            # print("Updated_TimeDel_Min: ", Updated_TimDel_Min)
            # Output: [datetime.timedelta(seconds=3060), datetime.timedelta(seconds=3060),..]
            # print("Len of Updated_TimeDel_Min: ", len(Updated_TimDel_Min))
            print("\n")

    # print(Compressed_DataFrame)
    Start_Timing = []
    End_Timing = []
    Start_Angle = []
    End_Angle = []

    for i in range(len(Compressed_DataFrame["Start_"])):
        Start_Timing.append((str(Compressed_DataFrame["Start_"][i]).split(" ")[1])[:5])
        End_Timing.append((str(Compressed_DataFrame["End_"][i]).split(" ")[1])[:5])

    for i in range(0, len(Start_Timing)):
        Start_Hour = int(Start_Timing[i].split(":")[0])
        Start_Min = int(Start_Timing[i].split(":")[1])
        End_Hour = int(End_Timing[i].split(":")[0])
        End_Min = int(End_Timing[i].split(":")[1])
        Start_Angle.append(30*Start_Hour + 0.5*Start_Min)
        End_Angle.append(30*End_Hour + 0.5*End_Min)

    DataFrame_Dict = {
        "Start_Angle": Start_Angle,
        "End_Angle": End_Angle,
        "Start_Timing": Start_Timing,
        "End_Timing": End_Timing,
        "Work": Updated_Complete_Fragments,
        "Durations": Updated_Dur_Acc_Rat
    }

    return DataFrame_Dict









