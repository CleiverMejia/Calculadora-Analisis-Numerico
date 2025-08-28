bisection('x^3 - 1', -10, 10);

function bisection(equation, a, b, tol = 0.0001) {

	const f = math.compile(equation);
	method = (a, b) => (a + b)/2;

	return solutionEquation(method, f, a, b, tol, {

		equation: equation,
		iter: 0

	});

}

function fake_position(equation, a, b, tol = 0.0001) {

	const f = math.compile(equation);
	method = (a, b) => {

		return b - f.evaluate({ x: b }) * ((a - b) / (f.evaluate({ x: a }) - f.evaluate({ x: b })));

	}

	return solutionEquation(method, f, a, b, tol, {

		equation: equation,
		iter: 0

	});

}

function solutionEquation(method, f, a, b, tol, iteration, last_error = null) {

	const p = f.evaluate({ x: a }) * f.evaluate({ x: b });

	if (p<0) {

		aprox = method(a, b);
		f_aprox = f.evaluate({ x: aprox });
		error = Math.abs(b - a);

		iteration.iter++;

		show_iteration(iteration.iter, iteration.equation.replace('x', `(${aprox})`), f_aprox, error);

		if (f_aprox==0 || error<tol || error==last_error) {

			return aprox;

		}else{

			return solutionEquation(

				method, f,
				f_aprox<0 ? aprox : a,
				f_aprox>=0 ? aprox : b,
				tol, iteration, error

			);

		}

	}else if (p==0){

		if (f.evaluate({ x: a })==0){//f(a) = 0

			return a;

		}else if (f.evaluate({ x: b })==0) {//f(b) = 0

			return b;

		}

	}else{

		throw new Error('Function does not cross the x-axis');

	}

}