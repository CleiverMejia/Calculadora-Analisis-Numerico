const elIter = document.getElementById("iteration");
const elSubmit = document.getElementById("submit");
const elOtroSubmit = document.getElementById("submit2");
const methodSelected = document.getElementById("method");
const params1 = document.getElementById("params1");
const params2 = document.getElementById("params2");
let result = [];

window.onload = () => {
  params1.style.display = "block";
  params2.style.display = "none";
};

methodSelected.addEventListener("change", (e) => {
  if (e.target.value === "gaussjordan") {
    params1.style.display = "none";
    params2.style.display = "block";
  } else {
    params1.style.display = "block";
    params2.style.display = "none";
  }
});

elSubmit.addEventListener("click", () => {
  const formData = document.forms["formData"];
  const method = formData["method"].value;
  const equation = formData["equation"].value;
  const intervalA = +formData["intervalA"].value;
  const intervalB = +formData["intervalB"].value;
  const tolerance = +formData["tolerace"].value;

  setData(equation, intervalA, intervalB, tolerance);

  if (method === "bisection") result = bisection();
  if (method === "fakeposition") result = fakePosition();
  if (method === "fixedpoint") result = fixedPoint();
  if (method === "newtonraphson") result = newtonRaphson();

  elIter.innerHTML = "";
  result.forEach((iter) => {
    elIter.innerHTML += `
      <li style="margin-top: 10px">
        <b>f(${iter.aprox})</b>
        <p>${iter.replacedX} = <b>${iter.fAprox}</b></p>
        <p>Error: ${iter.error}</p>
      </li>
    `;
  });
});

elOtroSubmit.addEventListener("click", () => {
  const formData = document.forms["formData"];
  const method = formData["method"].value;
  const matrixInput = formData["matrix"].value.trim();

  console.log("Matriz ingresada:", matrixInput);

  const matrix = parseMatrix(matrixInput);
  console.log("Matriz procesada:", matrix);

  let result = [];

  if (method === "gaussjordan") result = gaussJordanMethod(matrix);

  elIter.innerHTML = "";
  result.forEach((iter) => {
    elIter.innerHTML += `
      <li style="margin-top: 10px">
        <b>${iter.operation}</b>
        <pre>${iter.matrix.map((row) => row.join("\t")).join("\n")}</pre>
      </li>
    `;
  });
});
