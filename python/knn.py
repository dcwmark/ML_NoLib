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

def readFeatureFile(filePath):
  f = open(filePath, 'r')
  lines = f.readlines()

  X = []
  y = []
  # starting at 1 to skip the headers
  for i in range(1, len(lines)):
    # After the split, row is more like cols.
    # In this case, the row would be an array of cols.
    row = lines[i].split(',')
    # print('line[' + str(i) + ']::' + lines[i])
    # print('row::', row)
    X.append(
      # float conversion for the row of j
      # in range of the length of the row - (minus) 1
      # to exclude the last value, which is a label.
      [float(row[j]) for j in range(len(row) - 1)]
    )
    y.append(
      # the last value of a row, {code}row[-1]{code}, which is skipped in above
      # is added here to Y
      classes[row[-1].strip()]
    )

  return (X, y)

from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(
  n_neighbors = 50,
  algorithm = "brute",
  weights = "uniform"
)

X, y = readFeatureFile("../data/dataset/training.csv")
print('X::', X[:10])
print(len(X))

knn.fit(X, y)

X, y = readFeatureFile("../data/dataset/testing.csv")
accuracy = knn.score(X, y)
print("Accuracy::", accuracy)

