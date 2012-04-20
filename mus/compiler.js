var compile = function(musexpr) {
    var notexpr = {
        notes: [],
        timeSoFar: 0
    };
    do_compile(musexpr, notexpr, 0);
    return notexpr.notes;
};

var do_compile = function(musexpr, notexpr, startTime) {
    if (musexpr.tag === 'note' || musexpr.tag === 'rest') do_compile_note(musexpr, notexpr, startTime);
    else if (musexpr.tag === 'par') do_compile_par(musexpr, notexpr, startTime);
    else if (musexpr.tag === 'seq') do_compile_seq(musexpr, notexpr, startTime);
    else if (musexpr.tag === 'repeat') do_compile_repeat(musexpr, notexpr, startTime);
};

var do_compile_note = function(musexpr, notexpr, startTime) {
    musexpr.start = startTime;
    if (musexpr.tag === 'note') musexpr.pitch = convertPitch(musexpr.pitch);
    notexpr.notes.push(musexpr);
    notexpr.timeSoFar = Math.max(notexpr.timeSoFar, startTime + musexpr.dur);
};

var letterPitch = function(letter) {
    return ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'].indexOf(letter);
};

var convertPitch = function(chord) {
    var octave = Number(chord[1]);
    return 12 + 12*octave + letterPitch(chord[0]);
};

var do_compile_par = function(musexpr, notexpr, startTime) {
    do_compile(musexpr.left, notexpr, startTime);
    do_compile(musexpr.right, notexpr, startTime);
};

var do_compile_seq = function(musexpr, notexpr, startTime) {
    do_compile(musexpr.left, notexpr, startTime);
    do_compile(musexpr.right, notexpr, notexpr.timeSoFar);
};

var do_compile_repeat = function(musexpr, notexpr, startTime) {
    var timeSoFar = startTime;
    for (var i=0; i<=musexpr.count; i++) {
        do_compile(musexpr.section, notexpr, timeSoFar);
        timeSoFar = notexpr.timeSoFar;
    }
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'repeat', 
        section: { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } },
         count: 3 }};

console.log(melody_mus);
console.log(compile(melody_mus));