module Core {

    /* Class to create the THREE.Mesh */
    export class Mesh {

        /* Material */
        private _material: THREE.Material;
        /* Mesh */
        private _mesh: THREE.Mesh;

        constructor(g: any, material?: THREE.Material) {

            var geometry = g.threeGeometry;

            if (material != null)
                this._mesh = new THREE.Mesh(geometry, material);
                
            else this._mesh = new THREE.Mesh(geometry);

            this._mesh.rotation.x = Math.PI / 180 * (-90);
        }


        get threeMesh(): THREE.Mesh {
            return this._mesh; 
        }
    }

}