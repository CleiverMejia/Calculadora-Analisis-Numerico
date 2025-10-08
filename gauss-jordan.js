class GaussJordan {
  process = [];
  constructor(matrix) {
    this.matrix = matrix.map((row) => [...row]); // copia profunda
    this.n = matrix.length;
    this.EPS = 1e-12;
  }

  showMatrix() {
    //muestra la matriz en consola
    console.log("--------------------------");
    this.matrix.forEach((row) => {
      console.log(row.map((v) => v.toFixed(2).padStart(8)).join(" "));
    });
    console.log("--------------------------\n");
  }

  swapRows(i, j) {
    //intercambia filas
    const temp = this.matrix[i];
    this.matrix[i] = this.matrix[j];
    this.matrix[j] = temp;
  }

  divideRow(i, divisor) {
    //divide una fila por un escalar
    if (divisor === 0) return;
    this.matrix[i] = this.matrix[i].map((v) => v / divisor);
  }

  // Busca la fila con mayor |valor| en la columna 'col' desde 'startRow' hacia abajo.
  findPivotRow(col, startRow) {
    let maxRow = startRow;
    let maxAbs = Math.abs(this.matrix[startRow][col]);
    for (let r = startRow + 1; r < this.n; r++) {
      const a = Math.abs(this.matrix[r][col]);
      if (a > maxAbs) {
        maxAbs = a;
        maxRow = r;
      }
    }
    return { maxRow, maxAbs };
  }

  subtractRows(targetRow, pivotRow, factor) {
    //convierte en 0 los elementos de una columna (excepto el pivote)
    for (let c = 0; c < this.matrix[targetRow].length; c++) {
      this.matrix[targetRow][c] -= factor * this.matrix[pivotRow][c];
    }
  }

  solve() {
    const n = this.n;

    this.showMatrix();
    this.process.push({
      operation: "Initial matrix",
      matrix: this.matrix.map((row) => [...row]),
    });

    for (let i = 0; i < n; i++) {
      // 1) Seleccionar pivote: fila con mayor |elemento| en la columna i
      const { maxRow, maxAbs } = this.findPivotRow(i, i);

      if (maxAbs < this.EPS) {
        this.process.push({
          operation: `No unique solution (column ${i + 1} has no valid pivot).`,
          matrix: this.matrix.map((row) => [...row]),
        });
        return this.process; // Termina el proceso si no hay solución única
      }

      if (maxRow !== i) {
        this.swapRows(i, maxRow);
        console.log(
          `↔ Swapped row ${i + 1} with row ${maxRow + 1} (pivot selected)`
        );
        this.showMatrix();
        this.process.push({
          operation: `Swapped row ${i + 1} with row ${
            maxRow + 1
          } (pivot selected)`,
          matrix: this.matrix.map((row) => [...row]),
        });
      } else {
        console.log(
          `• Pivot already at row ${i + 1} (value ${this.matrix[i][i].toFixed(
            6
          )})`
        );
      }

      // Normalizar fila pivote
      const pivot = this.matrix[i][i];
      this.divideRow(i, pivot);
      console.log(`÷ Normalized row ${i + 1} by pivot ${pivot.toFixed(2)}`);
      this.showMatrix();
      this.process.push({
        operation: `Normalized row ${i + 1} by pivot ${pivot.toFixed(2)}`,
        matrix: this.matrix.map((row) => [...row]),
      });

      // Eliminar otras filas
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const factor = this.matrix[j][i];
          this.subtractRows(j, i, factor);
          console.log(
            `→ Row ${j + 1} = Row ${j + 1} - (${factor.toFixed(2)}) * Row ${
              i + 1
            }`
          );
          this.showMatrix();
          this.process.push({
            operation: `Row ${j + 1} = Row ${j + 1} - (${factor.toFixed(
              2
            )}) * Row ${i + 1}`,
            matrix: this.matrix.map((row) => [...row]),
          });
        }
      }
    }

    console.log("=== RESULTS ===");
    this.showMatrix();
    this.process.push({
      operation: "Final matrix",
      matrix: this.matrix.map((row) => [...row]),
    });

    return this.process; // process of solutions
  }
}

function parseMatrix(input) {
  console.log("llego");
  return input
    .split(";") // separa por filas
    .map(
      (row) =>
        row
          .trim() // quita espacios al inicio/final
          .split(",") // separa por columnas
          .map(Number) // convierte cada valor a número
    );
}

// // Ejemplo de uso:
// const A = [
//   [2, 2, 1, 4],
//   [2, -1, 2, 1],
//   [3, 1, 1, 5],
// ];

// const gj = new GaussJordan(A);
// gj.solve();
