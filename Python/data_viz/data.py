import matplotlib.pyplot as plt
import numpy as np

def initial_plot():
    plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
    plt.show()

def plot_cosinus_with_labels():
    x = np.linspace(0, 10, 100)
    y = np.cos(x)
    plt.plot(x, y)
    plt.xlabel('x')
    plt.ylabel('cos(x)')
    plt.title('Cosinus function')
    plt.show()

def plot_cosinus_and_sinus():
    x = np.linspace(0, 10, 100)
    y1 = np.cos(x)
    y2 = np.sin(x)
    plt.plot(x, y1, label='cos(x)')
    plt.plot(x, y2, label='sin(x)', linestyle='--')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Cosinus and Sinus functions')
    plt.legend()
    plt.show()

def plot_world_population():

    # world population data
    year = np.array([1950, 1960, 1970, 1980, 1990, 2000, 2010])
    population = np.array([2.5, 3, 3.7, 4.4, 5.3, 6.1, 7])

    # plot
    plt.plot(year, population, color='green', marker='o', linestyle='solid')
    plt.xlabel('Year')
    plt.ylabel('Population')
    plt.title('World population over time')
    plt.show()

def plot_programming_languages():
    # programming languages data
    languages = ['Python', 'Java', 'JavaScript', 'C++', 'C#']
    usage = [30, 25, 20, 15, 10]

    # plot
    plt.pie(usage, labels=languages, autopct='%1.1f%%')
    plt.title('Usage of Programming Languages')
    plt.show()


plot_programming_languages()