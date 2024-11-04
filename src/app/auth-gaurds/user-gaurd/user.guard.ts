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
      StorageService.logout();
      this.router.navigateByUrl('/login')
        .then(__=>console.log("In Valid Token! ,user Navigated to login page "));
      this.snackBar.open("You are Not Logged in, Login First",'Close',{duration:5000})
      return false
    }
    return true;
  }
}
