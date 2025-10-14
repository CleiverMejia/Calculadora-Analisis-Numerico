function seidelMethod(matrix) {

	const spectralRadius = seidelConditioned(matrix);

	if (spectralRadius >= 1) {

		throw new Error(`Bad conditioned system for Gauss-Seidel. Spectral radious: ${spectralRadius.toFixed(6)} >= 1`);

	}

	const equations = new Map();
	const initials = new Map();

	for(let f = 0; f < matrix.length; f++) {
		const row = matrix[f];
		let equation = '';

		for(let c = 0; c < row.length; c++) {
			const coeficient = `${row[c]}*x_${c + 1}`;

			if (c !== f && c < row.length - 1) {
				equation += `${coeficient} + `;
			}
		}

		equation = equation.replace(/ \+ $/, '');
		equation = `(${row[row.length - 1]} - (${equation})) / ${row[f]}`;

		equations.set(`x_${f + 1}`, equation);
		initials.set(`x_${f + 1}`, 0);

	}

	return Seidel(equations, initials, 0.00001);
}

function Seidel(equations, initials, tol, maxIterations = 100) {

	if (equations.size !== initials.size) {

		throw new Error('Initial values does not match the amount of equations');

	}

	const process = [];
	let currentIteration = 0;
	let results = new Map(initials);

	process.push({

		operation: "Valores iniciales",
		matrix: [Array.from(results.values())]

	});

	while (currentIteration < maxIterations) {

		const tempInitials = new Map(results);
		const newResults = new Map();
		const iterationValues = [];

		equations.forEach((equation_value, main_key) => {

			const f = math.compile(equation_value);
			let evaluates = {};

			results.forEach((value, key) => {

				if (main_key !== key) {

					evaluates[key] = value;

				}

			});

			const result = f.evaluate(evaluates);
			newResults.set(main_key, result);
			results.set(main_key, result);
			iterationValues.push(result);

		});

		const error = calculateError(tempInitials, newResults);

		process.push({

			operation: `Iteración ${currentIteration + 1} (Error: ${error.toFixed(6)})`,
			matrix: [iterationValues]

		});

		if (error < tol || error==Infinity || error==0) {

			process.push({

				operation: "Convergencia alcanzada",
				matrix: [Array.from(newResults.values())]

			});

			break;

		}

		results = new Map(newResults);
		currentIteration++;

	}

	if (currentIteration >= maxIterations) {

		process.push({

			operation: "Máximo de iteraciones alcanzado",
			matrix: [Array.from(results.values())]

		});

	}

	return process;
}

function calculateError(last, current) {

	let error = 0;

	last.forEach((value, key) => {

		const currentError = math.abs(current.get(key) - value);

		if (currentError > error) {

			error = currentError;

		}

	});

	return error;

}

function seidelConditioned(matrix) {

	const n = matrix.length;
	const coeffMatrix = matrix.map(row => row.slice(0, n));
	
	const D = [];
	const L = [];
	const U = [];
	
	for (let i = 0; i < n; i++) {
		D[i] = Array(n).fill(0);
		L[i] = Array(n).fill(0);
		U[i] = Array(n).fill(0);
		
		for (let j = 0; j < n; j++) {
			if (i === j) {
				D[i][j] = coeffMatrix[i][j];
			} else if (i > j) {
				L[i][j] = coeffMatrix[i][j];
			} else {
				U[i][j] = coeffMatrix[i][j];
			}
		}
	}

	try {
		// T_GS = (D - L)^{-1} * U
		const D_minus_L = math.subtract(D, L);
		const inv_D_minus_L = math.inv(D_minus_L);
		const T_GS = math.multiply(inv_D_minus_L, U);
		
		// Calcular autovalores de T_GS
		const eig = math.eigs(T_GS);
		const eigenvalues = eig.values;
		
		// Encontrar el radio espectral (máximo valor absoluto)
		let spectralRadius = 0;
		for (let i = 0; i < eigenvalues.length; i++) {
			const absEigen = Math.abs(eigenvalues[i]);
			if (absEigen > spectralRadius) {
				spectralRadius = absEigen;
			}
		}
		
		return spectralRadius;
	} catch (error) {
		console.warn("No se pudo calcular el radio espectral para Gauss-Seidel:", error);
		return Infinity;
	}
}