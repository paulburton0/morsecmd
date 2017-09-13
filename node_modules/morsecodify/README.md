
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

codify returns the error code (if any), a buffer object cotaining the wav file contents, and the text as translated.

```
morse = require('morsecodify');

morse.codify(toneFreq, wpm, farnsworth, inputText, function(err, codeBuffer, translated){
    if(err){
        console.error(err);
    } else {
        var file = fs.createWriteStream('morse.wav');
        file.write(codeBuffer);
        file.end();
        console.log('Succesfully created a WAV file containing the morse code for\n' + translated);
    }
});
```
