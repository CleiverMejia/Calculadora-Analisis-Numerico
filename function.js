let equation;
let f;
let intervalA;
let intervalB;
let tol;

function setData(equa, interA, interB, tolerance) {
  equation = equa;
  intervalA = interA;
  intervalB = interB;
  tol = tolerance;
  f = math.compile(equation);
}

// Metodos Cerrados

function bisection() {
  method = (a, b) => (a + b) / 2;

  return solutionEquation(method, intervalA, intervalB);
}

function fakePosition() {
  method = (a, b) =>
    b -
    f.evaluate({ x: b }) *
      ((a - b) / (f.evaluate({ x: a }) - f.evaluate({ x: b })));

  return solutionEquation(method, intervalA, intervalB);
}

function solutionEquation(method, a, b, iteration = [], lastError = null) {
  const p = f.evaluate({ x: a }) * f.evaluate({ x: b });

  if (p > 0) {
    throw new Error("Function does not cross the x-axis");
    return;
  }

  if (p == 0) {
    if (f.evaluate({ x: a }) === 0) return [a];
    if (f.evaluate({ x: b }) === 0) return [b];
    return;
  }

  const aprox = method(a, b); // calcula el punto medio entre a y b
  const fAprox = f.evaluate({ x: aprox }); // evalua la funcion en el punto aproximado
  const error = Math.abs(b - a); // calcula el error

  if (aprox === Infinity || isNaN(aprox)) {
    throw new Error("The method diverges to infinity or is undefined");
    return;
  }

  const replacedX = equation.replace("x", `(${aprox})`);
  iteration.push({ aprox, replacedX, fAprox, error });

  if (fAprox === 0 || error < tol || error === lastError) return iteration;

  return solutionEquation(
    method,
    fAprox < 0 ? aprox : a,
    fAprox > 0 ? aprox : b,
    iteration,
    error
  );
}

// Metodos Abiertos

function fixedPoint() {
  const f = math.parse(equation).compile();

  // Evaluamos extremos
  const evalA = f.evaluate({ x: intervalA });
  const evalB = f.evaluate({ x: intervalB });

  if (evalA < intervalB && evalA > intervalA) {
    if (evalA === 0) return [intervalA];
  } else if (evalB < intervalB && evalB > intervalA) {
    if (evalB === 0) return [intervalB];
  } else {
    throw new Error("The function does not meet the fixed point conditions");
    return;
  }

  // Verificamos la contracción (derivada)
  const equationDerivative = math.derivative(equation, "x"); // Derivada de la ecuación
  const fPrime = equationDerivative.compile(); // Compilamos la derivada, para hacerla evaluable (que el codigo la reconozca como una funcion)

  const dA = fPrime.evaluate({ x: intervalA });
  const dB = fPrime.evaluate({ x: intervalB });

  if (Math.abs(dA) > 1 || Math.abs(dB) > 1) {
    throw new Error("The function does not meet the contraction conditions");
  }

  method = (a) => f.evaluate({ x: a });

  return solutionOpenEquation(method, intervalA);
}

function newtonRaphson() {
  const equationDerivative = math.derivative(equation, "x"); // Derivada de la ecuación
  const fPrime = equationDerivative.compile(); // Compilamos la derivada, para hacerla evaluable (que el codigo la reconozca como una funcion)
  method = (a) => a - f.evaluate({ x: a }) / fPrime.evaluate({ x: a });
  return solutionOpenEquation(method, intervalA);
}

function solutionOpenEquation(
  method,
  oldRes,
  iteration = [],
  lastError = null
) {
  const a = method(oldRes); // genera un nuevo valor a partir del anterior
  const b = oldRes; //  guarda el valor anterior
  const error = Math.abs(b - a); // calcula el error, comparando ambos valores

  if (a === Infinity || isNaN(a)) {
    throw new Error("The method diverges to infinity or is undefined");
  }

  const replacedX = equation.replace("x", `(${oldRes})`);
  iteration.push({ aprox: oldRes, replacedX, fAprox: a, error });

  if (a === 0 || error < tol || error === lastError) return iteration;

  return solutionOpenEquation(method, a, iteration, error);
}

function gaussJordanMethod(matrix) {
  const result = new GaussJordan(matrix).solve();
  return result;
}

// Metodos Iterativos

const { Equation } = algebra;

const tolerance = 0.003;
let jacobiIterations = [];

function jacobiMethod(A) {
  // esto lo llama el html
  if (jacobiConditioned(A) > 1) throw new Error("No converge");
  jacobiIterations = [];

  // convertir los valores de la matriz a formato de ecuaciones x1 + x2 = 0, etc
  const vectorStrings = A.reduce((acc, row) => {
    const expr = row
      .map((val, j) =>
        j === row.length - 1 ? `= ${val}` : `+ (${val}*x${j + 1})`
      )
      .join(" ")
      .replace("+ ", "");
    acc.push(expr);
    return acc;
  }, []);

  console.log(vectorStrings);

  const clears = clear(vectorStrings);

  jacobi(clears, Array(clears.length).fill(0));

  jacobiIterations.length = 100;
  return jacobiIterations;
}

function jacobi(sel, values) {
  // la funcion que hace jacobi
  const newValues = [];

  console.log("Valores:", values);

  sel.forEach((equa, index) => {
    // Esto es lo que da error
    let replaceValues = {};
    for (let i = 0; i < sel.length; i++) {
      if (i === index) continue;
      replaceValues[`x${i + 1}`] = values[i];
    }

    let expr = equa.toString();

    Object.keys(replaceValues).forEach((k) => {
      expr = expr.replaceAll(k, `(${replaceValues[k]})`);
    });

    const equaEvaluated = math.evaluate(expr);
    newValues[index] = equaEvaluated;
  });

  jacobiIterations.push({
    operation: `Iteración #${jacobiIterations.length}`,
    matrix: [newValues],
  });

  const err = jacobiError(values, newValues);
  console.log("Error:", err);

  if (err < tolerance || err === Infinity || isNaN(err)) return;

  return jacobi(sel, newValues);
}

function jacobiError(prev, actual) {
  return prev.reduce((acc, act, i) => acc + Math.abs(act - actual[i]), 0);
}

function jacobiConditioned(A) {
  const newA = [];
  A.forEach((row, i) => {
    let newRow = [];
    row.forEach((column, j) => {
      if (A.length === j) return;

      newRow.push(column);
    });

    newA[i] = newRow;
  });

  const eig = math.eigs(newA);

  const rho = Math.max(...eig.values.map((v) => Math.abs(v)));

  return rho;
}

function clear(equations) {
  // Despeja las ecuaciones
  return equations.map((equa, index) => {
    const [left, right] = equa.split("=");
    const parsed = algebra.parse(left.trim());
    return new Equation(parsed, +right.trim())
      .solveFor(`x${index + 1}`)
      .toString();
  });
}
