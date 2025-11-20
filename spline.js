class Spline {
  points = [];
  A = [];
  B = [];
  xSaved = [];

  constructor(points) {
    console.log(points);

    this.points = points;

    this.saveX();
    this.matrixGenerator();
  }

  saveX() {
    this.points.forEach(([x, y], i) => {
      this.xSaved.push(x);
      this.B.push(y);

      if (i !== 0 && i !== this.points.length - 1) {
        this.xSaved.push(x);
        this.B.push(y);
      }
    });
  }

  matrixGenerator() {
    const rowSize = 3 * (this.points.length - 1);

    // Ecuaciones de cada punto
    this.xSaved.forEach((x, i) => {
      const row = Array(rowSize).fill(0);
      const startInd = 3 * Math.floor(i / 2);

      row[startInd] = x * x;
      row[startInd + 1] = x;
      row[startInd + 2] = 1;

      this.A.push(row);
    });

    // Igualar las derivadas
    for (let i = 1; i < this.points.length - 1; i++) {
      const x = this.points[i][0];
      const row = Array(rowSize).fill(0);
      const startInd = 3 * (i - 1);

      row[startInd] = 2 * x;
      row[startInd + 1] = 1;
      row[startInd + 3] = -2 * x;
      row[startInd + 4] = -1;

      this.A.push(row);
    }

    this.A.push([1, ...Array(rowSize - 1).fill(0)]); // [1, 0, 0, 0, ..., 0]
  }

  solve() {
    const matrix = this.A.map((row, i) => {
      return [...row, this.B[i] ?? 0];
    });

    const gauss = gaussJordanMethod(matrix);
    const resultMatrix = gauss.at(-1).matrix;

    for (let index = 0; index < resultMatrix.length / 3; index++) {
      gauss.push({
        operation: `${resultMatrix[index * 3].at(-1)}x^2+${resultMatrix[
          index * 3 + 1
        ].at(-1)}x+${resultMatrix[index * 3 + 2].at(-1)}, ${
          this.xSaved[index * 2]
        } < x < ${this.xSaved[index * 2 + 1]}`,
      });
    }

    return gauss;
  }
}
