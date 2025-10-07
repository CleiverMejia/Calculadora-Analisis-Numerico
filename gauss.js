
console.log(Seidel(

	new Map().set('x_1', '(-4*x_2 + 2*x_3)/3').set('x_2', '(-2*x_1 - 4*x_3 + 11)/(-3)').set('x_3', '(-x_1 + 2*x_2 + 7)/7'),
	new Map().set('x_1', 0).set('x_2', 0).set('x_3', 0), true, 0.00001

));// x = 2, y = -1, z = 1

function Seidel(equations, initials, isSeidel = true, tol, maxIterations = 5000, currentIteration = 0) {

	if (currentIteration >= maxIterations) {

		console.log("Máx iterations reached");
		return initials;

	}

	if (equations.size !== initials.size) {

		throw new Error('Initial values does not match the amount of equations');

	}

	const results = new Map();


	if (isSeidel) {

		const tempInitials = new Map(initials);
		
		equations.forEach((equation_value, main_key) => {

			const f = math.compile(equation_value);
			let evaluates = {};

			tempInitials.forEach((value, key) => {

				if (main_key !== key) {

					evaluates[key] = value;
				}

			});

			const result = f.evaluate(evaluates);
			results.set(main_key, result);
			tempInitials.set(main_key, result);

		});

	}/* else {//Para Jacobi también

		equations.forEach((equation_value, main_key) => {

			const f = math.compile(equation_value);
			let evaluates = {};

			initials.forEach((value, key) => {

				if (main_key !== key) {

					evaluates[key] = value;

				}

			});

			const result = f.evaluate(evaluates);
			results.set(main_key, result);

		});

	}*/

	const error = calculateError(initials, results);
	console.log(`Iteración ${currentIteration + 1}: error = ${error}`);

	if (error < tol) {

		console.log("Convergen reached");
		return results;

	}

	return Seidel(equations, results, isSeidel, tol, maxIterations, currentIteration + 1);

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