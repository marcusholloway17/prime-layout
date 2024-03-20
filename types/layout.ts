import { MenuItem } from 'primeng/api';

export type LayoutDataType = {
  menuItems: MenuItem[];
  popupMenuItems?: MenuItem[];
  appLogo?: string;
  appName?: string;
};
