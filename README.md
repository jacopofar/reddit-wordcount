
This small script reads from the standard input a set of reddit posts and extract the count of the 100000 most frequent words. A *word* is defined as a sequence of consecutive latin1 letters surrounded by other characters or the end/start of the string. Text is lowercased using the system locale.

The use of the script is pretty simple, use this sort of command:
 
`bunzip2 -kc /data/RC_2015-05.bz2 |node index.js`

it will produce the count.txt file in the current directory, and update it periodically as the counters are updated. It takes about 2 hours on my computer without an SSD drive to process a month of posts.

For further info about the reddit public posts dump see here:

https://www.reddit.com/r/datasets/comments/3bxlg7/i_have_every_publicly_available_reddit_comment/

to download it (note: it's 280 GB when compressed), go here:

magnet:?xt=urn:btih:7690f71ea949b868080401c749e878f98de34d3d&dn=reddit%5Fdata&tr=http%3A%2F%2Ftracker.pushshift.io%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80

