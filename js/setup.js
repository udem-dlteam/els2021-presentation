Reveal.initialize({
    hash: true,
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes , RevealMath],
    slideNumber: 'c/t',
    center: false
});

Reveal.configure({
    keyboard: {
        67: () => { toggleConsole(Reveal.getState()); },
    }
});

var lastSlide = Reveal.getState();
var inConsole = false;
var consoleSlide = Reveal.getIndices(document.getElementById('console'));

// Go to the console, and back
function toggleConsole(s) {
    if (inConsole) {
        Reveal.slide(lastSlide.indexh, lastSlide.indexv, lastSlide.indexf);
    } else {
        lastSlide = s;
        Reveal.slide(consoleSlide.h, consoleSlide.v);
    }
}

var consoles = {};

// Prevent getting stuck in console using 'c'
Reveal.on('slidechanged', event => {
    if (event.indexh === 7) {
        consoles['ui-01'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-01'].demo(["(define (hello name) \\alert(\"Hello, \"+(`name)+\"!\"))\n",0,
                                "(define (set-bg-color color) \\document.body.style.background=`color)\n"])
    }

    if (event.indexh === 11) {
        consoles['ui-02'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-02'].demo(["(* (+ 1 2) \\3+4 (+ 5 6))\n",0,
                                "(string-append \\\"a\" \"b\" \\\"c\")\n",0,
                                "(define add1 \\function(x) { return x+1; })\n",0,
                                "(add1 10)\n",0,
                                "\\alert(\"ELS 2021\")"]);
    }

    if (event.indexh === 12) {
        consoles['ui-03'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-03'].demo(["\\1+`(* 2 3)\n",0,
                                "(define var 10)\n", 0,
                                "\\1+`var \n", 0,
                                "(string-append \"now: \" \\new Date().toString())\n",0,
                                "(+ 1 2 \\3*4*(`5) 6 7)\n",0,
                                "\\Math.sqrt(`9)-3 \n",0,
                                "(let ((x 10)) \\Math.sqrt(1/`x))\n"
                               ]);
    }

    if (event.indexh === 13) {
        consoles['ui-04'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-04'].demo(["(define number-of-items 100)\n", 0,
                                "\\10*`number-of-items \n", 0,
                                "\\\(`number-of-items)*10 \n",0,
                                "\\`number-of-items*10 \n"]);
    }

    if (event.indexh === 16) {
        consoles['ui-05'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-05'].demo(["' \\2*`v[i+1] \n"]);
    }

    if (event.indexh === 18) {
        consoles['ui-06'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-06'].demo(["\\console.log(`(scheme 1.0))\n", 0,
                                "\\console.log(`(scheme \"hello\"))\n",0,
                                "\\console.log(`(scheme (vector 1 2 3)))\n",0,
                                "\\console.log(`(scheme (list 'a 'b \"c\")))\n",0,
                                "\\console.log(`1+2i)\n",0,
                               ]);
    }

    if (event.indexh === 20) {
        consoles['ui-07'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-07'].demo(["(define (add1 x) \\(`x)+1)\n", 0,
                                "(pp add1)\n", 0,
                                "(add1 0)\n", 0,
                                "(pp add1)\n", 0,
                                "(add1 1)\n"]);
    }

    if (event.indexh === 21) {
        consoles['ui-08'].cons_mux.channels[0].cons.clear_transcript();
        consoles['ui-08'].demo(["(define num 1+2i)\n", 0,
                                "(println \\\(`num).scmobj.imag)\n", 0,
                                "\\\(`num).scmobj.imag=9 \n", 0,
                                "(println num)\n", 0,
                                "\\num=`num \n"]);
    }

    if (event.indexh === 23) {
        consoles['ui-09'].cons_mux.channels[0].cons.clear_transcript();
        sendCode('ex-threads', 'ui-09');
    }

    if (event.indexh === 24) {
        consoles['ui-10'].cons_mux.channels[0].cons.clear_transcript();
        sendCode('ex-iss', 'ui-10');
    }

    if (event.indexh === consoleSlide.h) {
        inConsole = true;
    } else {
        inConsole = false;
    }
});

// Initialize the Gambit VM
main_vm.init('#ui-00');

var _uis = document.getElementsByClassName("_ui");

_uis.forEach((e, i) => {
    var id = e.getAttribute("id");
    var ui = new UI(main_vm, `#${id}`);
    ui.new_repl();
    ui.demo_cancel();
    consoles[id] = ui;
});

main_vm.ui.demo_cancel();

function sendCode(id, _ui) {
    el = document.getElementById(id);
    code = "\r"+el.textContent.replaceAll('"', '\"').replaceAll('\n', '\r')+"\n";
    // consoles[_ui].cons_mux.channels[0].cons.clear_transcript();
    consoles[_ui].send_to_active_console(code);
    // toggleConsole(Reveal.getState());
}

function runCode(id) {
    el = document.getElementById(id);
    code = "\r"+el.textContent.replaceAll('"', '\"').replaceAll('\n', '\r')+"\n";
    main_vm.ui.cons_mux.channels[0].cons.clear_transcript();
    main_vm.ui.send_to_active_console(code);
}

document.body.onload = () => {
    main_vm.ui.cons_mux.channels[0].cons.cm.setSize(null, getComputedStyle(document.getElementById("console")).getPropertyValue('--slide-height').slice(0,3)*0.6);
}

// For examples
var myObj = {'key': 'value'};
