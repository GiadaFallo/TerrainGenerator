diamondSquare = function (width, height, segments, smoothingFactor) {

    this.width = width;
    this.height = height;
    this.segments = segments;
    this.smoothingFactor = smoothingFactor;

    this._init = function () {

        /** Start with a large empty 2D array of points
         ** It should be square, and the dimension should be a power of 2, plus 1 (5*5, 33*33, 65*65, etc...)
         */
        this.terrain = new Array();

        for (var i = 0; i <= this.segments; i++) {
            this.terrain[i] = new Array();
            for (var j = 0; j <= this.segments; j++) {
                this.terrain[i][j] = 0;
            }
        }
    };

    this.ApplyAlgo = function () {

        this._init();
        
        for (var length = this.segments; length >= 2; length /= 2) {
            var half = length / 2;
            this.smoothingFactor /= 2;
           
            /***** DIAMOND STEP *****/
            /** Taking a square of four points, generate a random value at the square midpoint,
             ** where the two diagonals meet.
             */
            for (var x = 0; x < this.segments; x += length) {
                for (var y = 0; y < this.segments; y += length) {

                    /** The midpoint value is calculated by 
                      * averaging the four corner values, plus a random amount
                     */
                    var average =
                            this.terrain[x][y] + /* top left */
                            this.terrain[x + length][y] + /*top right */
                            this.terrain[x][y + length] + /* lower left */
                            this.terrain[x + length][y + length]; /* lower right */
                    average = average / 4;

                    average = average + 2 * this.smoothingFactor * Math.random()
                                      - this.smoothingFactor;

                    this.terrain[x + half][y + half] = average;
                }
            }

            /***** SQUARE STEP *****/
            /** Taking each diamond of four points, 
              * generate a random value at the center of the diamond
             */
            var size = this.segments + 1;

            for (var x = 0; x < this.segments; x += half) {

                for (var y = (x + half) % length; y < this.segments; y += length) {
                    /** The midpoint value is calculated 
                      * by averaging the four corner values, plus a random amount
                     */
                    var average =
                            this.terrain[(x - half + size) % size][y] + /* middle left */
                            this.terrain[(x + half) % size][y] + /* middle right */
                            this.terrain[x][(y + half) % size] + /* middle top */
                            this.terrain[x][(y - half + size) % size]; /* middle bottom*/
                    average = average / 4;

                    average = average + 2 * this.smoothingFactor * Math.random()
                                      - this.smoothingFactor;

                    this.terrain[x][y] = average;

                    /* Values on the top and right edges*/
                    if (x === 0)
                        this.terrain[this.segments][y] = average;
                    if (y === 0)
                        this.terrain[x][this.segments] = average;
                }
            }
        }
        return this.terrain;
    };
};