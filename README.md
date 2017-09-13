# morsecmd

## Usage
    
    node morsecmd -s 10 -t 800 -i 'Testing 1 2 3' -o ./morse.wav

## Options

    --sidetone -t  Sets the tone frequency. Default is 800
    --wpm -s       Sets the speed in wpm. Default is 10
    --input -i     Sets the input text to convert to morse code
    --output -o    Sets the output file (must be a .wav file)

You can also pipe and/or redirect from STDIN and to STDOUT with morsecmd.

    echo 'Hello world' | morsecmd > hello.wav
