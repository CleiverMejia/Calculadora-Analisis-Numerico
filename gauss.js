

function seidelMethod(matrix) {
	// Calcular el radio espectral para verificar si el sistema está bien condicionado
	const spectralRadius = seidelConditioned(matrix);

	// Si el radio espectral es >= 1, el sistema está mal condicionado y no converge
	if (spectralRadius >= 1) {
		throw new Error(`Bad conditioned system for Gauss-Seidel. Spectral radious: ${spectralRadius.toFixed(6)} >= 1`);
	}

	// Mapa para almacenar las ecuaciones despejadas de cada variable
	const equations = new Map();
	// Mapa para almacenar los valores iniciales de cada variable (generalmente 0)
	const initials = new Map();

	const system = toSystem(matrix);

	// Usar la librería algebra.js para parsear y despejar las ecuaciones
	for (let i = 0; i < system.length; i++) {

		const [left, right] = system[i].split(" = ");

		const parsed = algebra.parse(left.trim());

		equations.set(`x${i + 1}`, new Equation(parsed, +right.trim()).solveFor(`x${i + 1}`).toString());
		initials.set(`x${i + 1}`, 0);

	}

	// Ejecutar el método de Gauss-Seidel con las ecuaciones construidas
	return Seidel(equations, initials, 0.00001);
}

function Seidel(equations, initials, tol, maxIterations = 100) {
	// Validar que el número de ecuaciones coincida con el número de valores iniciales
	if (equations.size !== initials.size) {
		throw new Error('Initial values does not match the amount of equations');
	}

	// Array para almacenar el proceso completo de iteraciones
	const process = [];
	let currentIteration = 0;
	// Map con los resultados actuales, inicializado con los valores iniciales
	let results = new Map(initials);

	// Registrar los valores iniciales en el proceso
	process.push({
		operation: "Valores iniciales",
		matrix: [Array.from(results.values())] // Convertir Map a Array para visualización
	});

	// Bucle principal de iteraciones
	while (currentIteration < maxIterations) {
		// Guardar los valores anteriores para calcular el error
		const tempInitials = new Map(results);
		const newResults = new Map();
		const iterationValues = [];

		// Para cada ecuación/variable, calcular nuevo valor
		equations.forEach((equation_value, main_key) => {
			// Compilar la ecuación para evaluación eficiente
			const f = math.compile(equation_value);
			let evaluates = {};

			// Recoger los valores de las otras variables para evaluar la ecuación
			results.forEach((value, key) => {
				if (main_key !== key) {
					evaluates[key] = value;
				}
			});

			// Evaluar la ecuación con los valores actuales de las otras variables
			const result = f.evaluate(evaluates);
			// Guardar el nuevo valor calculado
			newResults.set(main_key, result);
			// ACTUALIZACIÓN INMEDIATA: característica clave de Gauss-Seidel
			results.set(main_key, result);
			iterationValues.push(result);
		});

		// Calcular el error como la máxima diferencia entre iteraciones
		const error = seidelError(tempInitials, newResults);

		// Registrar esta iteración en el proceso
		process.push({
			operation: `Iteración ${currentIteration + 1} (Error: ${error.toFixed(6)})`,
			matrix: [iterationValues]
		});

		// Verificar criterios de parada
		if (error < tol || error == Infinity || error == 0) {
			process.push({
				operation: "Convergencia alcanzada",
				matrix: [Array.from(newResults.values())]
			});
			break;
		}

		// Actualizar resultados para la siguiente iteración
		results = new Map(newResults);
		currentIteration++;
	}

	// Si se alcanzó el máximo de iteraciones sin converger
	if (currentIteration >= maxIterations) {
		process.push({
			operation: "Máximo de iteraciones alcanzado",
			matrix: [Array.from(results.values())]
		});
	}

	return process;
}

function seidelError(last, current) {

	return math.sqrt(

		math.sum(Array.from(last.keys()).map(key => math.pow(current.get(key) - last.get(key), 2)))

	);

}

function seidelConditioned(matrix) {
	// Extraer solo la matriz de coeficientes (eliminar columna de términos independientes)
	const n = matrix.length;
	const coeffMatrix = matrix.map(row => row.slice(0, n));

	// Inicializar matrices D (diagonal), L (triangular inferior), U (triangular superior)
	const D = [];
	const L = [];
	const U = [];

	// Construir las matrices D, L, U a partir de la matriz de coeficientes
	for (let i = 0; i < n; i++) {
		D[i] = Array(n).fill(0);
		L[i] = Array(n).fill(0);
		U[i] = Array(n).fill(0);

		for (let j = 0; j < n; j++) {
			if (i === j) {
				D[i][j] = coeffMatrix[i][j];	  // Elementos de la diagonal
			} else if (i > j) {
				L[i][j] = coeffMatrix[i][j];	  // Elementos debajo de la diagonal
			} else {
				U[i][j] = coeffMatrix[i][j];	  // Elementos arriba de la diagonal
			}
		}
	}

	try {
		// Para Gauss-Seidel: T_GS = (D - L)^{-1} * U
		// Donde T_GS es la matriz de iteración de Gauss-Seidel

		// Calcular (D - L)
		const D_minus_L = math.subtract(D, L);
		// Calcular la inversa de (D - L)
		const inv_D_minus_L = math.inv(D_minus_L);
		// Calcular la matriz de iteración T_GS
		const T_GS = math.multiply(inv_D_minus_L, U);

		// Calcular los autovalores de la matriz de iteración
		const eig = math.eigs(T_GS);
		const eigenvalues = eig.values;

		// Encontrar el radio espectral: máximo valor absoluto de los autovalores
		let spectralRadius = 0;
		for (let i = 0; i < eigenvalues.length; i++) {
			const absEigen = Math.abs(eigenvalues[i]);
			if (absEigen > spectralRadius) {
				spectralRadius = absEigen;
			}
		}

		return spectralRadius;
	} catch (error) {
		// Si hay error en el cálculo (ej: matriz singular), considerar mal condicionado
		console.warn("No se pudo calcular el radio espectral para Gauss-Seidel:", error);
		return Infinity;
	}
}