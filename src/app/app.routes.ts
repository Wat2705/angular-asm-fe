import { Routes } from '@angular/router';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';

export const routes: Routes = [
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
