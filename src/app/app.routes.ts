import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './auth/main/main.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddProjectComponent } from './pages/admin/add-project/add-project.component';
import { EditProjectComponent } from './pages/admin/edit-project/edit-project.component';
import { ProjectListComponent } from './pages/admin/project-list/project-list.component';
import { AdminMainComponent } from './pages/admin/admin-main/admin-main.component';
import { adminGuard } from './admin.guard';
import { StaffMainComponent } from './pages/staff/staff-main/staff-main.component';
import { TaskListComponent } from './pages/staff/task-list/task-list.component';
import { AddTaskComponent } from './pages/staff/add-task/add-task.component';
import { EditTaskComponent } from './pages/staff/edit-task/edit-task.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: MainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminMainComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'home',
        component: ProjectListComponent,
        title: 'Project List'
      },
      {
        path: 'add',
        component: AddProjectComponent,
        title: 'Add Project'
      },
      {
        path: 'edit/:id',
        component: EditProjectComponent,
        title: 'Edit Project'
      }
    ]
  },
  {
    path: 'staff',
    component: StaffMainComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'home',
        component: TaskListComponent,
        title: 'Task List'
      },
      {
        path: 'add',
        component: AddTaskComponent,
        title: 'Add Task'
      },
      {
        path: 'edit/:id',
        component: EditTaskComponent,
        title: 'Edit Task'
      }
    ]
  }
];
