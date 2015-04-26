/* Set the value of the slider */
function _updateSliderValue(element, data) {
    $(element).simpleSlider("setValue", data);
}

/* Get the value of the specified element */
function getSelectedIntValue(element) {
    var value = $(element).val();
    if (value % 1 === 0)
        return parseInt(value);
    else
        return parseFloat(value);
}

/* Function to find the texture button selected */
function textureSelected() {
    $(".textures").find("div").click(function () {
        Terrain.id = this.id;
    });
}

/* Function to Manage the button to change the texture */
function TextureButtonManage() {
    $('.texturebutton').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('.texturebutton#imptext').click(function () {
        $('#importtexture').change(function () {
            Terrain.generated._changeTexture(Terrain.id);
            $(this).addClass('active').siblings().removeClass('active');
        });
    });
    $(".texturebutton").not('#imptext').click(function () {
        Terrain.generated._changeTexture(Terrain.id);
    });
}

/* Function to initialize the parameters of the camera */
function initCameraParameters() {

    var aspectRatio =
        $("#viewport").width() / $("#viewport").height();

    cameraPms.fov = 50;
    cameraPms.aspect = aspectRatio;
    cameraPms.near = 10;
    cameraPms.far = 100000;

    cameraPms.x = 10;
    cameraPms.y = 300;
    cameraPms.z = 800;

    cameraPms.a = 80;
    cameraPms.b = 9;
    cameraPms.c = 0.00337;

    //cameraPms.x = 7.6;
    //cameraPms.y = 368;
    //cameraPms.z = 615;


    //cameraPms.a = -0.3568;
    //cameraPms.b = 0.009;
    //cameraPms.c = 0.00337;
}

/* Function to initialize the parameters*/
function initParameters() {
    strength = getSelectedIntValue($("#brushstrength"));
    radius = getSelectedIntValue($("#brushsize"));
    width = getSelectedIntValue($("#width"));
    depth = getSelectedIntValue($("#depth"));
    height = getSelectedIntValue($("#height"));
    widthsegments = getSelectedIntValue($("#widthsegments")),
    heightsegments = getSelectedIntValue($("#heightsegments")),
    fogDen = getSelectedIntValue("#fogdensity");
    max = getSelectedIntValue("#maxLimit");
}

function ZoomManage() {

    switch($("#width").val()){

    case "256":
    case "512":
        Terrain.controls.minDistance = 400;
        Terrain.controls.maxDistance = 4000;
        break;

    case "1024":
        Terrain.controls.minDistance = 400;
        Terrain.controls.maxDistance = 8000;
        break;

    case "2048":
        Terrain.controls.minDistance = 400;
        Terrain.controls.maxDistance = 16000;
        break;

    case "4096":
        Terrain.controls.minDistance = 400;
        Terrain.controls.maxDistance = 32000;
            break;
    }

}

/* Function to save the image generating by the heightmap export button */
function saveImage(canvas) {

    canvas.toBlob(function (blob) {
        var newImg = document.createElement("img"),
        url = URL.createObjectURL(blob);
        newImg.onload = function () {
            // no longer need to read the blob so it's revoked 
            URL.revokeObjectURL(url);
        };
        newImg.src = url;
        saveAs(blob, "image.raw");
    });
}

/*  Function to check the value of the segments slider */
function are512Segments() {
    return ($("#widthsegments").val() === "512" && $("#heightsegments").val() === "512");
}

function stopLoadingAnimation() {
    document.body.onfocus = null;
    LoadingEnd();
}

