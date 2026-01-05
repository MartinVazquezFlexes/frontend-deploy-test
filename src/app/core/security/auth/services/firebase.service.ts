import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, UserCredential, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth = inject(Auth);

  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  getCurrentUser() {
    return user(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    const currentUser = await this.getCurrentUser().toPromise();
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const userCredential = await this.signInWithGoogle();
      const credential = GoogleAuthProvider.credentialFromResult(userCredential);
      return credential?.accessToken || null;
    } catch (error) {
      return null;
    }
  }
}
