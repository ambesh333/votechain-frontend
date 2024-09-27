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
    <main className="container mx-auto px-4 py-8">
      <div className="bg-[#09090B] border border-gray-800 p-6 mb-8">
        <h2 className="text-[#98ECFF] text-2xl font-bold mb-6">
          Past Voting Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Invited Users: </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PastVote;
