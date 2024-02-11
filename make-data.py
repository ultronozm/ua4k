import json

file = open("game.txt", "r")
lines = file.readlines()
file.close()

boards = []
rules = {}
docs = {}

temp_board = []
temp_rule_from = []
temp_rule_to = []
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
    if current_rule in rules.keys():
        split_line = line.strip().split()
        temp_rule_from.append(split_line[0])
        temp_rule_to.append(split_line[1])
        if len(split_line) > 2:
            side_effect = split_line[2]
    else:
        temp_board.append(line.strip())

if len(temp_board) > 0:
    # Add board to boards
    boards.append(temp_board)
    temp_board = []
if len(temp_rule_from) > 0:
    rules[current_rule].append([temp_rule_from, temp_rule_to])
    temp_rule_from = []
    temp_rule_to = []
        
result = {'boards': boards, 'rules_dict': rules, 'docs': docs}

with open('data.js', 'w') as json_file:
    json_file.write("let jsonData = ")
    json.dump(result, json_file)
    json_file.write(";")
