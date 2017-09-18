#!/usr/bin/env python
# encoding: utf-8
import sys
import csv
import os


infile = sys.argv[1]
outfile = os.path.splitext(infile)[0]+'.js'

print('converting ' + infile + ' to ' + outfile)

arr = list()

prefix = 'function exampleData(){\n'
prefix += 'return\n'

postfix = ';\n}'

def is_number(string):
    try:
        float(string)
        return True
    except ValueError:
        return False


with open(infile, 'r') as csvfile:
	spamreader = csv.reader(csvfile)
	for row in spamreader:
		rowstripped = [ s.strip() for s in row]
		rowcasted = [ float(s) if is_number(s) else s  for s in rowstripped  ] 
		arr.append(rowcasted)

	out = prefix + str(arr) + postfix
	with open(outfile, "w") as jsfile:
		jsfile.write(out)

