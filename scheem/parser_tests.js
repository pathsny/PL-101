var PEG = require('pegjs');
var fs = require('fs'); // for loading files
var should = require('should');

var wrapExceptions = function(inner) {
    return function() {
        try {
            return inner.apply(null, arguments);
        } catch(err) {}
    }
}

var data = fs.readFileSync('my.peg', 'utf-8');
console.log(data);
var parse = wrapExceptions(PEG.buildParser(data).parse);

should.not.exist(parse(""), "don't parse empty string");
parse("atom").should.eql('atom', "parse atom");
parse("+").should.eql("+", "parse +");
parse("(+ x 3)").should.eql(["+", "x", "3"], "parse (+ x 3)");
parse("(+ 1 (f x 3 y))").should.eql(["+", "1", ["f", "x", "3", "y"]], "parse (+ 1 (f x 3 y))");
parse("(f x  y    y          z)").should.eql(["f", "x", "y", "y", "z"], "parsing with any number of spaces or tabs between atoms");
parse(" ( + 1   (   z )     )").should.eql(["+", "1", ["z"]], "parsing to allow spaces and tabs near paranthesis");
parse("\n (+ a b ( x \n y \n ))").should.eql(["+", "a", "b", ["x", "y"]], "parsing also allows newlines");
parse("'1").should.eql(["quote", "1"], "supporting special quote form for atoms");
parse("'(1 2 3)").should.eql(["quote", ["1", "2", "3"]], "supporting special quote form for expressions");
parse(";; thotdunt\n1;; uhoahtnthoath").should.eql("1", "allowing comments after atoms");
parse(";; thotdunt\n(f ;;function name\n x;;first variable\n;;named \n  y);; uhoahtnthoath").should.eql(['f', 'x', 'y'], "allowing comments in expressions");
parse(";; thotdunt\n(f x y;;end of call\n);; uhoahtnthoath").should.eql(['f', 'x', 'y'], "allowing comments at end of expressions");

