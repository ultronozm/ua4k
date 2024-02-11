import json
import sys

filename = sys.argv[1]
file = open(filename, "r")
lines = file.readlines()
file.close()

boards = []
rules = {}
docs = {}
goals = []
voids = []

temp_board = []
temp_rule_from = []
temp_rule_to = []
temp_goal = None
temp_void = None
side_effect = None
current_rule = None

for line in lines:
    if line.strip() == "":
        if len(temp_board) > 0:
            boards.append(temp_board)
            temp_board = []
        if len(temp_rule_from) > 0:
            rules[current_rule].append([temp_rule_from, temp_rule_to, side_effect])
            temp_rule_from = []
            temp_rule_to = []
            side_effect = None
        if temp_goal is not None and len(temp_goal) > 0:
            goals.append(temp_goal)
            temp_goal = None
        if temp_void is not None and len(temp_void) > 0:
            voids.append(temp_void)
            temp_void = None
        continue
    if line.strip().startswith("GOAL"):
        temp_goal = []
        continue
    if line.strip().startswith("VOID"):
        temp_void = []
        continue
    if line.strip().startswith("BIND"):
        split_line = line.strip().split()
        current_rule = split_line[1]
        if current_rule not in rules:
            rules[current_rule] = []
            if len(split_line) > 2:
                docs[current_rule] = split_line[2]
        else:
            print("Rule already exists")
        continue
    # we're reading the line of a pattern
    if temp_goal is not None:
        temp_goal.append(line.strip())
        continue
    if temp_void is not None:
        temp_void.append(line.strip())
        continue
    if current_rule in rules.keys():
        split_line = line.strip().split()
        temp_rule_from.append(split_line[0])
        temp_rule_to.append(split_line[1])
        if len(split_line) > 2:
            side_effect = split_line[2]
    else:
        temp_board.append(line.strip())

if len(temp_board) > 0:
    boards.append(temp_board)
    temp_board = []
if len(temp_rule_from) > 0:
    rules[current_rule].append([temp_rule_from, temp_rule_to])
    temp_rule_from = []
    temp_rule_to = []
        
result = {'boards': boards, 'rules_dict': rules, 'docs': docs, 'goals': goals, 'voids': voids}

try:
    with open('gamesData.js', 'r') as json_file:
        data = json_file.read()[(len("let gamesData = ")):].strip()
        data = data[:-1]
        data = json.loads(data)
except:
    data = {}
    print("data read failed")

data[filename.split('.')[0]] = result

with open('gamesData.js', 'w') as json_file:
    json_file.write("let gamesData = ")
    # json.dump(data, json_file, indent=4)
    json.dump(data, json_file)
    json_file.write(";")
