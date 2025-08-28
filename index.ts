let intervalA: number = 1;
let intervalB: number = 2;
const f = (x: number) => x ** 3 + 2 * x ** 2 + 10 * x - 20;

if (f(intervalA) * f(intervalB) < 0) {
  falsePosition(intervalA, intervalB);
  //bisection(intervalA, intervalB);
} else {
  console.log("No hay raices en el rango para la función");
}

function falsePosition(a: number, b: number): void {
  const p: Function = (a: number, b: number) =>
    b - (f(b) * (a - b)) / (f(a) - f(b));

  solutionEquation(p, a, b);
}

function bisection(a: number, b: number): void {
  const mean: Function = (a: number, b: number) => (a + b) / 2;

  solutionEquation(mean, a, b);
}

function solutionEquation(
  method: Function,
  a: number,
  b: number,
  actMeasurement: number = 0
): void {
  const aprox: number = method(a, b);
  const error: number = Math.abs(actMeasurement - aprox);

  console.log("x=", aprox);
  console.log("y=", f(aprox));
  console.log("error=", error, "\n");

  if (error < 0.0001) return;

  const signMean: number = Math.sign(f(aprox));
  const signA: number = Math.sign(f(a));
  const signB: number = Math.sign(f(b));

  if (signMean === signA) a = aprox;
  if (signMean === signB) b = aprox;

  solutionEquation(method, a, b, aprox);
}
