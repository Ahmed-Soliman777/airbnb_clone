import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, ArrowRight } from "lucide-react";
import { init3DScene } from "../utils/3d";

const HostWelcomePage = () => {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const initializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent double initialization in strict mode or re-entry
    if (initializedRef.current) return;
    initializedRef.current = true;

    localStorage.setItem("hasSeenHostWelcome", "true");

    // Initialize the 3D scene from utility
    // Since init3DScene is synchronous for procedural generation, we can set loading to false immediately
    setIsLoading(false);

    // We pass mountRef.current. Checks are done inside the utility.
    const cleanup = init3DScene(mountRef.current);

    return () => {
      if (cleanup) cleanup();
      initializedRef.current = false; // Allow re-initialization on remount
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex">
      {/* Content - Left Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center lg:text-left space-y-6 max-w-xl">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <Home className="w-12 h-12 text-primary" />
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Hosting! 🎉
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground">
            You're now a host! Start sharing your spaces, experiences, or services with guests around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/host")}
              className="gap-2"
            >
              <Home className="w-5 h-5" />
              Create Your First Listing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/host/dashboard")}
              className="gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4 hidden lg:block">
            Drag the house to rotate it • Click and explore
          </p>
        </div>
      </div>

      {/* 3D Scene - Right Side (Hidden on mobile/tablet) */}
      <div
        ref={mountRef}
        className="hidden lg:block flex-1 min-h-screen"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background lg:left-1/2">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostWelcomePage;