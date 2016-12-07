# morsecodify

morsecodify is a Node JS app that converts text strings into WAV files containing
morse code. There are also a few utilities included here that use the morsecodify
module.

## Usage
morsecodify exports one function: codify. codify takes several arguments:
* toneFreq - the frequency of the "sidetone" that's generated.
* wpm - the words per minute.
* farnsworth - the wpm to use for the space between characters and words. If this is set, the individual characters are send at the wpm speed, but the slower speed is used between characters and words. If this is not set, "true timing" is used, where all morse code elements (including intra-character and intra-word spaces) are sent the wpm speed.
* inputText - the text to turn into morse code.
* callback - uses the Node JS convention of using the first argument for errors, and the second for the buffer object returned from codify.

```
morse = require('morsecodify');

morse.codify(toneFreq, wpm, farnsworth, inputText, function(err, codeBuffer){
    if(err){
        console.error(err);
    } else {
        var file = fs.createWriteStream('morse.wav');
        file.write(codeBuffer);
        file.end();
    }
});
```

# morsecmd

## Usage
    
    node morsecmd -s 10 -t 800 -i 'Testing 1 2 3' -o ./morse.wav

## Options

    --sidetone -t  Sets the tone frequency. Default is 800
    --wpm -s       Sets the speed in wpm. Default is 10
    --input -i     Sets the input text to convert to morse code
    --output -o    Sets the output file (must be a .wav file)

You can also pipe from STDIN and to STDOUT with morsecmd.

    echo 'Hello world' | morsecmd > hello.wav

# morsenews

Morsenews takes an RSS feed and creates a WAV file for each headline (title) in the feed. It also creates an M3U playlist containing all of the generated audio files.
