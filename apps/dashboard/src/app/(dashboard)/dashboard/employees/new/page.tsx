import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function NewEmployeePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Hire an AI employee</h1>
        <p className="text-[#94A3B8] text-sm mt-1">
          Set up your new AI employee in a few steps. Takes about 10 minutes.
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
