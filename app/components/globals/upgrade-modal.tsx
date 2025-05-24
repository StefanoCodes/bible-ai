import { useState, createContext, useContext, type ReactNode } from "react";
import { X, Crown, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "~/components/ui/dialog";

// Define the context type
type UpgradeModalContextType = {
	showUpgradeModal: () => void;
	hideUpgradeModal: () => void;
	isOpen: boolean;
};

// Create the context with a default value
const UpgradeModalContext = createContext<UpgradeModalContextType>({
	showUpgradeModal: () => {},
	hideUpgradeModal: () => {},
	isOpen: false,
});

// Custom hook to use the upgrade modal context
export const useUpgradeModal = () => useContext(UpgradeModalContext);

// Props for the provider component
type UpgradeModalProviderProps = {
	children: ReactNode;
};

export function UpgradeModalProvider({ children }: UpgradeModalProviderProps) {
	const [isOpen, setIsOpen] = useState(false);

	const showUpgradeModal = () => setIsOpen(true);
	const hideUpgradeModal = () => setIsOpen(false);

	return (
		<UpgradeModalContext.Provider
			value={{ showUpgradeModal, hideUpgradeModal, isOpen }}
		>
			{children}
			<UpgradeModal />
		</UpgradeModalContext.Provider>
	);
}

function UpgradeModal() {
	const { isOpen, hideUpgradeModal } = useUpgradeModal();

	return (
		<Dialog open={isOpen} onOpenChange={hideUpgradeModal}>
			<DialogContent className="max-w-md bg-[#FFF8EB] border-[#8B4513] border-2 rounded-lg">
				<DialogHeader className="text-center">
					<div className="flex justify-center mb-2">
						<div className="bg-[#F5E6D0] p-3 rounded-full">
							<Crown className="h-8 w-8 text-[#C87137]" />
						</div>
					</div>
					<DialogTitle className="text-2xl font-bold text-[#8B4513]">
						Upgrade Your Spiritual Journey
					</DialogTitle>
					<DialogDescription className="text-[#8B4513] mt-2">
						Unlock unlimited access to deeper biblical insights and more
						features
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-3">
						{[
							"Unlimited Scripture explorations",
							"Advanced theological insights",
							"daily bible verses",
						].map((feature, index) => (
							<div key={index} className="flex items-center gap-2">
								<div className="bg-[#F5E6D0] p-1 rounded-full">
									<Check className="h-4 w-4 text-[#8B4513]" />
								</div>
								<span className="text-[#8B4513]">{feature}</span>
							</div>
						))}
					</div>

					<div className="space-y-4 pt-4">
						<div className="rounded-md bg-[#F5E6D0] p-4">
							<div className="flex justify-between items-center">
								<div>
									<h3 className="font-medium text-[#8B4513]">Monthly</h3>
									<p className="text-sm text-[#8B4513]/80">
										Billed monthly, cancel anytime
									</p>
								</div>
								<div className="text-xl font-bold text-[#8B4513]">$7.99</div>
							</div>
						</div>

						{/* <div className="rounded-md bg-[#F5E6D0] p-4 border-2 border-[#C87137]">
							<div className="flex justify-between items-center">
								<div>
									<h3 className="font-medium text-[#8B4513]">Annual</h3>
									<p className="text-sm text-[#8B4513]/80">
										Save 33% with yearly billing
									</p>
								</div>
								<div className="text-xl font-bold text-[#8B4513]">
									$63.99
									<span className="text-sm font-normal">/year</span>
								</div>
							</div>
						</div> */}
					</div>

					<Button
						className="w-full bg-[#C87137] hover:bg-[#A05A2C] text-white"
						size="lg"
					>
						<Crown className="mr-2 h-4 w-4" />
						Upgrade Now
					</Button>

					<p className="text-xs text-center text-[#8B4513]/70 mt-2">
						"But grow in the grace and knowledge of our Lord and Savior Jesus
						Christ."
						<br />- 2 Peter 3:18
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
