var fs = require('fs');
var stream = require('stream');
var split = require('split');


//var outputStream = fs.createReadStream('/data/RC_2015-05.bz2').pipe(bz2())
var outputStream = process.stdin.pipe(split(JSON.parse));
var k = 0;
var pruningThreshold = 1;
var pruningCount = 0;
var wordCount = {};
var start = new Date().getTime();
outputStream.on('data', function(reddit_post) {
  k++;
  reddit_post.body.toLowerCase().split(' ').forEach(function(token){
    //ignore everything which is not clearly a word
    //we use Latin1 letters, this excludes a lot of alphabets, but there's not an easy way to manage them, Reddit is mostly in English and for Chinese and Japanese we'd need a tokenizer in any case
    if(!(/^[a-z\u00C0-\u00ff]+$/g).test(token)){
      return;
    }
    if(wordCount[token])
      wordCount[token]++;
    else
      wordCount[token] = 1;
  });

  if(k % 5000 === 0){
    var elapsed = (new Date().getTime()-start)/1000;
    console.log("processed "+k+" posts, current dictionary of "+Object.keys(wordCount).length+" distinct words. "+(k/elapsed)+" posts per second");
    if(Object.keys(wordCount).length > 120000){
      console.log("post "+k+" found "+Object.keys(wordCount).length +" distinct words, pruning the ones appearing less than "+pruningThreshold+" times...");
      for(word in wordCount){
        //console.log("the word "+word+ " appears "+wordCount[word]+ "times ";
        if(wordCount[word] <= pruningThreshold)
          delete wordCount[word];
      }
      pruningCount++;
      console.log("after pruning number #"+pruningCount+" there are "+Object.keys(wordCount).length +" distinct words");
    
      if(pruningCount % 10 === 0){
        fs.writeFile("count.txt",JSON.stringify(wordCount),function(err){
        if(err){console.log("error writing file!");process.exit(1);}
        });
      }
      if(Object.keys(wordCount).length>110000)
        pruningThreshold++;
    }
  }
}).on('end', function() {
  console.log("END!!");
  process.exit(0);          
});
