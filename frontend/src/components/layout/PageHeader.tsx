interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
    return (
        <div className="mb-8 flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-bold text-[#4A6FA5] mb-2">{title}</h1>
                {description && (
                    <p className="text-base text-[#6B7280]">{description}</p>
                )}
            </div>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};

export default PageHeader;
