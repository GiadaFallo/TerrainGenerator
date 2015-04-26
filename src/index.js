var Core;
(function (Core) {
    /* Class to create the THREE.PlaneGeometry */
    var PlaneGeometry = (function () {
        function PlaneGeometry(width, height, widthsegments, heightsegments) {
            this._geometry = new THREE.PlaneGeometry(width, height, widthsegments, heightsegments);
            this._geometry.dynamic = true; /*Setting dynamic will allow the vertices to change, and the rendered result to display, later. */
        }
        Object.defineProperty(PlaneGeometry.prototype, "threeGeometry", {
            get: function () {
                return this._geometry;
            },
            enumerable: true,
            configurable: true
        });
        return PlaneGeometry;
    })();
    Core.PlaneGeometry = PlaneGeometry;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var PerspectiveCamera = (function () {
        function PerspectiveCamera(cmp) {
            /* Near and far define the cliping planes of the view frustum */
            this._camera = new THREE.PerspectiveCamera(cmp.fov, cmp.aspect, cmp.near, cmp.far);

            this._camera.position.set(cmp.x, cmp.y, cmp.z);
            this._camera.rotation.set(cmp.a, cmp.b, cmp.c);
        }
        Object.defineProperty(PerspectiveCamera.prototype, "threeCamera", {
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });

        PerspectiveCamera.prototype._setAspect = function (val) {
            this._camera.aspect = val;
        };

        PerspectiveCamera.prototype._updateProjMatrix = function () {
            this._camera.updateProjectionMatrix();
        };
        return PerspectiveCamera;
    })();
    Core.PerspectiveCamera = PerspectiveCamera;

    var OrthographicCamera = (function () {
        function OrthographicCamera() {
        }
        return OrthographicCamera;
    })();
    Core.OrthographicCamera = OrthographicCamera;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Light = (function () {
        function Light() {
            // add subtle ambient lighting
            this._aLt = new THREE.AmbientLight(0xbbbbbb);
            this._dL = new THREE.DirectionalLight(0xffffff, 1);
            this._pL = new THREE.PointLight(0xff4400, 1.5);
            this._pL.position.set(0, 0, 0);

            this._dL.position.set(0.5, 0.7, 0.75);
            this._dL.castShadow = true;
            this._dL.shadowDarkness = 0.5;
        }
        Object.defineProperty(Light.prototype, "ambientLight", {
            get: function () {
                return this._aLt;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Light.prototype, "directionalLight", {
            get: function () {
                return this._dL;
            },
            enumerable: true,
            configurable: true
        });
        return Light;
    })();
    Core.Light = Light;
})(Core || (Core = {}));
var Editor;
(function (Editor) {
    var Raycasting = (function () {
        function Raycasting() {
            this.camera = Terrain.camera.threeCamera;
            this.position = Terrain.camera.threeCamera.position;
            this.indices = [];
            this.raycaster = new THREE.Raycaster();
            this.projector = new THREE.Projector();
            this.directionVector = new THREE.Vector3(mouse_info.x, mouse_info.y, 1);

            /**Cast a ray from the position of the mouse in 3D space,
            * following the current direction of the camera,
            * and see if hit any object(s) on the way.
            **/
            // Unproject the vector
            this.directionVector.unproject(this.camera);

            // Substract the vector representing the camera position
            this.directionVector.sub(this.position);

            // Normalize the vector, to avoid large numbers from the projection and substraction
            this.directionVector.normalize();

            // Now our direction vector holds the right numbers
            this.raycaster.set(this.position, this.directionVector);
        }
        // Ask the raycaster for intersects with all objects in the scene
        Raycasting.prototype._updateMouseCoordinates = function (mesh) {
            var intersects = this.raycaster.intersectObject(mesh);

            var offset = $('#viewport').offset();

            /* No intersections */
            if (intersects.length === 0) {
            } else if (intersects[0] != null) {
                /* this.face is the face intersected */
                this.face = intersects[0].face;

                /* this.faceIndex is the index of the face intersected */
                this.faceIndex = intersects[0].faceIndex;
                mouse_info.point.x = intersects[0].point.x;
                mouse_info.point.z = -intersects[0].point.y;
                mouse_info.point.y = -intersects[0].point.z;
            }

            if (Terrain.generated._textureUrl != "") {
                Terrain.mesh.threeMesh.material.uniforms.ring_center.value.x = mouse_info.point.x;
                Terrain.mesh.threeMesh.material.uniforms.ring_center.value.y = mouse_info.point.y;
            }
        };
        return Raycasting;
    })();
    Editor.Raycasting = Raycasting;

    var Landscape = (function () {
        function Landscape() {
        }
        Landscape.prototype.raise = function (faceIndex) {
            var geometry = Terrain.geometry.threeGeometry, i, vertice_index, vertices_indices = [], prova = [], distance;

            var faces = Terrain.geometry.threeGeometry.faces;

            var faceIndicesInRadius = findFaces(faceIndex);

            for (var j = 0; j < faceIndicesInRadius.length; j++) {
                var fi = faceIndicesInRadius[j];

                if (typeof (fi.ind) !== "undefined") {
                    if (!(isNaN(fi.ind))) {
                        var indici = getFaceVertices(faces[fi.ind]);

                        var element = {
                            a: indici[0],
                            b: indici[1],
                            c: indici[2],
                            h: fi.h
                        };
                        vertices_indices[j] = element;
                    }
                }
            }

            for (i = 0; i < vertices_indices.length - 1; i++) {
                vertice_index = vertices_indices[i];
                var p = vertice_index.h;

                if (geometry.vertices[vertice_index.a].z < max) {
                    geometry.vertices[vertice_index.a].z += p * strength * 0.01;
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.a] += p * strength * 0.01;
                }
                if (geometry.vertices[vertice_index.b].z < max) {
                    geometry.vertices[vertice_index.b].z += p * strength * 0.01;
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.b] += p * strength * 0.01;
                }
                if (geometry.vertices[vertice_index.c].z < max) {
                    geometry.vertices[vertice_index.c].z += p * strength * 0.01;
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.c] += p * strength * 0.01;
                }
            }

            Terrain.mesh.threeMesh.material.attributes.displacement.needsUpdate = true;
            if (typeof (Terrain.water) != "undefined")
                Terrain.water.material.attributes.displacement.needsUpdate = true;
            geometry.verticesNeedUpdate = true;
        };

        Landscape.prototype.lower = function (faceIndex) {
            var geometry = Terrain.geometry.threeGeometry, i, vertice_index, vertices_indices = [], distance;

            var faces = Terrain.geometry.threeGeometry.faces;

            var faceIndicesInRadius = findFaces(faceIndex);

            for (var j = 0; j < faceIndicesInRadius.length; j++) {
                var fi = faceIndicesInRadius[j];

                if (typeof (fi.ind) !== "undefined") {
                    if (!(isNaN(fi.ind))) {
                        var indici = getFaceVertices(faces[fi.ind]);

                        var element = {
                            a: indici[0],
                            b: indici[1],
                            c: indici[2],
                            h: fi.h
                        };
                        vertices_indices[j] = element;
                    }
                }
            }

            for (i = 0; i < vertices_indices.length; i++) {
                vertice_index = vertices_indices[i];
                var p = vertice_index.h;

                if (geometry.vertices[vertice_index.a].z > -max)
                    geometry.vertices[vertice_index.a].z -= p * strength * 0.01;
                Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.a] -= p * strength * 0.01;
                if (typeof (Terrain.water) != "undefined")
                    Terrain.water.material.attributes.displacement.value[vertice_index.a] = Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.a];

                if (geometry.vertices[vertice_index.b].z > -max)
                    geometry.vertices[vertice_index.b].z -= p * strength * 0.01;
                Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.b] -= p * strength * 0.01;
                if (typeof (Terrain.water) != "undefined")
                    Terrain.water.material.attributes.displacement.value[vertice_index.b] = Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.b];

                if (geometry.vertices[vertice_index.c].z > -max)
                    geometry.vertices[vertice_index.c].z -= p * strength * 0.01;
                Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.c] -= p * strength * 0.01;
                if (typeof (Terrain.water) != "undefined")
                    Terrain.water.material.attributes.displacement.value[vertice_index.c] = Terrain.mesh.threeMesh.material.attributes.displacement.value[vertice_index.c];
            }

            Terrain.mesh.threeMesh.material.attributes.displacement.needsUpdate = true;

            if (typeof (Terrain.water) != "undefined")
                Terrain.water.material.attributes.displacement.needsUpdate = true;

            geometry.verticesNeedUpdate = true;
        };

        Landscape.prototype.onmousemove = function (e, faceIndex) {
            if (mouse_info.state === 2) {
                // The user has clicked and drug their mouse
                // Get all of the vertices in a 5-unit radius
                this.raise(faceIndex);
            } else if (mouse_info.state === 3) {
                // The user has clicked and drug their mouse
                // Get all of the vertices in a 5-unit radius
                this.lower(faceIndex);
            }
        };
        return Landscape;
    })();
    Editor.Landscape = Landscape;
})(Editor || (Editor = {}));
var Core;
(function (Core) {
    var Renderer = (function () {
        /* Renderer Constructor */
        function Renderer() {
            /* Check whether the browser supports WebGL. If so, instantiate the hardware accelerated WebGL renderers */
            if (Detector.webgl)
                this._renderer = new THREE.WebGLRenderer({ antialias: true });
            else
                this._renderer = new THREE.CanvasRenderer();

            /* Set the renderers size to the content areas size */
            this._renderer.setSize($(window).width(), $(window).width());

            /*Set the color of the renderer to white color*/
            this._renderer.setClearColor(0xffffff);

            /*Get the DIV element from the HTML document by its ID and append the renderers DOM object to it*/
            $("#viewport").append(this._renderer.domElement);
        }
        Object.defineProperty(Renderer.prototype, "threeRenderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });

        Renderer.prototype.renderizeScene = function (scene, camera) {
            /*Render the scene. Map the 3D world to the 2D screen */
            this._renderer.render(scene.threeScene, camera.threeCamera);
        };
        return Renderer;
    })();
    Core.Renderer = Renderer;
})(Core || (Core = {}));
var TextureGenerator;
(function (TextureGenerator) {
    var Destructure = (function () {
        function Destructure() {
        }
        Destructure.Effect = function () {
            var densityWidth = width / widthsegments, densityHeight = height / heightsegments, densityDepth = depth * 100 / 255;

            var geometry = Terrain.geometry.threeGeometry;

            for (var i = 0; i < geometry.vertices.length; ++i) {
                var vertex = geometry.vertices[i];

                vertex.x += Math.random() * densityWidth;
                vertex.y += Math.random() * densityDepth;
                vertex.z += Math.random() * densityHeight;
            }
        };
        return Destructure;
    })();
    TextureGenerator.Destructure = Destructure;
})(TextureGenerator || (TextureGenerator = {}));
/* Class to Load the saved terrain */
var Loader = (function () {
    function Loader(data) {
        if (Terrain.mesh != null)
            Terrain.scene._removeMesh(Terrain.mesh);

        this._FromJson(data);

        /* Parameters to restore the camera */
        var cPms = {
            fov: data.fov,
            aspect: data.aspect,
            near: data.near,
            far: data.far,
            x: data.x,
            y: data.y,
            z: data.z,
            a: data.a,
            b: data.b,
            c: data.c
        };

        this._updateToolbarValue(data);

        this._updateTextureValue(data);

        if (data.fogchecked) {
            $("#fog").prop("checked", true);
            $("#fog").next().addClass('checked').siblings();
        }
        if (data.destructurechecked) {
            $("#destructure").prop("checked", true);
            $("#destructure").next().addClass('checked').siblings();
        }

        $("#GenerateTerrain").removeClass('modified');

        /* Generate the terrain with the data obtain by the JSONfile */
        Terrain.generated = new TerrainGenerator(cPms, true);

        Terrain.generated._animate();
        Terrain.generated._algo = data.algo;

        Terrain.id = data.id;

        Terrain.generated._textureUrl = data.material;
        Terrain.generated._textureUrl2 = data.material2;
        Terrain.generated._textureUrl3 = data.material3;

        /* Add the mesh to the scene */
        Terrain.scene._addMesh(Terrain.mesh);

        /* Renderize the scene */
        Terrain.renderer.renderizeScene(Terrain.scene, Terrain.camera);
    }
    Loader.prototype._FromJson = function (data) {
        Terrain.geometry = new Core.PlaneGeometry(data.height, data.width, data.widthsegments, data.heightsegments);

        Terrain.geometry.threeGeometry.vertices = new Array();
        Terrain.geometry.threeGeometry.vertices = data.vertices;

        Terrain.geometry.threeGeometry.faces = new Array();
        Terrain.geometry.threeGeometry.faces = data.faces;

        Terrain.mesh = new Core.Mesh(Terrain.geometry, new THREE.ShaderMaterial());

        switch (data.material) {
            case "":
                Terrain.mesh.threeMesh.material = new THREE.ShaderMaterial({
                    wireframe: true,
                    uniforms: {
                        texture_grass: { type: "t", value: THREE.ImageUtils.loadTexture(data.material) },
                        texture_bare: { type: "t", value: THREE.ImageUtils.loadTexture(data.material2) },
                        texture_snow: { type: "t", value: THREE.ImageUtils.loadTexture(data.material3) },
                        fogDensity: { type: "f", value: fogDen.toFixed(1) * 0.0001 },
                        maxLimit: { type: 'f', value: max },
                        show_ring: { type: 'i', value: false },
                        ring_width: { type: 'f', value: 0.15 },
                        ring_color: { type: 'v4', value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) },
                        ring_center: { type: 'v3', value: new THREE.Vector3() },
                        ring_radius: { type: 'f', value: radius },
                        fog: { type: 'i', value: false }
                    },
                    attributes: {
                        displacement: { type: 'f', value: [] }
                    },
                    vertexShader: $('#groundVertexShader').text(),
                    fragmentShader: $('#groundFragmentShader').text()
                });

                for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++)
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[i] = Terrain.geometry.threeGeometry.vertices[i].z;
                break;

            default:
                Terrain.mesh.threeMesh.material = new THREE.ShaderMaterial({
                    wireframe: false,
                    uniforms: {
                        texture_grass: { type: "t", value: THREE.ImageUtils.loadTexture(data.material) },
                        texture_bare: { type: "t", value: THREE.ImageUtils.loadTexture(data.material2) },
                        texture_snow: { type: "t", value: THREE.ImageUtils.loadTexture(data.material3) },
                        fogDensity: { type: "f", value: fogDen.toFixed(1) * 0.0001 },
                        maxLimit: { type: 'f', value: max },
                        show_ring: { type: 'i', value: false },
                        ring_width: { type: 'f', value: 0.15 },
                        ring_color: { type: 'v4', value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) },
                        ring_center: { type: 'v3', value: new THREE.Vector3() },
                        ring_radius: { type: 'f', value: radius.toFixed(1) * 2.0 },
                        fog: { type: 'i', value: false }
                    },
                    attributes: {
                        displacement: { type: 'f', value: [] }
                    },
                    vertexShader: $('#groundVertexShader').text(),
                    fragmentShader: $('#groundFragmentShader').text()
                });

                for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++)
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[i] = Terrain.geometry.threeGeometry.vertices[i].z;
                break;
        }
    };

    Loader.prototype._updateToolbarValue = function (data) {
        /* Update the values of the toolbar */
        _updateSliderValue("#width", data.width);
        _updateSliderValue("#height", data.height);
        _updateSliderValue("#depth", data.depth);
        _updateSliderValue("#heightsegments", data.heightsegments);
        _updateSliderValue("#widthsegments", data.widthsegments);
        _updateSliderValue("#fogdensity", data.fogdensity);
    };

    Loader.prototype._updateTextureValue = function (data) {
        var newTextureUsed = ".texturebutton#" + data.id;
        $(newTextureUsed).addClass('active');
    };
    return Loader;
})();
var Exporters;
(function (Exporters) {
    /* Class to export the generated terrain */
    var LocalExporter = (function () {
        function LocalExporter(camera, geometry, id) {
            /* Json Object to save the camera's values */
            this._jsonCamera = {
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
            };
            /* Json Object to save the THREE.PlaneGeometry */
            this._jsonGeometry = {
                width: 500,
                height: 500,
                widthsegments: 64,
                heightsegments: 64,
                depth: 1,
                fogdensity: 0,
                fogchecked: false,
                destructurechecked: false,
                vertices: [],
                faces: [],
                faceColors: [],
                algo: "",
                material: "",
                material2: "",
                material3: "",
                id: "",
                terrain: []
            };
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
        LocalExporter.prototype._SaveCameratoJSON = function (camera) {
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
        };

        /* Function to save the THREE.PlaneGeometry */
        LocalExporter.prototype._SaveGeometrytoJSON = function (geometry) {
            /* Saving the vertices */
            this._jsonGeometry.vertices = geometry.vertices;

            /* Saving the faces */
            this._jsonGeometry.faces = geometry.faces;
        };

        LocalExporter.prototype._SavetoJSON = function (camera, geometry) {
            this._SaveCameratoJSON(camera);
            this._SaveGeometrytoJSON(geometry);

            /* Merge the contents of the two JSONobjects */
            var jsonObject = $.extend({}, this._jsonGeometry, this._jsonCamera, true);

            this.text = JSON.stringify(jsonObject, null, '\t');

            this.text.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        };
        return LocalExporter;
    })();
    Exporters.LocalExporter = LocalExporter;
})(Exporters || (Exporters = {}));
var Exporters;
(function (Exporters) {
    /*  Export a mesh in the obj format */
    var Mesh2Obj = (function () {
        function Mesh2Obj(geometry) {
            console.time("mesh2obj");

            this._parse(geometry);
            console.timeEnd("mesh2obj");
        }
        Mesh2Obj.prototype._parse = function (geometry) {
            this.output = "";

            for (var i = 0; i < geometry.vertices.length; i++) {
                var vertex = geometry.vertices[i];
                this.output += 'v ' + vertex.y + ' ' + vertex.z + ' ' + vertex.x + '\n';
            }

            for (var i = 0; i < geometry.faceVertexUvs[0].length; i++) {
                var vertexUvs = geometry.faceVertexUvs[0][i];

                for (var j = 0; j < vertexUvs.length; j++) {
                    var uv = vertexUvs[j];
                    this.output += 'vt ' + uv.y + ' ' + uv.x + '\n';
                }
            }

            for (var i = 0; i < geometry.faces.length; i++) {
                var normals = geometry.faces[i].vertexNormals;

                for (var j = 0; j < normals.length; j++) {
                    var normal = normals[j];
                    this.output += 'vn ' + normal.y + ' ' + normal.z + ' ' + normal.x + '\n';
                }
            }

            for (var i = 0, j = 1, l = geometry.faces.length; i < l; i++, j += 3) {
                var face = geometry.faces[i];

                this.output += 'f ';
                this.output += (face.a + 1) + '/' + (j) + '/' + (j) + ' ';
                this.output += (face.b + 1) + '/' + (j + 1) + '/' + (j + 1) + ' ';
                this.output += (face.c + 1) + '/' + (j + 2) + '/' + (j + 2) + '\n';
            }
        };
        return Mesh2Obj;
    })();
    Exporters.Mesh2Obj = Mesh2Obj;
})(Exporters || (Exporters = {}));
;

cameraPms = {};
Terrain = {};

mouse_info = {
    x: 0,
    y: 0,
    state: 0,
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

    Terrain.generated = new TerrainGenerator(cameraPms, false);

    Terrain.generated._animate();

    ZoomManage();

    textureSelected();

    $("#fog").click(function () {
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
        } else {
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
            case (13):
                if ($('#blackscreen').length === 1)
                    $(".close").click();
                else
                    $('#GenerateTerrain').click();
                break;

            case (66):
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#brushstrength").val()) - 1;
                    _updateSliderValue(brushstrength, Terrain.incr);
                }

                break;
            case (78):
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#brushstrength").val()) + 1;
                    _updateSliderValue(brushstrength, Terrain.incr);
                }
                break;

            case (70):
                if ($('#fog').next().hasClass('checked')) {
                    $('#fog').next().removeClass('checked');
                    $("#fog").prop("checked", false);
                    Terrain.mesh.threeMesh.material.uniforms.fog.value = false;
                    Terrain.mesh.threeMesh.material.needsUpdate = true;
                } else {
                    $("#fog").prop("checked", true);
                    $("#fog").next().addClass('checked').siblings();
                    Terrain.mesh.threeMesh.material.uniforms.fog.value = true;
                    Terrain.mesh.threeMesh.material.needsUpdate = true;
                }
                break;

            case 71:
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#maxLimit").val()) - 50;
                    _updateSliderValue(maxLimit, Terrain.incr);
                }

                break;

            case 72:
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#maxLimit").val()) + 50;
                    _updateSliderValue(maxLimit, Terrain.incr);
                }

                break;

            case (77):
                $("#raise_lower").click();
                break;

            case (79):
                $('#imptext').click();
                break;

            case (87):
                if ($('#water').next().hasClass('checked')) {
                    $('#water').next().removeClass('checked');
                    $("#water").prop("checked", false);
                    Terrain.generated._addWater();
                } else {
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
                } else if ($('#fog').next().hasClass('checked')) {
                    var p = parseInt($("#fogdensity").val()) + 2;
                    _updateSliderValue(fogdensity, p);
                }
                break;

            case (109):
                if ($("#raise_lower").hasClass("clicked")) {
                    Terrain.incr = parseInt($("#brushsize").val()) - 5;
                    _updateSliderValue(brushsize, Terrain.incr);
                } else if ($('#fog').next().hasClass('checked')) {
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
var Core;
(function (Core) {
    /* Class to create the THREE.Mesh */
    var Mesh = (function () {
        function Mesh(g, material) {
            var geometry = g.threeGeometry;

            if (material != null)
                this._mesh = new THREE.Mesh(geometry, material);
            else
                this._mesh = new THREE.Mesh(geometry);

            this._mesh.rotation.x = Math.PI / 180 * (-90);
        }
        Object.defineProperty(Mesh.prototype, "threeMesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        return Mesh;
    })();
    Core.Mesh = Mesh;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Scene = (function () {
        function Scene() {
            this._scene = new THREE.Scene();
        }
        Object.defineProperty(Scene.prototype, "threeScene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });

        Scene.prototype._addCamera = function (camera) {
            this._scene.add(camera.threeCamera);
        };

        Scene.prototype._addMesh = function (mesh) {
            this._scene.add(mesh.threeMesh);
        };

        Scene.prototype._removeMesh = function (mesh) {
            this._scene.remove(mesh.threeMesh);
        };

        Scene.prototype._addLight = function (light) {
            this._scene.add(light.ambientLight);
            this._scene.add(light.directionalLight);
        };
        return Scene;
    })();
    Core.Scene = Scene;
})(Core || (Core = {}));
function round(n) {
    if (n - (parseInt(n, 10)) >= 0.5) {
        return parseInt(n, 10) + 1;
    } else {
        return parseInt(n, 10);
    }
}

var Exporters;
(function (Exporters) {
    /**
    * A height map is simply a 2D array of data.
    * Each point represents 3 pieces of information:
    * an x and y location and a number to represent the height at that point.
    */
    var Mesh2Heightmap = (function () {
        function Mesh2Heightmap(TerGen, terrain) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = widthsegments;
            this._canvas.height = heightsegments;

            this._drawMap(widthsegments, heightsegments, terrain);

            saveImage(this._canvas);
        }
        Mesh2Heightmap.prototype._drawMap = function (width, height, terrain) {
            var ctx = this._canvas.getContext("2d"), x = 0, y = 0, r = 0, g = 0, b = 0, colorFill = {
                r: 0,
                g: 0,
                b: 0
            }, img = ctx.createImageData(width, height), imgData = img.data;

            for (var x = 0; x < terrain.length; x++) {
                for (var y = 0; y < terrain.length; y++) {
                    var data = terrain[x][y];

                    var standardShade = Math.floor(data * 250);
                    colorFill = {
                        r: standardShade,
                        g: standardShade,
                        b: standardShade
                    };

                    for (var w = 0; w <= 1; w++) {
                        for (var h = 0; h <= 1; h++) {
                            var pData = (~~(x + w) + (~~(y + h) * width)) * 4;

                            imgData[pData] = colorFill.r;
                            imgData[pData + 1] = colorFill.g;
                            imgData[pData + 2] = colorFill.b;
                            imgData[pData + 3] = 255;
                        }
                    }
                }
            }

            ctx.putImageData(img, 0, 0);
        };
        return Mesh2Heightmap;
    })();
    Exporters.Mesh2Heightmap = Mesh2Heightmap;
})(Exporters || (Exporters = {}));
var TerrainGenerator = (function () {
    /* Create the scene (with all the objects: Camera, Light, Renderer) and set the Terrain(with standard parameters) */
    function TerrainGenerator(cP, loadFromFile) {
        this._vertexColors = [];
        Terrain.light = new Core.Light();

        Terrain.camera = new Core.PerspectiveCamera(cP);

        /* Create the scene */
        Terrain.scene = new Core.Scene();

        /* Add camera and light to the scene */
        Terrain.scene._addCamera(Terrain.camera);
        Terrain.scene._addLight(Terrain.light);

        if (!loadFromFile) {
            Terrain.renderer = new Core.Renderer();
            this._textureUrl = '../assets/textures/1.png';
            this._textureUrl2 = '../assets/textures/3.png';
            this._textureUrl3 = '../assets/textures/2.png';
            this._updateTerrain();
        }

        this._setFog();
        this._setEnvironment();
        this._addWater();

        Terrain.controls = new THREE.OrbitControls(Terrain.camera.threeCamera, Terrain.renderer.threeRenderer.domElement);
    }
    TerrainGenerator.prototype._DiamondTerrain = function () {
        Terrain.geometry = new Core.PlaneGeometry(width, height, widthsegments, heightsegments);

        Terrain.terrain = new diamondSquare(width, height, widthsegments, depth * 200).ApplyAlgo();

        var index = 0;

        for (var i = 0; i <= widthsegments; i++) {
            for (var j = 0; j <= heightsegments; j++) {
                Terrain.geometry.threeGeometry.vertices[index].z = Terrain.terrain[i][j];
                index++;
            }
        }

        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();
    };

    TerrainGenerator.prototype._PerlinTerrain = function () {
        var random = new RandomAlea();

        Terrain.geometry = new Core.PlaneGeometry(width, height, widthsegments - 1, heightsegments - 1);

        var perlin = new improvedNoise(), quality = 1, size = widthsegments * heightsegments, z = random() * 100;

        Terrain.terrain = new Uint8Array(size);

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % widthsegments, y = ~~(i / heightsegments);

                var a = x / quality, b = y / quality, abs = Math.abs(perlin.noise(a, b, z) * quality * 1.75);

                Terrain.terrain[i] = Terrain.terrain[i] + abs;
            }
            quality *= 4;
        }

        for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
            Terrain.geometry.threeGeometry.vertices[i].z = Terrain.terrain[i] * depth;
        }
        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();
    };

    TerrainGenerator.prototype._SimplexTerrain = function () {
        var random = new RandomAlea();

        Terrain.geometry = new Core.PlaneGeometry(width, height, widthsegments - 1, heightsegments - 1);

        var simplex = new simplexNoise(), quality = 1, size = widthsegments * heightsegments, z = random() * 100;

        Terrain.terrain = new Uint8Array(size);

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % widthsegments, y = ~~(i / heightsegments);

                var a = x / quality, b = y / quality, abs = Math.abs(simplex.noise3d(a, b, z) * quality);

                Terrain.terrain[i] = Terrain.terrain[i] + abs;
            }
            quality *= 4;
        }

        for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
            Terrain.geometry.threeGeometry.vertices[i].z = Terrain.terrain[i] * depth;
        }

        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();
    };

    /* Create the terrain with the correct parameters */
    TerrainGenerator.prototype._updateTerrain = function () {
        this._algo = ($('#algos option:selected').text());

        switch (parseInt($("#width").val())) {
            case 256:
            case 512:
                Terrain.cost = 2.0;
                break;
            case 1024:
                Terrain.cost = 4.0;
                break;
            case 2048:
                Terrain.cost = 8.0;
                break;
            case 4096:
                Terrain.cost = 16.0;
                break;
        }

        switch (this._algo) {
            case "Diamond Square":
                this._DiamondTerrain();
                break;

            case "Perlin Noise":
                this._PerlinTerrain();
                break;

            case "Simplex Noise":
                this._SimplexTerrain();
                break;
        }

        if (Terrain.mesh != null)
            Terrain.scene._removeMesh(Terrain.mesh);

        Terrain.mesh = new Core.Mesh(Terrain.geometry);

        Terrain.mesh.threeMesh.material = new THREE.ShaderMaterial({
            uniforms: {
                texture_bare: { type: "t", value: THREE.ImageUtils.loadTexture('') },
                texture_grass: { type: "t", value: THREE.ImageUtils.loadTexture('') },
                texture_snow: { type: "t", value: THREE.ImageUtils.loadTexture('') },
                fogDensity: { type: "f", value: fogDen.toFixed(1) * 0.0001 },
                maxLimit: { type: 'f', value: max },
                show_ring: { type: 'i', value: false },
                ring_width: { type: 'f', value: 0.15 },
                ring_color: { type: 'v4', value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) },
                ring_center: { type: 'v3', value: new THREE.Vector3() },
                ring_radius: { type: 'f', value: radius.toFixed(1) * Terrain.cost },
                fog: { type: 'i', value: false }
            },
            attributes: {
                displacement: { type: 'f', value: [] }
            },
            vertexShader: $('#groundVertexShader').text(),
            fragmentShader: $('#groundFragmentShader').text()
        });

        Terrain.scene._addMesh(Terrain.mesh);

        if ($("#raise_lower").hasClass('clicked')) {
            Terrain.mesh.threeMesh.material.uniforms.show_ring.value = true;
            Terrain.mesh.threeMesh.material.uniforms.ring_radius.value = radius.toFixed(1) * Terrain.cost;
            Terrain.mesh.threeMesh.material.uniforms.needsUpdate = true;
        }

        this._setDestructure();
        this._setTexture();
        this._setFog();
    };

    /*  Change the texture of the mesh (in reference to the button selected)  */
    TerrainGenerator.prototype._changeTexture = function (id) {
        var texture;
        var texture2;
        var texture3;

        switch (id) {
            case 'wf':
                texture = '';
                break;
            case 'gr':
                texture = '../assets/textures/1.png';
                texture2 = '../assets/textures/3.png';
                texture3 = '../../assets/textures/2.png';
                break;
            case 'snd':
                texture = '../assets/textures/sand.jpg';
                texture2 = '../assets/textures/sand.jpg';
                texture3 = '../assets/textures/sand.jpg';
                break;
            case 'rc':
                texture = '../assets/textures/rocks.jpg';
                texture2 = '../assets/textures/rocks.jpg';
                texture3 = '../assets/textures/rocks.jpg';
                break;
            case 'bandw':
                texture = '../assets/textures/first.png';
                texture2 = '../assets/textures/second.png';
                texture3 = '../assets/textures/third.png';
                break;
            case 'shader':
                texture = '../assets/textures/texture_ground_grass.jpg';
                texture2 = '../assets/textures/texture_ground_bare.jpg';
                texture3 = '../assets/textures/texture_ground_snow.jpg';
                break;
            case 'shader2':
                texture = '../assets/textures/base1.png';
                texture2 = '../assets/textures/base.png';
                texture3 = '../assets/textures/up.png';
                break;
            case 'textureimported':
                texture = Terrain.generated._textureUrl;
                texture2 = Terrain.generated._textureUrl;
                texture3 = Terrain.generated._textureUrl;
                break;
        }

        /* With WebGLRenderer, it is not possible to switch from a material without a texture to a material with a texture,
        * after the mesh has been rendered once.
        * This is because, without an initial texture, the geometry will not have the necessary baked-in WebGL UV buffers.
        * It is required to set the following flags to true when a texture is added.
        */
        this._textureUrl = texture;
        this._textureUrl2 = texture2;
        this._textureUrl3 = texture3;

        Terrain.geometry.threeGeometry.buffersNeedUpdate = true;
        Terrain.geometry.threeGeometry.uvsNeedUpdate = true;

        this._setTexture();
    };

    /* Set the texture choosed */
    TerrainGenerator.prototype._setTexture = function () {
        switch (this._textureUrl) {
            case "":
                Terrain.mesh.threeMesh.material.wireframe = true;
                Terrain.mesh.threeMesh.material.uniforms.texture_grass.value = THREE.ImageUtils.loadTexture('');
                Terrain.mesh.threeMesh.material.uniforms.texture_bare.value = THREE.ImageUtils.loadTexture('');
                Terrain.mesh.threeMesh.material.uniforms.texture_snow.value = THREE.ImageUtils.loadTexture('');

                for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++)
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[i] = Terrain.geometry.threeGeometry.vertices[i].z;
                break;

            default:
                Terrain.mesh.threeMesh.material.wireframe = false;
                Terrain.mesh.threeMesh.material.uniforms.texture_grass.value = THREE.ImageUtils.loadTexture(this._textureUrl);
                Terrain.mesh.threeMesh.material.uniforms.texture_bare.value = THREE.ImageUtils.loadTexture(this._textureUrl2);
                Terrain.mesh.threeMesh.material.uniforms.texture_snow.value = THREE.ImageUtils.loadTexture(this._textureUrl3);

                for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++)
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[i] = Terrain.geometry.threeGeometry.vertices[i].z;
                break;

                Terrain.mesh.threeMesh.material.needsUpdate = true;
        }
    };

    /* Set the fog property to the scene */
    TerrainGenerator.prototype._setFog = function () {
        if ($("#fog").is(":checked")) {
            Terrain.mesh.threeMesh.material.uniforms.fog.value = true;
            Terrain.mesh.threeMesh.material.needsUpdate = true;
        } else {
            Terrain.mesh.threeMesh.material.uniforms.fog.value = false;
            Terrain.mesh.threeMesh.material.needsUpdate = true;
        }
    };

    TerrainGenerator.prototype._setDestructure = function () {
        if ($("#destructure").is(":checked")) {
            TextureGenerator.Destructure.Effect();
        } else {
        }
    };

    TerrainGenerator.prototype._setEnvironment = function () {
        if ($("#skyEnv").is(":checked")) {
            // Add Sky Mesh
            Terrain.sky = new THREE.Sky();
            Terrain.scene.threeScene.add(Terrain.sky.mesh);
        } else {
            if (Terrain.sky != null)
                Terrain.scene.threeScene.remove(Terrain.sky.mesh);
        }
    };

    TerrainGenerator.prototype._addWater = function () {
        if ($("#water").is(":checked")) {
            Terrain.water = new THREE.Mesh(new THREE.PlaneGeometry(width, height, widthsegments, heightsegments), new THREE.ShaderMaterial({
                uniforms: {
                    water_level: { type: 'f', value: -2 },
                    time: { type: 'f', value: 0 }
                },
                attributes: {
                    displacement: { type: 'f', value: [] }
                },
                vertexShader: document.getElementById('waterVertexShader').textContent,
                fragmentShader: document.getElementById('waterFragmentShader').textContent,
                transparent: true
            }));

            for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
                Terrain.water.material.attributes.displacement.value[i] = 0;
            }

            Terrain.water.dynamic = true;
            Terrain.water.position.z = -2;
            Terrain.water.rotation.x = Math.PI / 180 * (-90);

            Terrain.scene.threeScene.add(Terrain.water);
        } else
            Terrain.scene.threeScene.remove(Terrain.water);
    };

    /* Animate the scene */
    TerrainGenerator.prototype._animate = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            return _this._animate();
        });

        Terrain.camera._setAspect(window.innerWidth / window.innerHeight);
        Terrain.camera._updateProjMatrix();

        if (typeof (Terrain.water) != "undefined") {
            Terrain.water.material.uniforms.time.value = new Date().getTime() % 10000;
        }

        Terrain.renderer.threeRenderer.setSize(window.innerWidth, window.innerHeight);

        Terrain.renderer.renderizeScene(Terrain.scene, Terrain.camera);

        Terrain.controls.update();
    };
    return TerrainGenerator;
})();
