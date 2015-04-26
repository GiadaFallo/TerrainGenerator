class TerrainGenerator {

    private _algo;

    private _vertexColors = [];

    private _textureUrl;
    private _textureUrl2;
    private _textureUrl3;

    /* Create the scene (with all the objects: Camera, Light, Renderer) and set the Terrain(with standard parameters) */
    constructor(cP, loadFromFile: boolean) {

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

    _DiamondTerrain() {

        Terrain.geometry =
        new Core.PlaneGeometry(width, height, widthsegments, heightsegments);

        Terrain.terrain =
        new diamondSquare(width, height, widthsegments, depth * 200).ApplyAlgo();

        var index = 0;

        for (var i = 0; i <= widthsegments; i++) {
            for (var j = 0; j <= heightsegments; j++) {
                Terrain.geometry.threeGeometry.vertices[index].z = Terrain.terrain[i][j];
                index++;
            }
        }

        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();
    }

    _PerlinTerrain() {

        var random = new RandomAlea();

        Terrain.geometry =
        new Core.PlaneGeometry(width, height, widthsegments - 1, heightsegments - 1);

        var perlin = new improvedNoise(),
            quality = 1,
            size = widthsegments * heightsegments,
            z = random() * 100;

        Terrain.terrain = new Uint8Array(size);

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {

                var x = i % widthsegments,
                    y = ~~(i / heightsegments);

                var a = x / quality,
                    b = y / quality,
                    abs = Math.abs(perlin.noise(a, b, z) * quality * 1.75);

                Terrain.terrain[i] = Terrain.terrain[i] + abs;
            }
            quality *= 4;
        }

        for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
            Terrain.geometry.threeGeometry.vertices[i].z = Terrain.terrain[i] * depth;
        }
        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();
    }

    _SimplexTerrain() {

        var random = new RandomAlea();

        Terrain.geometry =
        new Core.PlaneGeometry(width, height, widthsegments - 1, heightsegments - 1);

        var simplex = new simplexNoise(),
            quality = 1,
            size = widthsegments * heightsegments,
            z = random() * 100;

        Terrain.terrain = new Uint8Array(size);

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {

                var x = i % widthsegments,
                    y = ~~(i / heightsegments);

                var a = x / quality,
                    b = y / quality,
                    abs = Math.abs(simplex.noise3d(a, b, z) * quality);

                Terrain.terrain[i] = Terrain.terrain[i] + abs;
            }
            quality *= 4;
        }

        for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
            Terrain.geometry.threeGeometry.vertices[i].z = Terrain.terrain[i] * depth;
        }

        Terrain.geometry.threeGeometry.computeFaceNormals();
        Terrain.geometry.threeGeometry.computeVertexNormals();

    }

    /* Create the terrain with the correct parameters */
    _updateTerrain() {

        this._algo = ($('#algos option:selected').text());

        switch (parseInt($("#width").val())) {

            case 256:
            case 512: Terrain.cost = 2.0;
                break;
            case 1024: Terrain.cost = 4.0;
                break;
            case 2048: Terrain.cost = 8.0;
                break;
            case 4096: Terrain.cost = 16.0;
                break;
        }

        switch (this._algo) {
            /*The option selected is the Diamond Square Algorithm */
            case "Diamond Square":
                this._DiamondTerrain();
                break;
            /*The option selected is the Perlin Noise Algorithm */
            case "Perlin Noise":
                this._PerlinTerrain();
                break;
            /*The option selected is the Simplex Noise Algorithm */
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
    }

    /*  Change the texture of the mesh (in reference to the button selected)  */
    _changeTexture(id: string) {

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
                texture2 ='../assets/textures/base.png';
                texture3 ='../assets/textures/up.png';
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
        
    }

    /* Set the texture choosed */
    _setTexture() {

        switch (this._textureUrl) {

            /* If it is not desired a texture */
            case "":

                Terrain.mesh.threeMesh.material.wireframe = true;
                Terrain.mesh.threeMesh.material.uniforms.texture_grass.value = THREE.ImageUtils.loadTexture('');
                Terrain.mesh.threeMesh.material.uniforms.texture_bare.value = THREE.ImageUtils.loadTexture('');
                Terrain.mesh.threeMesh.material.uniforms.texture_snow.value = THREE.ImageUtils.loadTexture('');

                for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++)
                    Terrain.mesh.threeMesh.material.attributes.displacement.value[i] = Terrain.geometry.threeGeometry.vertices[i].z;
                break;

            /* In all the other cases (also if the texture is imported) */
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
    }

    /* Set the fog property to the scene */
    _setFog() {

        if ($("#fog").is(":checked")) {
            Terrain.mesh.threeMesh.material.uniforms.fog.value = true;
            Terrain.mesh.threeMesh.material.needsUpdate = true;
        }
        else {
            Terrain.mesh.threeMesh.material.uniforms.fog.value = false;
            Terrain.mesh.threeMesh.material.needsUpdate = true;
        }
    }

    _setDestructure() {

        if ($("#destructure").is(":checked")) {
            TextureGenerator.Destructure.Effect();
        }
        else { }
    }

    _setEnvironment() {

        if ($("#skyEnv").is(":checked")) {

            // Add Sky Mesh
          Terrain.sky = new THREE.Sky();
           Terrain.scene.threeScene.add(Terrain.sky.mesh);
        }
        else {
            if (Terrain.sky != null) Terrain.scene.threeScene.remove(Terrain.sky.mesh);
        }
    }

    _addWater() {

        if ($("#water").is(":checked")) {

            Terrain.water = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height, widthsegments, heightsegments),
                new THREE.ShaderMaterial({
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
                })
                );

            for (var i = 0; i < Terrain.geometry.threeGeometry.vertices.length; i++) {
                Terrain.water.material.attributes.displacement.value[i] = 0;
            }

            Terrain.water.dynamic = true;
            Terrain.water.position.z = -2;
            Terrain.water.rotation.x = Math.PI / 180 * (-90);

            Terrain.scene.threeScene.add(Terrain.water);
        }
        else Terrain.scene.threeScene.remove(Terrain.water);
    }

    /* Animate the scene */
    _animate() {

        window.requestAnimationFrame(() => this._animate());

        Terrain.camera._setAspect(window.innerWidth / window.innerHeight);
        Terrain.camera._updateProjMatrix();

        if (typeof(Terrain.water) != "undefined") {
            Terrain.water.material.uniforms.time.value = new Date().getTime() % 10000;
        }

        Terrain.renderer.threeRenderer.setSize(window.innerWidth, window.innerHeight);

        Terrain.renderer.renderizeScene(Terrain.scene, Terrain.camera);

        Terrain.controls.update();
    }

}

