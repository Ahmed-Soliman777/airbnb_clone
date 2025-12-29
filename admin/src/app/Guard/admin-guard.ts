import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { DeviceDetectionService } from '../Services/device-detection.service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const deviceDetection = inject(DeviceDetectionService);

  // Check if device is desktop
  if (!deviceDetection.isDesktop()) {
    authService.logout().subscribe();
    router.navigate(['/login']);
    return false;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return authService.getProfile().pipe(
    map((user) => {
      if (user.role === 'admin') {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      // console.log("error")
      router.navigate(['/login']);
      return of(false);
    })
  );
};
