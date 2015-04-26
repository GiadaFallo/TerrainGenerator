declare module THREE {
    export var OrbitControls, Sky
};
declare var
    getSelectedIntValue, are512Segments, textureSelected, initCameraParameters, initParameters, LoadingStart, LoadingEnd, openModalDialog, closeModalDialog,
    Exporting, Importing, GenerateTerrain, brushsize, fogdensity, brushstrength, max,
    TabManage, SliderManage, ViewportManage, TextureButtonManage, ZoomManage, CheckBoxManage, findFaces, getFaceVertices,
    RandomAlea;

declare var diamondSquare, improvedNoise, simplexNoise;

declare var
    saveAs, ReadFile,
    
    width, height, widthsegments, heightsegments, depth, fogDen,
    radius, strength, maxLimit;

declare var cameraPms, Terrain, mouse_info;

cameraPms = {};
Terrain = {};

mouse_info = {
    x: 0,
    y: 0,
    state: 0, // 0 -> up, 1 -> down, 2 -> dragging with left click, 3 -> dragging with right click,
    point: {
        x: 0,
        y: 0,
        z: 0
    }
};

Terrain.id = "gr";

$(document).ready(function () {

    initCameraParameters();
    initParameters();

    Terrain.generated =
        new TerrainGenerator(cameraPms, false);

    Terrain.generated._animate();

    ZoomManage();

    textureSelected();

    $("#fog").click( function () {
        Terrain.generated._setFog();
    });

    $("#water").click(function () {
        Terrain.generated._addWater();
    });


    $("#raise_lower").on('click', function (e) {
        e.preventDefault();

        if ($("#raise_lower").hasClass("clicked")) {
            $("#raise_lower").removeClass('clicked');
            Terrain.mesh.threeMesh.material.uniforms.show_ring.value = false;
            Terrain.mesh.threeMesh.material.uniforms.needsUpdate = true;
            Terrain.controls.noPan = false;
            Terrain.controls.noRotate = false;
            $('#viewport').css('cursor', 'url(../assets/cursors/openhand.png), default');
            
        }
        else {
            Terrain.mesh.threeMesh.material.uniforms.show_ring.value = true;
            Terrain.mesh.threeMesh.material.uniforms.ring_radius.value = radius.toFixed(1) * Terrain.cost;
            Terrain.mesh.threeMesh.material.uniforms.needsUpdate = true;
            Terrain.controls.noPan = true;
            Terrain.controls.noRotate = true;
            $("#raise_lower").addClass("clicked").siblings().removeClass('clicked');
            $('#viewport').css('cursor', 'none');
        }
    }); 


    $(document).keydown(function (evt) {

        switch (evt.which) {

            case (13): //Enter
                if ($('#blackscreen').length === 1) $(".close").click();
                else $('#GenerateTerrain').click();
                break;

            case (66): //B
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#brushstrength").val()) - 1;
                    _updateSliderValue(brushstrength, Terrain.incr);
                }

                break;
            case (78): //N
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#brushstrength").val()) + 1;
                    _updateSliderValue(brushstrength, Terrain.incr);
                }
                break;

            case (70): //F
                
                if ($('#fog').next().hasClass('checked')) {
                    $('#fog').next().removeClass('checked');
                    $("#fog").prop("checked", false);
                    Terrain.mesh.threeMesh.material.uniforms.fog.value = false;
                    Terrain.mesh.threeMesh.material.needsUpdate = true;
                }
                else {
                    $("#fog").prop("checked", true);
                    $("#fog").next().addClass('checked').siblings();
                    Terrain.mesh.threeMesh.material.uniforms.fog.value = true;
                    Terrain.mesh.threeMesh.material.needsUpdate = true;
                }
                break;


            case 71: //G
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#maxLimit").val()) - 50;
                    _updateSliderValue(maxLimit, Terrain.incr);
                }

                break;

            case 72://H
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#maxLimit").val()) + 50;
                    _updateSliderValue(maxLimit, Terrain.incr);
                }

                break;

                case (77): //M
                    $("#raise_lower").click();
                    break;

                case (79): //O
                    $('#imptext').click();
                    break;

            case (87): //W
                    if ($('#water').next().hasClass('checked')) {
                        $('#water').next().removeClass('checked');
                        $("#water").prop("checked", false);
                        Terrain.generated._addWater();
                    }
                    else {
                        $("#water").prop("checked", true);
                        $("#water").next().addClass('checked').siblings();
                        Terrain.generated._addWater();
                    }
                    break;

                case (107): 
                    if ($("#raise_lower").hasClass("clicked")) {
                        Terrain.incr = parseInt($("#brushsize").val()) + 5;
                        if (Terrain.incr <= 20)
                            _updateSliderValue(brushsize, Terrain.incr);
                    }
                    else if ($('#fog').next().hasClass('checked')) {
                        var p = parseInt($("#fogdensity").val()) + 2;
                        _updateSliderValue(fogdensity, p);
                    }
                    break;

                case (109):
                    if ($("#raise_lower").hasClass("clicked")) {
                        Terrain.incr =  parseInt($("#brushsize").val()) - 5;
                        _updateSliderValue(brushsize, Terrain.incr);
                    }
                    else if ($('#fog').next().hasClass('checked')) {
                        var p = parseInt($("#fogdensity").val()) - 2;
                        _updateSliderValue(fogdensity, p);
                    }
                    break;
        }

    });

    /*Viewport functions*/
    ViewportManage();
    /*Tabs mangement*/
    TabManage();
    /*Texture chooser*/
    TextureButtonManage();
    CheckBoxManage();
    /*Slider management*/
    SliderManage();
    /* Export buttons */
    Exporting();
    /* Import button */
    Importing();
    /* Generate Terrain button */
    GenerateTerrain();

    /* On resising the window the camera (in relation of the window size) and the renderer of the scene must be updated */
    $(window).resize(function () {
        Terrain.generated._animate();
    });
});