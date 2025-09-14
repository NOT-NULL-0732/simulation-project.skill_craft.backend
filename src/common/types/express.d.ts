declare global {
   namespace Express {
    interface Request {
      authenticatedUser?: IAuthenticatedUser;
    }
  }
}

export interface IAuthenticatedUser {
  userId: string;
}
