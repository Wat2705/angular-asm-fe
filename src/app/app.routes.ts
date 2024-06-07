import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './auth/main/main.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddProjectComponent } from './pages/admin/add-project/add-project.component';
import { EditProjectComponent } from './pages/admin/edit-project/edit-project.component';
import { ProjectListComponent } from './pages/admin/project-list/project-list.component';

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
  // {
  //   path: 'admin',

  // },
  {
    path: 'home',
    component: ProjectListComponent,
    title: 'Home'
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
];
