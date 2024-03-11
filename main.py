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


def play_game(candidates):
    first_letter = input("Enter first letter: ")
    length = int(input("Enter length: "))
    conditions = []
    candidates = [
        word for word in candidates if word[0] == first_letter and len(word) == length
    ]
    while len(candidates) > 0:
        print(f"Remaining candidates: {len(candidates)}")
        candidate = random.choice(candidates)
        print(f"Current candidate: {candidate}")
        answer = input(
            "Rejected (n), accepted (y) or enter condition (e.g. 1202): ")
        if answer == "n":
            candidates.remove(candidate)
            continue
        elif answer == "y":
            print("Congratulations! The word is", candidate)
            break
        conditions.append((candidate, [int(x) for x in list(answer)]))
        candidates = [
            solution
            for solution in candidates
            if matches_conditions(solution, conditions)
        ]


with open("words.txt") as f:
    candidates = f.read().splitlines()
    candidates = [candidate.lower() for candidate in candidates]

while True:
    play_game(candidates)
