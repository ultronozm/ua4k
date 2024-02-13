import json
import sys
import itertools

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
temp_goal = None
temp_void = None

wildcards_stack = []
temp_rule_from = []
temp_rule_to = []
side_effect = None
current_rule = None

def wildcard_assignments():
    # For every pair generate all possible combinations of the characters in the second element for each character in the first
    lst = wildcards_stack
    combinations = [list(itertools.product(pair[1], repeat=len(pair[0]))) for pair in lst]
    # Combine these combinations
    combined = list(itertools.product(*combinations))
    dicts = []
    for combination in combined:
        d = {}
        for pair, assignment in zip(lst, combination):
            for key, value in zip(pair[0], assignment):
                d[key] = value
        dicts.append(d)
    return tuple(dicts)


for line in lines:
    if line.strip() == "":
        if len(temp_board) > 0:
            boards.append(temp_board)
            temp_board = []
        if len(temp_rule_from) > 0:
            for wildcard_assignment in wildcard_assignments():
                trans_table = str.maketrans(wildcard_assignment)
                rule_from = [s.translate(trans_table) for s in temp_rule_from]
                rule_to = [s.translate(trans_table) for s in temp_rule_to]
                rules[current_rule].append([rule_from, rule_to, side_effect])
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
    if line.strip().startswith("FOR"):
        split_line = line.strip().split()
        wildcards_stack.append((split_line[1], split_line[2]))
        continue
    if line.strip().startswith("END_FOR"):
        wildcards_stack.pop()
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
        temp_rule_to.append(split_line[1] if len(split_line) > 1 else split_line[0])
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
