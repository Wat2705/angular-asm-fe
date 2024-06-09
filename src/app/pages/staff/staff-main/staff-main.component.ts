import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-staff-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NzIconModule, NzLayoutModule, NzMenuModule, NzCollapseModule, NzPopconfirmModule],
  templateUrl: './staff-main.component.html',
  styleUrl: './staff-main.component.scss'
})
export class StaffMainComponent {
  isCollapsed = false;

  constructor(private nzMessageService: NzMessageService, private router: Router) { }

  cancel(): void {
    this.nzMessageService.info('Hủy!');
  }

  confirm(): void {
    if (typeof localStorage !== undefined) {
      localStorage.removeItem('token');
      this.nzMessageService.info('Đăng xuất thành công!');
      this.router.navigate(['auth/login'])
    }
  }
}
