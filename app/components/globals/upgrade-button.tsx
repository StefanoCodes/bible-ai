import { Crown } from "lucide-react";
import { Button } from "../ui/button";
import { useUpgradeModal } from "./upgrade-modal";

export function UpgradeButton() {
	const { showUpgradeModal } = useUpgradeModal();

	return (
		<Button
			onClick={showUpgradeModal}
			variant="ghost"
			size="sm"
			className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
		>
			<Crown className="h-4 w-4 mr-1" />
			Upgrade
		</Button>
	);
}
