declare var OrbitControls;

module Core {

    export class PerspectiveCamera {

        private _camera: THREE.PerspectiveCamera;
       
        get threeCamera(): THREE.PerspectiveCamera {
            return this._camera;
        }

        constructor(cmp) {
            
            /* Near and far define the cliping planes of the view frustum */
            this._camera =
                new THREE.PerspectiveCamera(cmp.fov, cmp.aspect, cmp.near, cmp.far);

            this._camera.position.set(cmp.x, cmp.y, cmp.z);
            this._camera.rotation.set(cmp.a, cmp.b, cmp.c); 
        }

        _setAspect(val) {
            this._camera.aspect = val;
        }

        _updateProjMatrix() {
            this._camera.updateProjectionMatrix();
        }
    }


    export class OrthographicCamera {

        private _camera: THREE.OrthographicCamera;


    }

}


