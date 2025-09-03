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
    alert("Function does not cross the x-axis");
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

function fixedPoint(){
  const f = math.parse(equation).compile();

  // Evaluamos extremos
  const evalA = f.evaluate({x: intervalA});
  const evalB = f.evaluate({x: intervalB});

  if(evalA < intervalB && evalA > intervalA) {
    if(evalA === 0) return [intervalA];
  }
  else if(evalB < intervalB && evalB > intervalA) {
    if(evalB === 0) return [intervalB];
  }
  else {
    alert("The function does not meet the fixed point conditions");
    return;
  }

  // Verificamos la contracción (derivada)
  const equationDerivative = math.derivative(equation, 'x'); // Derivada de la ecuación
  const fPrime = equationDerivative.compile(); // Compilamos la derivada, para hacerla evaluable (que el codigo la reconozca como una funcion)

  const dA = fPrime.evaluate({x: intervalA}); 
  const dB = fPrime.evaluate({x: intervalB});

  if(Math.abs(dA) > 1 || Math.abs(dB) > 1) {
    alert("The function does not meet the contraction conditions");
    return;
  }

  method = (a) => f.evaluate({x: a});

  return solutionOpenEquation(method, intervalA);
}

function solutionOpenEquation(method, oldRes, iteration = [], lastError = null){
  const a = method(oldRes); // genera un nuevo valor a partir del anterior
  const b = oldRes; //  guarda el valor anterior
  const error = Math.abs(b - a); // calcula el error, comparando ambos valores

  const replacedX = equation.replace("x", `(${oldRes})`);
  iteration.push({ aprox: oldRes, replacedX, fAprox: a, error });

  if (a === 0 || error < tol || error === lastError) return iteration;

  return solutionOpenEquation(
    method,
    a,
    iteration,
    error
  );
}

