module Core {

    /* Class to create the THREE.PlaneGeometry */
    export class PlaneGeometry {

        private _geometry: THREE.PlaneGeometry;

        get threeGeometry(): THREE.PlaneGeometry {
            return this._geometry;
        }

        constructor(width: number, height: number, widthsegments: number, heightsegments:number) {
            this._geometry =
                new THREE.PlaneGeometry(
                    width, height,
                    widthsegments, heightsegments /* Terrain resolution */
                    );
            this._geometry.dynamic = true; /*Setting dynamic will allow the vertices to change, and the rendered result to display, later. */

        }
    }
} 