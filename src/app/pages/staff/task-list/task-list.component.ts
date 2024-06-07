import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink,
    NzDividerModule,
    NzImageModule,
    NzTableModule,
    NzPopconfirmModule,
    NzButtonModule,
    NzIconModule,
    CommonModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  listOfData: any = []
  isVisible = false;

  constructor(
    private task: TaskService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.task.getAll().subscribe(res => {
      this.listOfData = res
    })
  }

  cancel(): void {
    this.message.info('Hủy!');
  }

  confirm(id: string): void {
    this.task.del(id)
      .subscribe(
        (res: any) => {
          this.listOfData = this.listOfData.filter((e: any) => e._id != id)
        }
      )
    this.message.success('Xóa thành công!');
  }
}
