module Core {

    export class Light {

        // add subtle ambient lighting
        private _aLt = new THREE.AmbientLight(0xbbbbbb);

        private _pL: THREE.PointLight;
				
        // directional lighting
        private _dL: THREE.DirectionalLight;

        constructor() {

            this._dL = new THREE.DirectionalLight(0xffffff, 1);
            this._pL = new THREE.PointLight(0xff4400, 1.5);
            this._pL.position.set(0, 0, 0);
            
            this._dL.position.set(0.5, 0.7, 0.75);
            this._dL.castShadow = true;
            this._dL.shadowDarkness = 0.5;
        }

        get ambientLight() {
            return this._aLt;
        }

        get directionalLight() {
            return this._dL;
        }
    }
}