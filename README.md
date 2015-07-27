
This set of small scripts reads from the standard input a set of reddit posts in JSON format and perform some simple tasks:
* extract the count of the 100000 most frequent words
* extract the 400000 most frequent word co-occurrences (ignoring stopwords) and their counts

A *word* is defined as a sequence of consecutive latin1 letters surrounded by other characters or the end/start of the string. Text is lowercased using the system locale.

The use of the script is pretty simple, after having run `npm install` use this sort of command:
 
`bunzip2 -kc /data/RC_2015-05.bz2 |node index.js`

it will produce the count.txt file in the current directory, and update it periodically as the counters are updated. It takes about 2 hours on my computer without an SSD drive to process a month of posts (2015-05), a few hours more for the word couples. It's all done in-memory.

For the couples count just change the JS file name.

For further info about the reddit public posts dump see here:

https://www.reddit.com/r/datasets/comments/3bxlg7/i_have_every_publicly_available_reddit_comment/

to download it (note: it's 280 GB when compressed), go here:

magnet:?xt=urn:btih:7690f71ea949b868080401c749e878f98de34d3d&dn=reddit%5Fdata&tr=http%3A%2F%2Ftracker.pushshift.io%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80

__The count for May, 2015, is available in the release page.__

