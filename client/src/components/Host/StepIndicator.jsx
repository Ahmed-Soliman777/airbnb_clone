import { Check } from "lucide-react";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-primary border-primary"
                    : index === currentStep
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      index === currentStep
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center hidden md:block ${
                  index <= currentStep
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-all duration-300 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
