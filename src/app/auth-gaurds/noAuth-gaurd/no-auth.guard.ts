import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from '@angular/core';
import {StorageService} from '../../auth-services/storage-service/storage.service';

@Injectable({
  providedIn:'root'
})

export class NoAuthGuard implements CanActivate{
  constructor(private router:Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(StorageService.hasToken()){
      this.router.navigateByUrl('/user/dashboard')
        .then(__=>console.log("Valid Token! ,user Navigated to dashboard "));
      return false
    }
    return true;
  }
}
