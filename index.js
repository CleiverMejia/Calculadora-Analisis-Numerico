const elIter = document.getElementById("iteration");
const elSubmit = document.getElementById("submit");
let result = [];

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
