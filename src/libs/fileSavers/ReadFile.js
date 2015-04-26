function errorHandler(evt) {
    switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; 
        default:
            alert('An error occurred reading this file.');
    };
}

function ReadFile(opt_startByte, opt_stopByte) {

    var input = $("#importfile");
    var files = $("#importfile")[0].files;

    if (!files.length) {
        console.error('ERROR: No file selected');
        return;
    }

    var file = files[0]; 
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    reader.onerror = errorHandler;

    reader.onloadend = function (evt) {

        if (evt.target.readyState == FileReader.DONE) {

            var data =
                JSON.parse(evt.target.result);

            if (!data){
                console.error('ERROR: Invalid file');
                return;
            }
            
            new Loader(data);
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
    input.value = "";

    LoadingEnd();
}