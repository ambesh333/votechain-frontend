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

// CardProps interface to type-check the props
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

  // Button click handler for navigating or opening dialog
  const handleButtonClick = () => {
    if (entity === "organizer") {
      router.push(`/organizer/${id}`);
    } else if (entity === "voter") {
      setVotingDialogOpen(true);
    }
  };

  const closeVotingDialog = () => {
    setVotingDialogOpen(false);
  };

  // Generate a consistent seed for Jazzicon from the category string
  const generateSeed = (category: string) => {
    return (
      Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      10000000
    );
  };

  return (
    <div className="relative p-4 border border-gray-800 rounded-lg overflow-hidden">
      {/* RetroGrid as background */}
      <RetroGrid className="absolute inset-0 z-0" />

      {/* Live/Ended Badge */}
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

      {/* Card Header with Title and Description */}
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl font-bold mb-2 text-white">
          {title}
        </CardTitle>
        <p className="text-gray-400 mb-4">{description}</p>
      </CardHeader>

      {/* Divider */}
      <hr className="border-t border-gray-700 mb-4 relative z-10" />

      {/* Categories (with Jazzicons next to the category name) */}
      <CardContent className="relative z-10">
        {/* End Date and Participants */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className=" text-white px-3 py-2 text-xs font-medium border border-blue-500 flex items-center w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            ENDS ON: {endDate}
          </div>
          <div className=" text-white px-3 py-2 text-xs font-medium border border-purple-500 flex items-center w-full">
            <UsersIcon className="mr-2 h-4 w-4" />
            PARTICIPANTS: {participants}
          </div>
        </div>
        {/* Participants Heading */}
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
                {/* Jazzicon */}
                <Jazzicon
                  diameter={20}
                  seed={generateSeed(category)}
                  // className="mr-2"
                />
                {/* Truncated Category Name */}
                {truncateString(category, 7)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-700 mb-4 relative z-10" />
      </CardContent>

      {/* Participate/Results Button */}
      <CardFooter className="relative z-10">
        <Button
          className="w-full bg-[#98ECFF] text-black font-semibold py-3 hover:bg-[#7DCEE0] transition-colors"
          onClick={handleButtonClick}
        >
          {entity === "voter" ? "Participate" : "Results"}
        </Button>
      </CardFooter>

      {/* Voting Dialog (for voter entity) */}
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
