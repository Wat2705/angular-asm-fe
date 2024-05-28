import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NzTableModule, NzModalModule, NzDividerModule, NzButtonModule, NzIconModule, RouterLink, NzPopconfirmModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})

export class ProjectListComponent {
  listOfData: any = []
  isVisible = false;

  constructor(private http: HttpClient, private message: NzMessageService, private modal: NzModalService) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/project').subscribe(res => {
      this.listOfData = res
    })
  }

  cancel(): void {
    this.message.info('Hủy!');
  }

  confirm(id: string): void {
    this.http.delete(`http://localhost:3000/project/${id}`)
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
        <img src='https://picsum.photos/id/1/200/300'/>
      `,
    });
  }
}