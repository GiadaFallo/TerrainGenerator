function updateMouse(e) {

    e.preventDefault();
    e.cancelBubble = true;

    /* In the classic DOM coordinate system the Y axis grows from top to bottom (i.e. top is 0), 
     *  whereas in 3D it grows from bottom to top (i.e. bottom is 0). */

    var offset = $('#viewport').offset();
    var relativeX = (e.pageX - offset.left);
    var relativeY = (e.pageY - offset.top);

    // The following will translate the mouse coordinates into a number ranging from -1 to 1
    mouse_info.x = (relativeX / window.innerWidth) * 2 - 1;
    mouse_info.y = -(relativeY/ window.innerHeight) * 2 + 1;
    mouse_info.button = e.button;
}

function ViewportManage() {

    if (!( $("#raise_lower").hasClass("toolbutton clicked")) )
        $('#viewport').css('cursor', 'url(../assets/cursors/openhand.png), default');
    else $('#viewport').css('cursor', 'none');


    /*MouseDown*/
    $('#viewport').mousedown(function (evt) {

        if (!($("#raise_lower").hasClass("toolbutton clicked")))
            $('#viewport').css('cursor', 'url(../assets/cursors/draghand2.png), default');
        else $('#viewport').css('cursor', 'none');

        if ($("#raise_lower").hasClass("clicked")) {
            mouse_info.state = 1;
            updateMouse(evt);
        }
    });


    /*MouseUp*/
    $('#viewport').mouseup(function (evt) {

        if (!($("#raise_lower").hasClass("toolbutton clicked")))
            $('#viewport').css('cursor', 'url(../assets/cursors/openhand.png), default');
        else $('#viewport').css('cursor', 'none');

        if ($("#raise_lower").hasClass("clicked")) {
            mouse_info.state = 0;
            updateMouse(evt);
        }
    });


    /*MouseMove*/
    $('#viewport').mousemove(function (evt) {

        if ($("#raise_lower").hasClass("clicked")) {

            var ray = new Editor.Raycasting();
            var landscape =  new Editor.Landscape();

            if (mouse_info.state === 1 && evt.which === 1) {
                mouse_info.state = 2;
            }
            else if (mouse_info.state === 1 && evt.which === 3) {
                mouse_info.state = 3;
            }
            if (Terrain.shaderenable)
                Terrain.mesh.threeMesh.material.uniforms.show_ring = true;

            updateMouse(evt);
            ray._updateMouseCoordinates(Terrain.mesh.threeMesh);
            landscape.onmousemove(evt, ray.faceIndex);
        }
    });

}