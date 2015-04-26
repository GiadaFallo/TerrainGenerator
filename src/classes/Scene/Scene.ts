module Core {

    export class Scene {

        private _scene: THREE.Scene;
        
        get threeScene() {
            return this._scene;
        }

        constructor() {
            this._scene = new THREE.Scene();
        }


        _addCamera(camera: Core.PerspectiveCamera) {
            this._scene.add(camera.threeCamera);
        }
            
        

        _addMesh(mesh: Core.Mesh) {
            this._scene.add(mesh.threeMesh);
        }

        _removeMesh(mesh: Core.Mesh) {
            this._scene.remove(mesh.threeMesh);
        }

        _addLight(light: Core.Light) {
            this._scene.add(light.ambientLight);
            this._scene.add(light.directionalLight);
        }

    }
}