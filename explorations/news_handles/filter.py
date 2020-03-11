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

feed_users = ["ameliebaldwin", "ten_gop"]

def filterNews():
	reader = csv.reader(open(r"../../data/users.csv"),delimiter=',')
	filtered = filter(lambda p: 'news' in p[9], reader)
	csv.writer(open(r"filteredNews.csv",'w'),delimiter=',').writerows(filtered)


# Filters tweets to only those created by members of top_list, writes to provided output file
def filterUsers(top_list, output):
	reader = csv.reader(open(r"../../data/tweets.csv"),delimiter=',')
	filtered = filter(lambda p: p[1] in top_list, reader)
	csv.writer(open(output,'w'),delimiter=',').writerows(filtered)

# Filters tweets to only those created by the top 10 most-posting trolls
def filterStatuses():
	reader = csv.reader(open(r"../../data/tweets.csv"),delimiter=',')
	filtered = filter(lambda p: p[1] in top_statuses, reader)
	csv.writer(open(r"filteredStatuses.csv",'w'),delimiter=',').writerows(filtered)

def getReplies():
	trolls = []
	author_trolls = []
	replied_trolls = []
	users = csv.reader(open(r"../../data/users.csv"),delimiter=',')
	for row in users:
		trolls.append(row[8].lower());
	prez = csv.reader(open(r"../../data/preztweets.csv"),delimiter=',')
	# row 4: original_author, row 6: in_reply_to_screen_name
	for row in prez:
		print(row[6].lower())
		if row[4].lower() in trolls:
			author_trolls.append(row[4].lower())
		if row[6].lower() in trolls:
			replied_trolls.append(row[6].lower())

	print("author trolls: ", author_trolls)
	print("replied trolls: ", replied_trolls)


filterUsers(feed_users, "top2.csv")


