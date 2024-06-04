import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProjectService } from '../../project.service';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    NzTableModule,
    NzModalModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    RouterLink,
    NzPopconfirmModule,
    CommonModule,
    NzImageModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})

export class ProjectListComponent {
  listOfData: any = []
  isVisible = false;

  constructor(private service: ProjectService, private message: NzMessageService, private modal: NzModalService) { }

  ngOnInit(): void {
    this.service.getAll().subscribe(res => {
      console.log(res)
      this.listOfData = res
    })
  }

  cancel(): void {
    this.message.info('Hủy!');
  }

  confirm(id: string): void {
    this.service.delete(id)
      .subscribe(
        (res: any) => {
          this.listOfData = this.listOfData.filter((e: any) => e._id != id)
        },
        (err) => {
          console.log(err)
        }
      )
    this.message.success('Xóa thành công!');
  }

  info(data: any): void {
    this.modal.info({
      nzTitle: data._id,
      nzContent: `
        <p>Name: ${data.name}</p>
        <p>Start Date: ${data.startDate}</p>
        <p>Team Size: ${data.teamSize}</p>
        <p>Price: ${data.price}</p>
        <p>Description: ${data.description}</p>
        ${data.image != undefined ? `<img class='object-cover' src='${data.image.base64}'/>` : ''}
      `,
    });
  }
}