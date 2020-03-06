import csv

reader = csv.reader(open(r"../../data/users.csv"),delimiter=',')

filtered = filter(lambda p: 'news' in p[9], reader)
csv.writer(open(r"filtered.csv",'w'),delimiter=',').writerows(filtered)




