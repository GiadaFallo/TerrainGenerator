module Core {
    export class Renderer {

        private _renderer;

        get threeRenderer(): THREE.Renderer {
            return this._renderer;
        }

        /* Renderer Constructor */
        constructor() {
            /* Check whether the browser supports WebGL. If so, instantiate the hardware accelerated WebGL renderers */
            if (Detector.webgl)
                this._renderer = new THREE.WebGLRenderer({ antialias: true });
            /* If its not supported, instantiate the canvas renderer to support all non WebGL browsers */
            else this._renderer = new THREE.CanvasRenderer();
            /* Set the renderers size to the content areas size */
            this._renderer.setSize($(window).width(), $(window).width());
            /*Set the color of the renderer to white color*/
            this._renderer.setClearColor(0xffffff);
            /*Get the DIV element from the HTML document by its ID and append the renderers DOM object to it*/
            $("#viewport").append(this._renderer.domElement);
        }

        renderizeScene(scene: Core.Scene, camera: Core.PerspectiveCamera) {
            /*Render the scene. Map the 3D world to the 2D screen */
            this._renderer.render(scene.threeScene, camera.threeCamera);

        }
    }
}