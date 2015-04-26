declare var _updateSliderValue;

module Exporters {
    
    /* Class to export the generated terrain */
    export class LocalExporter {

        text;

        /* Json Object to save the camera's values */
        private _jsonCamera = {

            /* Parameters */
            fov: 50,
            aspect: $("#viewport").width() / $("#viewport").height(),
            near: 10,
            far: 100000,

            /* Position */
            x: 0,
            y: 0,
            z: 0,

            /* Rotation */
            a: -3,
            b: 1,
            c: 0
        }


        /* Json Object to save the THREE.PlaneGeometry */
        private _jsonGeometry = {

            width: 500,
            height: 500,
            widthsegments: 64,
            heightsegments: 64,
            depth: 1,
            fogdensity: 0,
            fogchecked: false,

            destructurechecked:false,

            vertices: [],
            faces: [],

            faceColors: [],

            algo: "",

            material: "",
            material2: "",
            material3: "",
            id: "",

            terrain: []
        }

        constructor(camera, geometry, id) {

            this._jsonGeometry.id = id;

            /* Saving the parameters decided by the user */

            this._jsonGeometry.width = width;
            this._jsonGeometry.height = height;
            this._jsonGeometry.widthsegments = widthsegments;
            this._jsonGeometry.heightsegments = heightsegments;

            this._jsonGeometry.depth = depth;
            this._jsonGeometry.fogdensity = fogDen;
            this._jsonGeometry.fogchecked = $("#fog").is(":checked");
            this._jsonGeometry.destructurechecked = $("#destructure").is(":checked");
            this._jsonGeometry.algo = $('#algos option:selected').text();

            switch (id) {

                case 'wf':
                    this._jsonGeometry.material = '';
                    this._jsonGeometry.material2 = '';
                    this._jsonGeometry.material3 = '';
                    break;
                default:
                    this._jsonGeometry.material = Terrain.generated._textureUrl;
                    this._jsonGeometry.material2 = Terrain.generated._textureUrl2;
                    this._jsonGeometry.material3 = Terrain.generated._textureUrl3;
                    break;
            }
            this._SavetoJSON(camera, geometry);
        }


        /* Function to save the camera's values */
        _SaveCameratoJSON(camera) {

            this._jsonCamera.far = camera.far;
            this._jsonCamera.aspect = camera.aspect;
            this._jsonCamera.fov = camera.fov;
            this._jsonCamera.near = camera.near;

            this._jsonCamera.x = camera.position.x;
            this._jsonCamera.y = camera.position.y;
            this._jsonCamera.z = camera.position.z;

            this._jsonCamera.a = camera.rotation._x;
            this._jsonCamera.b = camera.rotation._y;
            this._jsonCamera.c = camera.rotation._z;
        }

        /* Function to save the THREE.PlaneGeometry */
        _SaveGeometrytoJSON(geometry) {

            /* Saving the vertices */
            this._jsonGeometry.vertices = geometry.vertices;
            /* Saving the faces */
            this._jsonGeometry.faces = geometry.faces;
        }

        _SavetoJSON(camera, geometry) {

            this._SaveCameratoJSON(camera);
            this._SaveGeometrytoJSON(geometry);


            /* Merge the contents of the two JSONobjects */
            var jsonObject =
                $.extend({}, this._jsonGeometry, this._jsonCamera, true);

            this.text =
            JSON.stringify(jsonObject, null, '\t');

            this.text.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        }
    }
}