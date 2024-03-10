import random


def get_coloring(word, solution):
    word = list(word)
    solution = list(solution)
    if len(word) != len(solution):
        raise ValueError("Word and solution must have the same length")
    coloring = [0] * len(word)

    for i in range(len(word)):
        if word[i] == solution[i]:
            coloring[i] = 1
            word[i] = None
            solution[i] = None

    for letter in solution:
        if letter is not None and letter in word:
            first_index = word.index(letter)
            coloring[first_index] = 2
            word[first_index] = None

    return coloring


def matches_condition(word, solution, condition):
    if len(condition) != len(word):
        raise ValueError("Condition and word must have the same length")
    return condition == get_coloring(word, solution)


def matches_conditions(solution, conditions):
    return all(
        matches_condition(word, solution, condition) for word, condition in conditions
    )


def play_game(candidates, first_letter, length):
    conditions = []
    candidates = [
        word for word in candidates if word[0] == first_letter and len(word) == length
    ]
    while len(candidates) > 0:
        print(f"Remaining candidates: {len(candidates)}")
        candidate = random.choice(candidates)
        print(f"Current candidate: {candidate}")
        accepted = input("If the candidate was rejected, enter 'n': ")
        if accepted == "n":
            candidates.remove(candidate)
            continue
        new_condition = input(
            "Enter condition, separated by commas (e.g. 1,2,0): ")
        conditions.append((candidate, [int(x)
                          for x in new_condition.split(",")]))
        candidates = [
            solution
            for solution in candidates
            if matches_conditions(solution, conditions)
        ]


with open("mots.txt") as f:
    candidates = f.read().splitlines()
    candidates = [candidate.lower() for candidate in candidates]

first_letter = input("Enter first letter: ")
length = int(input("Enter length: "))

play_game(candidates, first_letter, length)
