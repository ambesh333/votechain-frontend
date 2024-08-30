"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Calendar, Check, X } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { useWalletContext } from "@/contexts/WalletContext";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: number;
  title: string;
  invitedUsers: string[];
  startDate: string;
  endDate: string;
  description: string;
  options: Array<{
    id: number;
    option: string;
    voteCount: number;
    votedUsers: string[];
  }>;
  isCompleted: boolean;
}

const PastVote = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  const { publicKey } = useWalletContext();
  useEffect(() => {
    // Fetch active events from the backend
    const fetchActiveEvents = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/voter/getCompletedVotes?address=${publicKey}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        toast({
          title: "Error fetching Past events",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        console.error("Error fetching Past events:", error);
      }
    };

    fetchActiveEvents();
  }, [publicKey]);

  console.log("pastEvent", events);

  return (
    <div className="bg-background rounded-lg shadow-sm border border-input p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Past Voting Events</h2>
        <p className="text-muted-foreground">
          Events that have completed voting.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          //@ts-ignore
          <Card key={event.id}>
            <CardContent className="flex flex-col items-start justify-between gap-4 p-6">
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-5 w-5" />
                <span>Voted</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PastVote;
