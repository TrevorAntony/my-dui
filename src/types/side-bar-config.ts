export type SidebarConfig = {
  system: {
    home: {
      title: string;
      icon: string;
      dashboard: string;
    };
    menu: any[];
    dataTasks: any[];
  };
  user: {
    menu: any[];
  };
};
