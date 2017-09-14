var tone = require('tonegenerator');
var header = require('waveheader');
var latinize = require('latinize');

module.exports.codify = function(toneFreq, wpm, farnsworth, text, replaceChars, cb){
    if(!text){
        return cb('No input text was provided.');
    }
    var text = latinize(text);
    var text = text.replace(/(\r\n|\n|\r)/gm,"");
    var samples = 44100; 
    var volume = 30;
    var ditDuration = (1200/wpm)/1000;
    var dahDuration = 3 * ditDuration;
    var charSpaceDuration = 3 * ditDuration;
    var wordSpaceDuration = 7 * ditDuration;
    var dit = tone(toneFreq, ditDuration, volume, samples);
    var dah = tone(toneFreq, dahDuration, volume, samples);
    var elementSpace = new Array(Math.ceil(samples * ditDuration)).fill(0);
    var charSpaceDuration;
    var wordSpaceDuration;
    // excludeChars permits you to completely eliminate characters from the morse output.
    var excludeChars = new Array('@', '*', '(', ')', '"', '‘', '’', '\'');

    // replaceChars permits you to add custom mapping of words in the source text to replacement strings.
    // To add a new mapping, add a new pair like the examples below. Note the use of spaces in both
    // strings to replace and replacement strings.
    //var replaceChars = new Array(
                                 //' $', ' usd ', 
                                 //'% ', ' pct ', 
                                 //' & ', ' es ', 
                                 //' # ', ' nr ',
                                 //' and ', ' es '
                                 //);

    if(farnsworth){
        fDitDuration = (1200/farnsworth)/1000;
        charSpaceDuration = 3 * fDitDuration;
        wordSpaceDuration = 7 * fDitDuration;
    }

    var charSpace = new Array(Math.ceil(samples * charSpaceDuration)).fill(0);
    var wordSpace = new Array(Math.ceil(samples * wordSpaceDuration)).fill(0);

    for(var r=0; r<replaceChars.length; r+=2){
        var re = new RegExp(replaceChars[r], "gi");
        text = text.replace(re, replaceChars[r+1]); 
    }
    var text = text.split('');
    var characters = {
        'a' : dit.concat(elementSpace, dah),
        'b' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit),
        'c' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit),
        'd' : dah.concat(elementSpace, dit, elementSpace, dit),
        'e' : dit,
        'f' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit),
        'g' : dah.concat(elementSpace, dah, elementSpace, dit),
        'h' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit),
        'i' : dit.concat(elementSpace, dit),
        'j' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah),
        'k' : dah.concat(elementSpace, dit, elementSpace, dah),
        'l' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit),
        'm' : dah.concat(elementSpace, dah),
        'n' : dah.concat(elementSpace, dit),
        'o' : dah.concat(elementSpace, dah, elementSpace, dah),
        'p' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit),
        'q' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah),
        'r' : dit.concat(elementSpace, dah, elementSpace, dit),
        's' : dit.concat(elementSpace, dit, elementSpace, dit),
        't' : dah,
        'u' : dit.concat(elementSpace, dit, elementSpace, dah),
        'v' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah),
        'w' : dit.concat(elementSpace, dah, elementSpace, dah),
        'x' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah),
        'y' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah),
        'z' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit),
        '1' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dah),
        '2' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah, elementSpace, dah),
        '3' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dah),
        '4' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dah),
        '5' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dit),
        '6' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dit),
        '7' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dit),
        '8' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit),
        '9' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dit),
        '0' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dah),
        '=' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dah),
        '+' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit),
        '?' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit),
        '.' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit, elementSpace, dah),
        '/' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dit),
        ':' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dit),
        ';' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit),
        ',' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dah),
        '!' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit),
        '-' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dah)
    }

    var morseText = new Array;
    var translated = '';

    for(var i = 0; i < text.length; i++){
        if(text[i] == ' '){
            morseText = morseText.concat(wordSpace);
            translated += text[i];
        } else if(excludeChars.includes(text[i])){
            if(text[i+1] == ' '){
                i++;
            }
            continue;
        }else {
            morseText = morseText.concat(characters[text[i].toLowerCase()], charSpace);
            translated += text[i].toLowerCase();
        }
    }

    wavHeader = header(morseText.length, {
        bitDepth: 8
    });

    var codeData = Uint8Array.from(morseText, function(val) {
        return val + 128;
    });

    codeBuffer = new Buffer(codeData);

    buffer = Buffer.concat([wavHeader, codeBuffer], wavHeader.length + codeBuffer.length)

    return cb(null, buffer, translated);
}
