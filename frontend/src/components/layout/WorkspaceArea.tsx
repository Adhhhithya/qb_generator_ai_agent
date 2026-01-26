import { ReactNode } from "react";

interface WorkspaceAreaProps {
    children: ReactNode;
}

const WorkspaceArea = ({ children }: WorkspaceAreaProps) => {
    return (
        <div className="animate-fade-in relative w-full h-full">
            {/* 
         This component is a wrapper for the active page content.
         Currently lightweight, but can handle page transitions/suspense later.
      */}
            {children}
        </div>
    );
};

export default WorkspaceArea;
