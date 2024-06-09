import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NzIconModule, NzLayoutModule, NzMenuModule, NzCollapseModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      if (localStorage?.getItem('token') != null) {
        let token: any = localStorage?.getItem('token');
        let decoded: any = jwtDecode(token);
        if (decoded['role'] == 'nhanvien') {
          this.router.navigate(['/staff'])
        } else if (decoded['role'] == 'leader') {
          this.router.navigate(['/admin'])
        }
      } else {
        this.router.navigate(['/auth/login'])
      }
    }
  }
}
