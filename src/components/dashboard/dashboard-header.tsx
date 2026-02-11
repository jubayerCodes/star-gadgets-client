const DashboardHeader = ({
  title,
  children,
  description,
}: {
  title: string;
  children?: React.ReactNode;
  description?: string;
}) => {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default DashboardHeader;