/* function to manage the export buttons */
function Exporting() {

    $('#Export').mouseup(function (e) {
       if (e.which === 1 ) {
        LoadingStart(function () {
            var jsonfile =
                new Exporters.LocalExporter(Terrain.camera.threeCamera, Terrain.geometry.threeGeometry, Terrain.id).text;

            var file =
                new Blob([jsonfile], { type: "text/plain; charset=utf-8" });

            saveAs(file, "Myterrain.json");
        });
       }
    });

    $('#Export').click(function(){
        document.body.onfocus = stopLoadingAnimation;
    });

    /* Export OBJ button*/
    $('#ExportAsObj').mouseup(function (e) {
        if (e.which === 1) {
            LoadingStart(function () {
                var OBJfile =
                    new Exporters.Mesh2Obj(Terrain.geometry.threeGeometry).output;

                var file =
                    new Blob([OBJfile], { type: "text/plain; charset=utf-8" });

                saveAs(file, "Geometry.obj");
            });
        }
    });

    $('#ExportAsObj').click(function () {
        document.body.onfocus = stopLoadingAnimation;
    });

    /* Export Heightmap button */
    $('#ExportAsHeight').click(function (e) {
        if (e.which === 1 ) {
            LoadingStart(function(){
                new Exporters.Mesh2Heightmap(Terrain.generated, Terrain.terrain)
            });
        }
    });

    $('#ExportAsHeight').click(function () {
        document.body.onfocus = stopLoadingAnimation;
    });
}

/* Function to manage the import button */
function Importing() {

    $('#Import').click(function () {
            $("#importfile").click();
    });

    $('#importfile').change(function (evt) {

        if (evt.target.files[0].type === "") {
            LoadingStart(function () {
                ReadFile();

                var currentValue = $('.tabs .tab-links a').attr('href');
                // Show/Hide Tabs
                $('.tabs ' + currentValue).fadeIn(400).siblings().hide();
                // Change/remove current tab to active
                $('.tabs .tab-links a').parent('li').addClass('active').siblings().removeClass('active');

                var textureSelected = ".texturebutton#" + Terrain.id;
                $(textureSelected).removeClass('active');
            });
        }
        else openModalDialog("You have to select a json file.");
    });
}

/* Function to manage the generate terrain button */
function GenerateTerrain() {
    $('#GenerateTerrain').click(function () {

        var mess = "You can have a better risult with same values of width and height segments";
        if (widthsegments != heightsegments) {
            openModalDialog(mess);
        }

        LoadingStart(function () {
            Terrain.generated._updateTerrain();
            ZoomManage();
            $(".button").removeClass("modified");
            LoadingEnd();
        });
    });
}

function getIndicesInRadius(mid, diff, distance) {
    
    var faceIndices = [],
        y = 0,
        topRightPoint = ((widthsegments - 1) * 2),
        offset = (mid % topRightPoint),
        min = mid - offset,
        max = min + topRightPoint - 1,
        prova = 0;

        if ((mid - 2 * diff) >= min) {
            y = mid - 2 * diff;
        }
        else {
            y = mid;
            prova = 2 * radius + 1;
            var value = {
                ind: y,
                h: prova
            };
            faceIndices.push(value);
            y++;
        }


    while ( y < mid ) {
        if ((y >= min) && (y <= max)) {

            prova = prova + 1;

            var value = {
                ind: y,
                h: prova
            };
            faceIndices.push(value);
        }
        y++;
    }

    if (prova === 0) { prova = (2 * radius) + 1; }

    while (y <= (mid + 2 * diff)) {
        
        if ((y >= min) && (y <= max)) {
                prova = prova - 1;
            var value = {
                ind: y,
                h: prova
            };
            faceIndices.push(value);
        }
        y++;
    }

    return faceIndices;
}

function findFaces(originFace) {
    
    var facesSelected = [];

    var d = 0;
    var topRightPoint = (widthsegments - 1) * 2,
        bottomRightPoint = (topRightPoint * (heightsegments - 1)) - 1;

    var mid = originFace;

    var array = getIndicesInRadius(mid, radius, d);

    facesSelected = facesSelected.concat(array);

    /* Salgo */
    while ( d <= radius  ) {
        d++;
        mid = mid - topRightPoint;
        if (mid < 0) break;
        array = getIndicesInRadius(mid, radius - d, d);
        facesSelected = facesSelected.concat(array);
    }

    d = 0;
    mid = originFace;
    
    /* Scendo */
    while (d <= radius ) {
        d++;
        mid = mid + topRightPoint;
        if (mid > bottomRightPoint) break;
        array = getIndicesInRadius(mid, radius - d, d);
        facesSelected = facesSelected.concat(array);
    }

    return facesSelected;
}

function getFaceVertices(face){

    var indices;

    if (face != null) {
        indices = [
            face.a,
            face.b,
            face.c
        ];
    }
    
    return indices;

}
