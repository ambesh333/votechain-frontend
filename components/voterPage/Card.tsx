import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Star, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import VotingDialog from "./VoteDialog";

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

const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  const start = str.slice(0, 6); // Show the first 6 characters
  const end = str.slice(-4); // Show the last 4 characters
  return `${start}...${end}`;
};

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
    if (entity === "organizer") {
      router.push(`/organizer/${id}`);
    } else if (entity === "voter") {
      setVotingDialogOpen(true);
    }
  };

  const closeVotingDialog = () => {
    setVotingDialogOpen(false);
  };

  return (
    <>
      <Card className="card-class flex-shrink-0 w-72 bg-transparent border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-400">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="mt-1 mb-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {truncateString(category, 7)}
              </Badge>
            ))}
          </div>
          <div className="flex items-center text-gray-300 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{startDate}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <UsersIcon className="w-4 h-4 mr-2" />
            <span className="text-sm">{participants} Participants</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleButtonClick}>
            {entity === "voter" ? "Participate" : "Results"}
          </Button>
        </CardFooter>
      </Card>
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
    </>
  );
};
