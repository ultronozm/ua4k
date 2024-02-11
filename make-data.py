import json

file = open("game.txt", "r")
lines = file.readlines()
file.close()

boards = []
rules = {}

temp_board = []
temp_rule_from = []
temp_rule_to = []
current_rule = None

for line in lines:
    if line.strip() == "":
        if len(temp_board) > 0:
            boards.append(temp_board)
            temp_board = []
        if len(temp_rule_from) > 0:
            rules[current_rule].append([temp_rule_from, temp_rule_to])
            temp_rule_from = []
            temp_rule_to = []
        continue
    if line.strip().startswith("BIND"):
        current_rule = line.strip().split()[1]
        if current_rule not in rules:
            rules[current_rule] = []
        continue
    if current_rule in rules.keys():
        temp_rule_from.append(line.strip().split()[0])
        temp_rule_to.append(line.strip().split()[1])
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
        
result = {'boards': boards, 'rules_dict': rules}

with open('data.js', 'w') as json_file:
    json_file.write("let jsonData = ")
    json.dump(result, json_file)
    json_file.write(";")
