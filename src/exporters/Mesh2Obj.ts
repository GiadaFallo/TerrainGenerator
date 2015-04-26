module Exporters {

    /*  Export a mesh in the obj format */
    export class Mesh2Obj {

        output: string;

        constructor(geometry) {
            console.time("mesh2obj");
            
            this._parse(geometry);
            console.timeEnd("mesh2obj");
        }


        private _parse( geometry ) {

            this.output = "";
            /* vertices */
            for (var i = 0; i < geometry.vertices.length; i++) {
                var vertex = geometry.vertices[i];
                this.output += 'v ' + vertex.y + ' ' + vertex.z + ' ' + vertex.x + '\n';
            }


            /* uvs */
            for (var i = 0; i < geometry.faceVertexUvs[0].length; i++) {

                var vertexUvs = geometry.faceVertexUvs[0][i];

                for (var j = 0; j < vertexUvs.length; j++) {
                    var uv = vertexUvs[j];
                    this.output += 'vt ' + uv.y + ' ' + uv.x + '\n';
                }

            }

            /* normals */
            for (var i = 0; i < geometry.faces.length; i++) {

                var normals = geometry.faces[i].vertexNormals;

                for (var j = 0; j < normals.length; j++) {
                    var normal = normals[j];
                    this.output += 'vn ' + normal.y + ' ' + normal.z + ' ' + normal.x + '\n';
                }
            }




            /* faces */

            for (var i = 0, j = 1, l = geometry.faces.length; i < l; i++, j += 3) {

                var face = geometry.faces[i];

                this.output += 'f ';
                this.output += (face.a + 1) + '/' + (j) + '/' + (j) + ' ';
                this.output += (face.b + 1) + '/' + (j + 1) + '/' + (j + 1) + ' ';
                this.output += (face.c + 1) + '/' + (j + 2) + '/' + (j + 2) + '\n';

            }
        }



    }

} 