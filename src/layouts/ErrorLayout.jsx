import { useNavigate } from "react-router-dom";
import {Button} from "../components";
import {ArrowLeft, Home} from "lucide-react";

const ErrorLayout = ({
  icon: Icon,
  title,
  description,
  children,
  customActions
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--background) p-4">
      <div className="max-w-md w-full text-center space-y-6">

        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-(--foreground) tracking-tight">
            {title}
          </h1>
          <p className="text-(--secondary)">
            {description}
          </p>
        </div>

        {children}

        <div className="flex items-center justify-center gap-3 pt-2">
          {customActions ? (
            customActions
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="border border-(--border)"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4" />
                Back Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorLayout;