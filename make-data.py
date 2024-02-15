import json
import sys
import itertools
import copy
import pdb

filename = sys.argv[1]
file = open(filename, "r")
lines = file.readlines()
file.close()

# A rule is either a simple rule (given by a triple (fromPattern, toPattern, sideEffect)) or a compound rule (given by a type and a list of rules, which may themselves be simple or compound).

boards = []
rules = {} # dict mapping names to rules
binds = {}
goals = []
voids = []

temp_board = []
temp_goal = None
temp_void = None

wildcards_stack = []
side_effect = None
temp_rule_from = []
temp_rule_to = []

rules_stack = []
indent_stack = []

def wildcard_assignments(wildcards_dict):
    # generate all possible assignments of wildcards
    # wildcards_dict is a dictionary mapping wildcard names to lists of possible values
    # returns a list of dictionaries mapping wildcard names to values
    wd = wildcards_dict
    combined = list(itertools.product(*[list(itertools.product(wd[k], repeat=1)) for k in wd]))
    dicts = []
    for combination in combined:
        temp = {}
        for key, value in zip(wd, combination):
            temp[key] = value[0]
        dicts.append(temp)
    return tuple(dicts)

def subs (s, assn):
    # s is a string
    # assn is a dictionary mapping wildcard names to values
    # returns a new string with all wildcards replaced by
    # their values
    return s.translate(str.maketrans(assn))
    

def deep_subs(r, assn):
    # r is a rule
    # assn is a dictionary mapping wildcard names to values
    # modify so that all wildcards are replaced by their values
    trans_table = str.maketrans(assn)
    if r['type'] == 'simple':
        r['from'] = [s.translate(trans_table) for s in r['from']]
        r['to'] = [s.translate(trans_table) for s in r['to']]
    elif r['type'] in ['atomic', 'match1', 'cmd']:
        for i in range(len(r['rules'])):
            deep_subs(r['rules'][i], assn)
    else:
        print("Error: unknown rule type")
        assert False


def add_rule(rule):
    # print("add_rule: ", rule)
    # print("length of rules_stack: ", len(rules_stack))
    if len(rules_stack) > 0:
        rules_stack[-1]['rules'].append(rule)
    else:
        name = rule['name']
        rules[name]['rules'].extend(rule['rules'])
            
def process_rule_stack_to_level(level):
    # print("process_rule_stack_to_level: ", level)
    while len(indent_stack) > 0 and indent_stack[-1] >= level:
        indent_stack.pop()
        rule = rules_stack.pop()
        # print("  rule: ", rule)
        match rule['type']:
            case 'simple':
                add_rule(rule)
            case 'atomic':
                add_rule(rule)
            case 'match1':
                add_rule(rule)
            case 'cmd':
                add_rule(rule)
            case 'for':
                wildcards_dict = rule['wildcards_dict']
                # print("wildcards_dict: ", wildcards_dict)
                # print("rule['rules']: ", rule['rules'])
                for r in rule['rules']:
                    # print("r in rule['rules']:", r)
                    for assn in wildcard_assignments(wildcards_dict):
                        # print("assn: ", assn)
                        # deep copy of r
                        modified_r = copy.deepcopy(r)
                        # print("r: ", r)
                        deep_subs(modified_r, assn)
                        # print("calling add_rule with modified_r:", modified_r)
                        add_rule(modified_r)
            case _:
                print("Error: unknown rule type")
                assert False

def on_blank_line():
    global temp_board
    global temp_goal
    global temp_void
    global temp_rule_from
    global temp_rule_to
    global side_effect
    if len(temp_board) > 0:
        boards.append(temp_board)
        temp_board = []
    elif temp_goal is not None and len(temp_goal) > 0:
        # print("finished goal: ", temp_goal)
        goals.append(temp_goal)
        temp_goal = None
    elif temp_void is not None and len(temp_void) > 0:
        # print("finished void: ", temp_void)
        voids.append(temp_void)
        temp_void = None
    elif len(temp_rule_from) > 0:

        add_rule({'type': 'simple', 'from': temp_rule_from, 'to': temp_rule_to, 'side_effect': side_effect})
        temp_rule_from = []
        temp_rule_to = []
        side_effect = None

for line in lines:
    # print("LINE: ", line)
    if line.lstrip().startswith(";;"):
        continue
    if line.strip() == "":
        # print("empty line")
        on_blank_line()
        continue
    indent = len(line) - len(line.lstrip())
    match line.strip().split()[0]:
        case "GOAL":
            temp_goal = []
        case "VOID":
            temp_void = []
        case "BIND":
            split_line = line.strip().split()
            for i in range(1, len(split_line), 2):
                binds[split_line[i]] = split_line[i+1]
        case "CMD":
            # print(line.strip() + " at indent: ", indent)
            level = indent + 1
            process_rule_stack_to_level(level)
            name = line.strip().split()[1]
            rules_stack.append({'type': 'cmd', 'name': name, 'rules': []})
            indent_stack.append(level)
            if name not in rules:
                rules[name] = {'type': 'match1', 'rules': []}
        case "FOR":
            # print("FOR at indent: ", indent)
            level = indent + 1
            process_rule_stack_to_level(level)
            wildcards_dict = {}
            for i in range(1, len(line.strip().split()), 2):
                for char in line.strip().split()[i]:
                    wildcards_dict[char] = line.strip().split()[i+1]            
            rules_stack.append({'type': 'for', 'wildcards_dict': wildcards_dict, 'rules': []})
            indent_stack.append(level)
        case "ATOMIC":
            # print("ATOMIC at indent: ", indent)
            level = indent + 1
            process_rule_stack_to_level(level)
            rules_stack.append({'type': 'atomic', 'rules': []})
            indent_stack.append(level)
        case "MATCH1":
            # print("MATCH1 at indent: ", indent)
            level = indent + 1
            process_rule_stack_to_level(level)
            rules_stack.append({'type': 'match1', 'rules': []})
            indent_stack.append(level)
        case _:
            # print("default at indent: ", indent)
            if len(rules_stack) > 0:
                # print("processing pattern")
                process_rule_stack_to_level(indent + 1)
                temp_rule_from.append(line.strip().split()[0])
                temp_rule_to.append(line.strip().split()[1] if len(line.strip().split()) > 1 else line.strip().split()[0])
                if len(line.strip().split()) > 2:
                    side_effect = line.strip().split()[2]
                # print("temp_rule_from: ", temp_rule_from)
                # print("temp_rule_to: ", temp_rule_to)
                # print("side_effect: ", side_effect)
            elif temp_goal is not None:
                temp_goal.append(line.strip())
            elif temp_void is not None:
                temp_void.append(line.strip())
            else:
                temp_board.append(line.strip())

    # old stuff:
    
    # if line.strip().startswith("CMD"):
    #     # clear compound_rules_stack
    #     if len(compound_rules_stack) > 0:
    #         rule = compound_rules_stack.pop()
    #         assert len(compound_rules_stack) == 0
    #         rules[current_rule_name] = rule
    #     split_line = line.strip().split()
    #     current_rule_name = split_line[1]
    #     if len(split_line) > 2:
    #         docs[current_rule_name] = split_line[2]
    #     compound_rules_stack.append({'type': 'firstmatch', 'rules': []})
    #     continue
    # if line.strip().startswith("FOR"):
    #     split_line = line.strip().split()
    #     wildcards_stack.append((split_line[1], split_line[2]))
    #     continue
    # if line.strip().startswith("END_FOR"):
    #     wildcards_stack.pop()
    #     continue
    # # we're reading the line of a pattern
    # if temp_goal is not None:
    #     temp_goal.append(line.strip())
    # elif temp_void is not None:
    #     temp_void.append(line.strip())
    # elif temp_board is not None:
    #     temp_board.append(line.strip())
    # else:
    #     assert current_rule_name is not None
    #     split_line = line.strip().split()
    #     temp_rule_from.append(split_line[0])
    #     temp_rule_to.append(split_line[1] if len(split_line) > 1 else split_line[0])
    #     if len(split_line) > 2:
    #         side_effect = split_line[2]

# if len(temp_board) > 0:
#     boards.append(temp_board)
#     temp_board = []
# if len(temp_rule_from) > 0:
#     rules[current_rule_name].append([temp_rule_from, temp_rule_to])
#     temp_rule_from = []
#     temp_rule_to = []


on_blank_line()
process_rule_stack_to_level(0)

result = {'boards': boards, 'rules': rules, 'binds': binds, 'goals': goals, 'voids': voids}

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
    json.dump(data, json_file, indent=4)
    # json.dump(data, json_file)
    json_file.write(";")
