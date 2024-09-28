"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import VotingDialog from "./VoteDialog";
import RetroGrid from "@/components/ui/retro-grid";
import Jazzicon from "react-jazzicon";

// Truncate string function
const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  const start = str.slice(0, 6); // Show the first 6 characters
  const end = str.slice(-4); // Show the last 4 characters
  return `${start}...${end}`;
};

interface CardProps {
  id: number;
  description: string;
  title: string;
  categories: string[];
  participants: string;
  startDate: string;
  endDate: string;
  entity: string;
  options: Array<{
    id: number;
    option: string;
    voteCount: number;
    votedUsers: string[];
  }>;
}

export const CardComponent: React.FC<CardProps> = ({
  id,
  description,
  title,
  categories,
  participants,
  startDate,
  endDate,
  entity,
  options,
}) => {
  const router = useRouter();
  const [isVotingDialogOpen, setVotingDialogOpen] = useState(false);

  const handleButtonClick = () => {
    if (entity === "organiser") {
      router.push(`/organizer/${id}`);
    } else if (entity === "voter") {
      setVotingDialogOpen(true);
    }
  };

  const closeVotingDialog = () => {
    setVotingDialogOpen(false);
  };

  const generateSeed = (category: string) => {
    return (
      Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      10000000
    );
  };

  return (
    <div className="relative p-4 border border-gray-800 rounded-lg overflow-hidden">
      <RetroGrid className="absolute inset-0 z-0" />
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`flex items-center p-2  ${new Date(endDate) > new Date()}`}
        >
          <span
            className={`h-3 w-3 rounded-full mr-2 ${
              new Date(endDate) > new Date() ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          ></span>
          <span className="text-sm text-white">
            {new Date(endDate) > new Date() ? "Live" : "Ended"}
          </span>
        </div>
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl font-bold mb-2 text-white">
          {title}
        </CardTitle>
        <p className="text-gray-400 mb-4">{description}</p>
      </CardHeader>
      <hr className="border-t border-gray-700 mb-4 relative z-10" />
      <CardContent className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="text-white px-3 py-2 text-xs font-medium border border-[#FFB6C1] flex items-center w-full lg:w-1/2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            ENDS ON: {endDate}
          </div>
          <div className="text-white px-3 py-2 text-xs font-medium border border-[#98FB98] flex items-center w-full lg:w-1/2">
            <UsersIcon className="mr-2 h-4 w-4" />
            PARTICIPANTS: {participants}
          </div>
        </div>
        <div className="border-2 border-yellow-400 p-4 ">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Participants
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="rounded-none border border-gray-500 flex items-center"
              >
                <Jazzicon diameter={20} seed={generateSeed(category)} />

                {truncateString(category, 7)}
              </Badge>
            ))}
          </div>
        </div>
        <hr className="border-t border-gray-700 mb-4 relative z-10" />
      </CardContent>
      <CardFooter className="relative z-10">
        <Button
          className="w-full bg-[#98ECFF] text-black font-semibold py-3 hover:bg-[#98ECFF] transition-colors"
          onClick={handleButtonClick}
        >
          {entity === "voter" ? "Participate" : "Results"}
        </Button>
      </CardFooter>
      {entity === "voter" && (
        <VotingDialog
          eventId={id}
          title={title}
          isOpen={isVotingDialogOpen}
          onClose={closeVotingDialog}
          options={options}
          startDate={startDate}
          endDate={endDate}
          description={description}
        />
      )}
    </div>
  );
};
