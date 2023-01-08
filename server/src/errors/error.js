export class BadRequestError extends Error { //400
	constructor(message) {
		super(message);
	}
}

export class UnauthorizedError extends Error { //401
	constructor(message) {
		super(message);
  	}
}

export class NotFoundError extends Error { //404
	constructor(message) {
		super(message);
	}
}

export class InternalServerError extends Error { //500
	constructor(message) {
		super(message);
	}
}

export const sendErrorResponse = (res, err) => {
	console.log('sendErrorResponse');
	if (err instanceof BadRequestError)
		return res.status(400).send(err.message);
	if (err instanceof UnauthorizedError)
		return res.status(401).send(err.message);
	if (err instanceof NotFoundError)
		return res.status(404).send(err.message);
	else
		return res.status(500).send(err);
}