console.log(CompoundTrapezoid("1 + 2x + 3x^2", -2, 4));

function CompoundTrapezoid(equation, a, b, n = 100) {
  if (n <= 0) {
    throw new Error("Subinterval value must be greater than 0");
  }

  if (a >= b) {
    throw new Error("Intervalue a must be lower than intervalue b");
  }

  const f = math.compile(equation);
  const fa = f.evaluate({ x: a });
  const fb = f.evaluate({ x: b });

  const h = (b - a) / n;

  let sum = 0;

  for (let i = 1; i < n; i++) {
    sum += f.evaluate({ x: a + h * i });
  }

  const result = (h * (fa + 2 * sum + fb)) / 2;

  return [
    {
      aprox: "x",
      replacedX: `Integral de ${equation} desde ${intervalA} hasta ${intervalB} con ${n} subintervalos`,
      fAprox: result,
      error: "N/A",
    },
  ];
}
