var fs = require('fs');
var stream = require('stream');
var split = require('split');
var natural = require('natural');

//var outputStream = fs.createReadStream('/data/RC_2015-05.bz2').pipe(bz2())
var outputStream = process.stdin.pipe(split(JSON.parse));
var desiredAmount = 400000;
var k = 0;
var pruningThreshold = 1;
var pruningCount = 0;
var wordCount = {};
var start = new Date().getTime();
var stopwords = natural.stopwords;

stopwords.push('one');
stopwords.push('so');
stopwords.push('off');
stopwords.push('no');
stopwords.push('not');
stopwords.push('just');

outputStream.on('data', function(reddit_post) {
  k++;
  var couples = [];

  var singleTokens = reddit_post.body.toLowerCase().split(' ').map(function(token){
    //ignore everything which is not clearly a word
    //we use Latin1 letters, this excludes a lot of alphabets, but there's not an easy way to manage them, Reddit is mostly in English and for Chinese and Japanese we'd need a tokenizer in any case
    if(!(/^[a-z\u00C0-\u00ff]+$/g).test(token)){
      return null;
    }
    if(natural.stopwords.indexOf(token) === -1)
      return token;
    else
      return null;
  })
  .filter(function(t){return t !== null;});

  for(var a=0; a < singleTokens.length; a++){
    for(var b=0 ; b<singleTokens.length ; b++){
      if(singleTokens[a] < singleTokens[b])
      couples.push(singleTokens[a]+"_"+singleTokens[b]);
    }
  }
  couples.forEach(function(token){
    if(wordCount[token])
      wordCount[token]++;
    else
      wordCount[token] = 1;
  });
  if(k % 5000 === 0){
    var elapsed = (new Date().getTime()-start)/1000;
    console.log("processed "+k+" posts, current dictionary of "+Object.keys(wordCount).length+" distinct couples. "+(k/elapsed)+" posts per second");
    if(Object.keys(wordCount).length > desiredAmount){
      console.log("post "+k+" found "+Object.keys(wordCount).length +" distinct couples, pruning the ones appearing less than "+pruningThreshold+" times...");
      for(word in wordCount){
        //console.log("the word "+word+ " appears "+wordCount[word]+ "times ";
        if(wordCount[word] <= pruningThreshold)
          delete wordCount[word];
      }
      pruningCount++;
      console.log("after pruning number #"+pruningCount+" there are "+Object.keys(wordCount).length +" distinct couples");

    }
    if(pruningCount % 10 === 0){
      console.log("(writing file)");
      fs.writeFile("count_couples.txt",JSON.stringify(wordCount,null,2),function(err){
        if(err){console.log("error writing file!");process.exit(1);}
      });
    }

    if(Object.keys(wordCount).length>desiredAmount * 1.1)
      pruningThreshold += 1 + Math.floor(pruningThreshold*0.05);
  }

}).on('end', function() {
  console.log("END!!");
  process.exit(0);          
});
