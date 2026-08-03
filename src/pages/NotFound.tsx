import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PageTitle } from "@/components/ui/PageTitle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <PageTitle
          title="404"
          meta="system.error"
          subtitle="Oops! Page not found"
          align="center"
          className="mb-8"
        />
        <Link
          to="/"
          className="font-mono text-sm text-primary underline hover:text-primary/90"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
