export interface User {
  id: string;
  email: string;
  name: string;
}

export const fakeAuth = {
  isAuthenticated: false,
  user: null as User | null,

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          this.isAuthenticated = true;
          this.user = {
            id: '1',
            email,
            name: email.split('@')[0],
          };
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(this.user));
          resolve(this.user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  signup(email: string, password: string, name: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          this.isAuthenticated = true;
          this.user = {
            id: '1',
            email,
            name,
          };
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(this.user));
          resolve(this.user);
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  },

  logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isAuthenticated = false;
        this.user = null;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        resolve();
      }, 500);
    });
  },

  checkAuth(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    const user = localStorage.getItem('user');
    
    if (isAuth === 'true' && user) {
      this.isAuthenticated = true;
      this.user = JSON.parse(user);
      return true;
    }
    return false;
  },
};