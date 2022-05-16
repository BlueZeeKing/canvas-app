import { ReactNode } from "react";

export default function Link(props: {children: ReactNode, to: string}) {
  return <span>props.children</span>;
}