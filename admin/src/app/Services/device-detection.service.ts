import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectionService {
  private platformId = inject(PLATFORM_ID);

  /**
   * Checks if the current device is a PC/Desktop
   * Returns true only for desktop devices
   */
  isDesktop(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);

    // Check screen size as additional validation
    const screenWidth = window.screen.width;
    const hasSmallScreen = screenWidth < 1024;

    // Return true only if it's NOT mobile, NOT tablet, and has adequate screen size
    return !isMobile && !isTablet && !hasSmallScreen;
  }

  /**
   * Gets a human-readable device type
   */
  getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    if (!isPlatformBrowser(this.platformId)) {
      return 'desktop';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);

    if (isMobile) {
      return 'mobile';
    }
    if (isTablet) {
      return 'tablet';
    }
    return 'desktop';
  }
}
