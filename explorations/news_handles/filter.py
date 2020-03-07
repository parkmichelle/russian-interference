import csv

top_followed = ["maxdementiev", "kadirovrussia", "jenn_abrams", "todaynycity", "lavrovmuesli"
, "coldwar20_ru", "politweecs", "washingtonline", "pigeonToday", "neworleanson"]

top_statuses = [
"anzgri"
, "riafanru"
, "screamysonkey"
, "neworleanson"
, "kansasdailynews"
, "todaynycity"
, "chicagodailynew"
, "specialaffair"
, "dailysanfran"
, "coldwar20_ru"]

def filterNews():
	reader = csv.reader(open(r"../../data/users.csv"),delimiter=',')
	filtered = filter(lambda p: 'news' in p[9], reader)
	csv.writer(open(r"filteredNews.csv",'w'),delimiter=',').writerows(filtered)


# Filters tweets to only those created by the top 10 most-followed trolls
def filterUsers():
	reader = csv.reader(open(r"../../data/tweets.csv"),delimiter=',')
	filtered = filter(lambda p: p[1] in top_followed, reader)
	csv.writer(open(r"filteredUsers.csv",'w'),delimiter=',').writerows(filtered)

# Filters tweets to only those created by the top 10 most-posting trolls
def filterStatuses():
	reader = csv.reader(open(r"../../data/tweets.csv"),delimiter=',')
	filtered = filter(lambda p: p[1] in top_statuses, reader)
	csv.writer(open(r"filteredStatuses.csv",'w'),delimiter=',').writerows(filtered)

filterStatuses();



