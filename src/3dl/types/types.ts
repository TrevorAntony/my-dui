export interface ContainerComponentProps {
  header: string;
  subHeader?: string;
  variant?: "card" | "default";
  children: React.ReactNode;
}
