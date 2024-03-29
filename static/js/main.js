var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: {name: "python",
           version: 3,
           singleLineStringErrors: false},
    lineNumbers: true,
    indentUnit: 0,
    extraKeys: {"Ctrl-Space": "autocomplete"},
    matchBrackets: true
});

CodeMirror.commands.autocomplete = function(cm) {
     CodeMirror.simpleHint(cm, CodeMirror.pythonHint);
}

function checkInput(code, filename) {
  var errorString = "";
  if(code.length == 1)
    errorString += "\nEnter some code!\n";
  if(filename.length == 0)
    errorString += "\nEnter some filename!\n";
  if(filename.length != 0 && /Q[0-9]+.pls/.test(filename) == false)
    errorString += "\nFilename not in correct format!\n";
  if(code.split("\n")[0][0] != "~")
    errorString += "\nAuthor token missing!";
  return errorString;
}

$("#run").click(function() {
	var code = editor.getValue() + "\n";
	var filename = $("#filename").val();

  var result = checkInput(code, filename);

	if(result != "") {
		Swal.fire({
		  icon: 'error',
		  title: 'Error',
		  text: result
		});
	} else {
    Swal.fire(
      'Please wait...',
      'Code is being interpreted',
      'question'
    )
		$.ajax({
			url: "/run",
			type: "post",
			dataType: "json",
			data: {"code": code, "filename": filename},
			success: function(result) {
        Swal.close();
				Swal.fire({
					icon: result.icon,
					title: result.title,
					html: "<pre style='text-align: left;'>" + result.text + "</pre>"
				})
			}
		});
	}
});

$("#submit").click(function() {
	var code = editor.getValue() + "\n";
	var filename = $("#filename").val();

  var result = checkInput(code, filename);

	if(result != "") {
		Swal.fire({
		  icon: 'error',
		  title: 'Error',
		  text: result
		});
	} else {
    Swal.fire(
      'Please wait...',
      'Code is being interpreted',
      'question'
    )
		$.ajax({
			url: "/submit",
			type: "post",
			dataType: "json",
			data: {"code": code, "filename": filename},
			success: function(result) {
				if(result.icon == 'success') {
					editor.setValue("");
					$("#filename").val("");
				}
        Swal.close();
				Swal.fire({
					icon: result.icon,
					title: result.title,
					html: "<pre style='text-align: left;'>" + result.text + "</pre>"
				})
			}
		});
	}
});
