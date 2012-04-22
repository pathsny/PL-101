var compile = function(musexpr) {
    var notes = [];
    do_compile(musexpr, notes, 0);
    return notes;
};

var do_compile = function(musexpr, notes, startTime) {
    if (musexpr.tag === 'note' || musexpr.tag === 'rest') return do_compile_note(musexpr, notes, startTime);
    else if (musexpr.tag === 'par') return do_compile_par(musexpr, notes, startTime);
    else if (musexpr.tag === 'seq') return do_compile_seq(musexpr, notes, startTime);
    else if (musexpr.tag === 'repeat') return do_compile_repeat(musexpr, notes, startTime);
};

var do_compile_note = function(musexpr, notes, startTime) {
    musexpr.start = startTime;
    if (musexpr.tag === 'note') musexpr.pitch = convertPitch(musexpr.pitch);
    notes.push(musexpr);
    return startTime + musexpr.dur
};

var do_compile_par = function(musexpr, notes, startTime) {
    var e1 = do_compile(musexpr.left, notes, startTime);
    var e2 = do_compile(musexpr.right, notes, startTime);
    return Math.max(e1, e2);
};

var do_compile_seq = function(musexpr, notes, startTime) {
    var endTime = do_compile(musexpr.left, notes, startTime);
    return do_compile(musexpr.right, notes, endTime);
};

var do_compile_repeat = function(musexpr, notexpr, startTime) {
    var timeSoFar = startTime;
    for (var i=0; i<=musexpr.count; i++) {
        var timeSoFar = do_compile(musexpr.section, notexpr, timeSoFar);
    }
    return timeSoFar;
};

var letterPitch = function(letter) {
    return ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'].indexOf(letter);
};

var convertPitch = function(chord) {
    var octave = Number(chord[1]);
    return 12 + 12*octave + letterPitch(chord[0]);
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