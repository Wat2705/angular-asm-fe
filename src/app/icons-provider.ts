import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FileAddOutline,
  PlusOutline,
  UserOutline,
  LockOutline,
  MailOutline,
  InfoCircleOutline
} from '@ant-design/icons-angular/icons';

import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FileAddOutline,
  PlusOutline,
  UserOutline,
  LockOutline,
  MailOutline,
  InfoCircleOutline
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
