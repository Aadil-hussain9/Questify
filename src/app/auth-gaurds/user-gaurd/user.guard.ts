import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {StorageService} from '../../auth-services/storage-service/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn:'root'
})

export class UserAuthGuard implements CanActivate{
  constructor(private router:Router,
              private snackBar : MatSnackBar) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if(!StorageService.hasToken()){
      StorageService.logout(); // Ensure token cleanup
      this.router.navigate(['/login']).then(success => {
        if (success) {
          console.log("Invalid Token! User navigated to login page.");
          this.snackBar.open("You are not logged in. Please log in first.", 'Close', {
            duration: 5000,
          });
        } else {
          console.error("Navigation to login page failed.");
        }
      });
      return false;
    }
    return true;
  }
}
