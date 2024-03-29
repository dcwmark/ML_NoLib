classes = {
  'car': 0,
  'fish': 1,
  'house': 2,
  'tree': 3,
  'bicycle': 4,
  'guitar': 5,
  'pencil': 6,
  'clock': 7
}

f = open("../data/dataset/training.csv", 'r')
lines = f.readlines()

X = []
Y = []
# starting at 1 to skip the headers
for i in range(1, len(lines)):
  # After the split, row is more like cols.
  # In this case, the row would by an array of cols.
  row = lines[i].split(',')
  # print('line[' + str(i) + ']::' + lines[i])
  # print('row::', row)
  X.append(
    # float conversion for the row of j
    # in range of the length of the row - (minus) 1
    # to exclude the last value, which is a label.
    [float(row[j]) for j in range(len(row) - 1)]
  )
  Y.append(
    # the last value of a row, {code}row[-1]{code}, which is skipped in above
    # is added here to Y
    classes[row[-1].strip()]
  )

print(X[:10])
print(Y[:10])
