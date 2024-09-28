"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { useWalletContext } from "@/contexts/WalletContext";
import { XIcon, AlertCircle } from "lucide-react";

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
  const [isVotingOpen, setIsVotingOpen] = useState<boolean>(true);
  const { toast } = useToast();
  const { publicKey } = useWalletContext();

  useEffect(() => {
    const now = new Date();
    const end = new Date(endDate);
    setIsVotingOpen(now < end);
  }, [endDate]);

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

        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#09090B] border border-[#98ECFF] p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-[ #FFB6C1] mb-4">{title}</h2>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Start Date
            </label>
            <p className="text-white">{startDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              End Date
            </label>
            <p className="text-white">{endDate}</p>
          </div>
        </div>
        {isVotingOpen ? (
          <>
            <div className="mb-6 border-2 border-white p-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Options
              </label>
              <RadioGroup
                value={selectedOption !== null ? selectedOption.toString() : ""}
                onValueChange={(value) => setSelectedOption(Number(value))}
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`option-${option.id}`}
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="text-white"
                    >
                      {option.option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button
              className="w-full bg-[#98ECFF] text-black font-semibold py-2 px-4 hover:bg-[#98ECFF] transition-colors"
              onClick={handleVote}
              disabled={selectedOption === null}
            >
              Submit Vote
            </Button>
          </>
        ) : (
          <div className="text-center">
            <AlertCircle className="mx-auto text-yellow-500 w-12 h-12 mb-4" />
            <p className="text-yellow-500 font-semibold mb-2">Voting Closed</p>
            <p className="text-gray-300">
              The voting period for this event has ended.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingDialog;
