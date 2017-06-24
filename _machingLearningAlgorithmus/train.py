import numpy as np
from sklearn import preprocessing, model_selection, neighbors, tree
import pandas as pd
import matplotlib.pyplot as plt


def trainAlghorithm(data, weekday):

    df = data
    X = np.array(df.drop('Ordertime', axis=1))
    #X = X.reshape(-1, 1)
    y = np.array(df['Ordertime'])

    X_train, X_test, y_train, y_test = model_selection.train_test_split(X, y, test_size=0.2)
    #print y_train
    #print df

    clf = tree.DecisionTreeClassifier()
    clf = clf.fit(X_train, y_train)
    #clf = neighbors.KNeighborsClassifier(2)
    #clf.fit(X_train, y_train)
    accuracy = clf.score(X_test, y_test)
    print("accuracy")
    print(accuracy)

    example_measures = np.array([[weekday]])
    #example_measures = example_measures.reshape(-1,1)
    example_measures = example_measures.reshape(-1, len(example_measures))
    prediction = clf.predict(example_measures)
    prediction = prediction.tolist()
    accuracy = accuracy.tolist()
    print prediction
    #plt.plot(X_train, y_train, 'ro')
    #plt.plot(example_measures, prediction, 'bs')
    #plt.axis([0, 6, 0, 20])
    #plt.show()

    return prediction, accuracy
