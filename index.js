const elIter = document.getElementById("iteration");
const elSubmit = document.getElementById("submit");
const elOtroSubmit = document.getElementById("submit2");
const methodSelected = document.getElementById("method");
const params1 = document.getElementById("params1");
const params2 = document.getElementById("params2");
let result = [];

const matrixRowsInput = document.getElementById("matrixRows");
const matrixColsInput = document.getElementById("matrixCols");
const generateMatrixBtn = document.getElementById("generateMatrix");
const matrixInputContainer = document.getElementById("matrixInputContainer");

window.onload = () => {
  params1.style.display = "block";
  params2.style.display = "none";
  generateMatrixInputs();
};

methodSelected.addEventListener("change", (e) => {
  if (e.target.value === "gaussjordan" || e.target.value === "jacobi" || e.target.value === "seidel") {
    params1.style.display = "none";
    params2.style.display = "block";
  } else {
    params1.style.display = "block";
    params2.style.display = "none";
  }
});

generateMatrixBtn.addEventListener("click", generateMatrixInputs);

function generateMatrixInputs() {
  const rows = Number.parseInt(matrixRowsInput.value) || 3;
  const cols = Number.parseInt(matrixColsInput.value) || 4;

  // Clear previous inputs
  matrixInputContainer.innerHTML = "";

  // Create grid container
  const grid = document.createElement("div");
  grid.className = "matrix-grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

  // Create input cells
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.className = "matrix-cell";
      input.dataset.row = i;
      input.dataset.col = j;
      input.placeholder = "0";
      input.value = "0";
      grid.appendChild(input);
    }
  }

  matrixInputContainer.appendChild(grid);
}

function getMatrixFromInputs() {
  const cells = document.querySelectorAll(".matrix-cell");
  const rows = Number.parseInt(matrixRowsInput.value) || 3;
  const cols = Number.parseInt(matrixColsInput.value) || 4;

  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.querySelector(
        `.matrix-cell[data-row="${i}"][data-col="${j}"]`
      );
      matrix[i][j] = Number.parseFloat(cell.value) || 0;
    }
  }

  return matrix;
}

elSubmit.addEventListener("click", () => {

	try{

	const formData = document.forms["formData"];
  const method = formData["method"].value;
  const equation = formData["equation"].value;
  const intervalA = +formData["intervalA"].value;
  const intervalB = +formData["intervalB"].value;
  const tolerance = Number.parseFloat(formData["tolerance"].value);

  setData(equation, intervalA, intervalB, tolerance);

  if (method === "bisection") result = bisection();
  if (method === "fakeposition") result = fakePosition();
  if (method === "fixedpoint") result = fixedPoint();
  if (method === "newtonraphson") result = newtonRaphson();

	}catch(e){

		alert(e.message);

	}

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

  const matrix = getMatrixFromInputs();//[[3, 4, -2, 0], [2, -3, 4, 11], [1, -2, 3, 7]];//x=2, y=-1, z=1
  console.log("Matriz procesada:", matrix);

  let result = [];

	try{

  if (method === "gaussjordan") result = gaussJordanMethod(matrix);
  if (method === "jacobi") result = jacobiMethod(matrix);
  if (method === "seidel") result = seidelMethod(matrix);

	}catch(e){

		alert(e.message);

	}

	console.log(result);

  elIter.innerHTML = "";
  result.forEach((iter) => {
    elIter.innerHTML += `
      <li style="margin-top: 10px">
        <b>${iter.operation}</b>
        <pre>${iter.matrix
          .map((row) => row.map((v) => v.toFixed(4)).join("\t"))
          .join("\n")}</pre>
      </li>
    `;
  }); /**/
});
