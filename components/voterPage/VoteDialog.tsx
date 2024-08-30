"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { useWalletContext } from "@/contexts/WalletContext";

interface VotingDialogProps {
  eventId: number;
  isOpen: boolean;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  onClose: () => void;
  options: Array<{
    id: number;
    option: string;
    voteCount: number;
    votedUsers: string[];
  }>;
}

const VotingDialog: React.FC<VotingDialogProps> = ({
  eventId,
  isOpen,
  onClose,
  title,
  description,
  startDate,
  endDate,
  options,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();
  const { publicKey } = useWalletContext();

  const handleVote = async () => {
    if (selectedOption !== null) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/v1/voter/vote?address=${publicKey}`,
          { eventId, optionId: selectedOption },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        toast({
          title: "Vote Casted",
          description: `Your vote for option ID ${selectedOption} has been recorded.`,
          className: "border border-green-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });

        onClose(); // Close the dialog
        setSelectedOption(null);
      } catch (error) {
        console.error("Error casting vote:", error);
        toast({
          title: "Error",
          description: "Failed to cast vote. Please try again.",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">
              Start Date
            </Label>
            <span className="col-span-3" id="start">
              {startDate}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">
              End Date
            </Label>
            <span className="col-span-3" id="end">
              {endDate}
            </span>
          </div>
          <RadioGroup
            value={selectedOption !== null ? selectedOption.toString() : ""}
            onValueChange={(value) => setSelectedOption(Number(value))}
            className="grid gap-2"
          >
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                />
                <Label htmlFor={`option-${option.id}`}>{option.option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleVote} disabled={selectedOption === null}>
            Vote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VotingDialog;
