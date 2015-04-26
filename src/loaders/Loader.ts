/* Class to Load the saved terrain */
class Loader {

        constructor(data) {

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
            }

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
            Terrain.generated =
                new TerrainGenerator(cPms, true);

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

    _FromJson(data) {

        Terrain.geometry =
             new Core.PlaneGeometry(data.height, data.width, data.widthsegments, data.heightsegments);

        Terrain.geometry.threeGeometry.vertices = new Array<THREE.Vector3>();
        Terrain.geometry.threeGeometry.vertices = data.vertices;

        Terrain.geometry.threeGeometry.faces = new Array<THREE.Face3>();
        Terrain.geometry.threeGeometry.faces = data.faces;

        Terrain.mesh =
            new Core.Mesh(Terrain.geometry, new THREE.ShaderMaterial());

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
                            ring_radius: { type: 'f', value: radius.toFixed(1) * 2.0},
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


        }

    _updateToolbarValue(data) {
            /* Update the values of the toolbar */
            _updateSliderValue("#width", data.width);
            _updateSliderValue("#height", data.height);
            _updateSliderValue("#depth", data.depth);
            _updateSliderValue("#heightsegments", data.heightsegments);
            _updateSliderValue("#widthsegments", data.widthsegments);
            _updateSliderValue("#fogdensity", data.fogdensity);
    }

    _updateTextureValue(data) {

        var newTextureUsed = ".texturebutton#" + data.id;
        $(newTextureUsed).addClass('active');
    }
}