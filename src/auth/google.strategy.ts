import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    const avatarUrl = profile.photos?.[0]?.value;
    // El "state" (query param ?state=userId) distingue si es un login normal
    // o si un usuario ya logueado está vinculando su cuenta de Google.
    const state = (req.query.state as string) || undefined;

    done(null, {
      googleId: profile.id,
      email,
      username: profile.displayName,
      avatarUrl,
      linkUserId: state,
    });
  }
}