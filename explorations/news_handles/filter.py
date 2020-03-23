import csv
import datetime

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

# Counts the tweets per day of top2 users ameliebaldwin and ten_gop
def countTweets():
	data = csv.reader(open(r"../../data/top2.csv", 'rU'),delimiter=',')
	amelie = {}
	ten_gop = {}
	amelie_wr = csv.writer(open(r"../../data/amelie_count.csv",'w'),delimiter=',')
	ten_gop_wr = csv.writer(open(r"../../data/ten_gop_count.csv",'w'),delimiter=',')
	
	count = 0;
	for row in data: # converts dates of format 2/5/16 11:39 to datetime objects
		if count > 0: # skips the first row
			date = datetime.datetime.strptime(row[3], '%m/%d/%y %H:%M')
			date_only = date.date();
			if row[1] == "ameliebaldwin":
				amelie[date_only] = amelie.get(date_only, 0) + 1
			else:
				ten_gop[date_only] = ten_gop.get(date_only, 0) + 1
		count = count + 1

	# label the rows
	amelie_wr.writerow(["date", "count"])
	ten_gop_wr.writerow(["date", "count"])
	for key in amelie.keys():
		amelie_wr.writerow([key, amelie.get(key)])
	for key in ten_gop.keys():
		ten_gop_wr.writerow([key, ten_gop.get(key)])

#filterUsers(feed_users, "top2.csv")
countTweets()


