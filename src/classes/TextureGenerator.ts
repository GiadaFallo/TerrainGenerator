module TextureGenerator {

    export class Destructure {

        static Effect() {

            var densityWidth = width / widthsegments,
                densityHeight = height/ heightsegments,
                densityDepth = depth * 100 / 255;

            var geometry = Terrain.geometry.threeGeometry;

            for (var i = 0; i < geometry.vertices.length; ++i) {
                var vertex = geometry.vertices[i];

                vertex.x += Math.random() * densityWidth;
                vertex.y += Math.random() * densityDepth;
                vertex.z += Math.random() * densityHeight;
            }
        }
    }


}