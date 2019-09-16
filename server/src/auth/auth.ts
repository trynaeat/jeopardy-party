import { ExtractJwt, Strategy } from 'passport-jwt';
import * as passport from 'koa-passport';
import { config } from '../config';

const params = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

function auth(jwt_payload: { id: string, exp: number }, done: Function) {
	const expiry = jwt_payload.exp;
	if ((Date.now() / 1000) > expiry) {
		return done('Token Expired', null);
	}
	done(null, jwt_payload);
}

export function initialize() {
	const headerStrategy = new Strategy(params, auth);

	passport.use('jwt', headerStrategy);
	return passport.initialize();
}

export function authenticate() {
	return passport.authenticate('jwt', { session: false });
}
