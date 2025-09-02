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

  if (p > 0) throw new Error("Function does not cross the x-axis");

  if (p == 0) {
    if (f.evaluate({ x: a }) === 0) return [a];
    if (f.evaluate({ x: b }) === 0) return [b];
    return;
  }

  const aprox = method(a, b);
  const fAprox = f.evaluate({ x: aprox });
  const error = Math.abs(b - a);

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
    throw new Error("The function does not meet the fixed point conditions");
  }

  // Verificamos la contracción (derivada)
  const equationDerivative = math.derivative(equation, 'x');
  const fPrime = equationDerivative.compile();

  const dA = fPrime.evaluate({x: intervalA});
  const dB = fPrime.evaluate({x: intervalB});

  if(Math.abs(dA) > 1 || Math.abs(dB) > 1) {
    throw new Error("The function does not meet the contraction conditions");
  }

  method = (a) => f.evaluate({x: a});

  return solutionOpenEquation(method, intervalA, intervalB, []);
}

function solutionOpenEquation(method, actualRes, oldRes, iteration = [], lastError = null){
  const a = method(actualRes);
  const b = oldRes;
  const error = Math.abs(b - a);

  const replacedX = equation.replace("x", `(${actualRes})`);
  iteration.push({ aprox: actualRes, replacedX, fAprox: a, error });

  if (a === 0 || error < tol || error === lastError) return iteration;

  return solutionOpenEquation(
    method,
    a,
    a,
    iteration,
    error
  );
}

