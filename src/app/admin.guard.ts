import { CanActivateFn } from '@angular/router';
import { jwtDecode } from "jwt-decode";

export const adminGuard: CanActivateFn = (route, state) => {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('token') != null) {
      const token: any = localStorage.getItem('token')
      const decoded: any = jwtDecode(token);
      if (decoded['role'] == 'nhanvien' && state.url.slice(1, 6) == 'staff') {
        return true
      } else if (decoded['role'] == 'leader' && state.url.slice(1, 6) == 'admin') {
        return true
      }
    }
  }
  return false;
};
