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
