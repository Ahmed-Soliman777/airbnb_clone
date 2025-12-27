// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../Services/auth-service';
// import { map, catchError, of } from 'rxjs';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (!authService.isLoggedIn()) {
//     router.navigate(['/login']);
//     return false;
//   }

//   return authService.getProfile().pipe(
//     map((user) => {
//       if (user.role === 'admin') {
//         return true;
//       } else {
//         router.navigate(['/login']);
//         return false;
//       }
//     }),
//     catchError(() => {
//       router.navigate(['/login']);
//       return of(false);
//     })
//   );
// };

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { map, catchError, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Only run guard in browser, not during SSR
  if (!isPlatformBrowser(platformId)) {
    return true; // Allow during SSR, will be checked again in browser
  }

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user is already in memory
  const currentUser = authService.getCurrentUser();
  if (currentUser?.role === 'admin') {
    return true;
  }

  // Fetch profile from server
  return authService.getProfile().pipe(
    map((user) => {
      if (user?.role === 'admin') {
        return true;
      }
      authService.removeToken();
      router.navigate(['/login']);
      return false;
    }),
    catchError((error) => {
      console.error('Auth failed:', error);
      authService.removeToken();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
