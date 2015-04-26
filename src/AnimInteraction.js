/*Function to start the loading animation */
function LoadingStart(f) {

    /* Adding a black div on the page */

    $('<div/>', {

        id: 'blackscreen'

    }).insertAfter('#viewport').css({

        "width": "100%",
        "height": "100%",
        "opacity": "0.6",
        "background-color": "rgb(215, 215, 215)",
        "z-index": "9",
        "position": "absolute"

    });


    $('<div/>', {

        id: 'loadinggif'

    }).insertAfter('#viewport').css({

        "width": "350px",
        "height": "335px",
        "z-index": "20",
        "top": "15%",
        "left": "38%",
        "position": "absolute",
        "background-image": "url(../assets/images/load.gif)"
    });


    setTimeout(f, 500);
}

/*Function to end the loading animation*/
function LoadingEnd() {

    $('#blackscreen').remove();
    $('#loadinggif').remove();
}

/*Function to open a modal dialog*/
function openModalDialog(message) {

    /* Adding a black div on the page */

    $('<div/>', {

        id: 'blackscreen'

    }).insertAfter('#viewport').css({

        "width": "100%",
        "height": "100%",
        "opacity": "0.6",
        "background-color": "rgb(215, 215, 215)",
        "z-index": "9",
        "position": "absolute"

    });


    $('<div/>', {

        id: 'openModal'

    }).insertAfter('#blackscreen').css({

        "width": "356px",
        "height": "150px",
        "position": "absolute",
        "top": "48px",
        "margin": "10% auto",
        "padding": "5px 20px 13px 20px",
        "background": "#293955",
        "font-size": "20px",
        "font-family": "Segoe UI, Helvetica, Arial,Sans-Serif",
        "z-index": "20",
        "top": "15%",
        "left": "38%",
        "color": "white"
    });


    $("#openModal").append($('<div/>', {
        class: 'close',
        text: "OK"
        
    }));

    $("#openModal").append($('<p/>', {
        text: message
    }));

    $("#openModal").children('div').css({
        "padding": "10px"
    });

    $("#openModal").children('p').css({
        "padding": "10px",
        "cursor": "context-menu"
    });

    $(".close").click(function (e) {
        closeModalDialog();
    });

}

/*Function to close a modal dialog*/
function closeModalDialog() {

    $('#blackscreen').remove();
    $('#openModal').remove();
}

/* Fuction to manage the tab menu  */
function TabManage() {

    $('.tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');

        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();

        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
}

/* Fuction to manage the checkboxes */
function CheckBoxManage() {

    $(".checkbox").on("click", function () {

        var element = '#' + ($(this).prev().attr('id'));
       
        if ($(this).hasClass('checked')) {
            $(this).removeClass('checked');
            $(element).prop('checked', false);
        }
        else {

            $(element).prop('checked', true);
            $(this).addClass('checked').siblings().removeClass('checked');
        }

        switch (element) {

            case '#fog':
                Terrain.generated._setFog();
                break;

            case '#water':
                Terrain.generated._addWater();
                break;

            case '#skyEnv':
                Terrain.generated._setEnvironment();
                break;

            case '#destructure':
                if ($('#destructure').is(':checked')) 
                    $(".button").addClass("modified").siblings();
                else
                    $(".button").removeClass('modified');
                break;
        }
    });
}

/* Fuction to manage the sliders  */
function SliderManage() {

    $(".slider").change(function () {

        initParameters();

        switch ($(this).children().attr('id')) {

            case 'maxLimit-slider':
                Terrain.mesh.threeMesh.material.uniforms.maxLimit = max;
                break;

            case 'brushsize-slider':
                    Terrain.mesh.threeMesh.material.uniforms.ring_radius.value = (radius.toFixed(1) * Terrain.cost);
                    Terrain.mesh.threeMesh.material.needsUpdate = true;

            case 'fogdensity-slider':
                Terrain.mesh.threeMesh.material.uniforms.fogDensity.value = (fogDen.toFixed(1) * 0.0001);
                Terrain.generated._setFog();
                Terrain.mesh.threeMesh.material.needsUpdate = true;
                break;

            case 'brushstrength-slider':
                break;
            case 'maxLimit-slider':
                break;

            default:
                $(".button").addClass("modified").siblings().removeClass('modified');
                break;
        }
    });

}

