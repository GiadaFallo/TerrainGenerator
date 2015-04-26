module Editor {

    export class Raycasting {

        raycaster: THREE.Raycaster;
        octree;
        projector: THREE.Projector;
        directionVector: THREE.Vector3;
        camera = Terrain.camera.threeCamera;
        position = Terrain.camera.threeCamera.position;
        face: THREE.Face3;
        faceIndex;
        indices = [];

        constructor() {

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
        _updateMouseCoordinates(mesh) {

            var intersects = this.raycaster.intersectObject(mesh);

            var offset = $('#viewport').offset();

            /* No intersections */
            if (intersects.length === 0) {

            } else
               
                if (intersects[0] != null) {
                    /* this.face is the face intersected */
                    this.face = intersects[0].face;
                     /* this.faceIndex is the index of the face intersected */
                    this.faceIndex = intersects[0].faceIndex;
                    mouse_info.point.x = intersects[0].point.x;
                    mouse_info.point.z = - intersects[0].point.y;
                    mouse_info.point.y = - intersects[0].point.z;
                }

            if (Terrain.generated._textureUrl != "") {
                Terrain.mesh.threeMesh.material.uniforms.ring_center.value.x = mouse_info.point.x;
                Terrain.mesh.threeMesh.material.uniforms.ring_center.value.y = mouse_info.point.y;
            }
        }
    }

    export class Landscape {

        constructor() {
        }

        raise(faceIndex) {

            var geometry = Terrain.geometry.threeGeometry,
                i,
                vertice_index,
                vertices_indices = [],
                prova = [],
                distance;

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
        }

        lower(faceIndex) {

            var geometry = Terrain.geometry.threeGeometry,
                i,
                vertice_index,
                vertices_indices = [],
                distance;

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
        }

        onmousemove(e, faceIndex) {

            if (mouse_info.state === 2) {
                // The user has clicked and drug their mouse
                // Get all of the vertices in a 5-unit radius
                this.raise(faceIndex);
            }
            else if (mouse_info.state === 3) {
                // The user has clicked and drug their mouse
                // Get all of the vertices in a 5-unit radius
                this.lower(faceIndex);
            }
        }
    }
}



