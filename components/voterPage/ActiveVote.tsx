"use client";
import React, { useEffect, useState } from "react";
import { CardComponent } from "./Card";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useWalletContext } from "@/contexts/WalletContext";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: number;
  title: string;
  invitedUsers: string[];
  startDate: string;
  description: string;
  endDate: string;
  options: Array<{
    id: number;
    option: string;
    voteCount: number;
    votedUsers: string[];
  }>;
  isCompleted: boolean;
}

const ActiveVote = () => {
  const { toast } = useToast();
  const { publicKey } = useWalletContext();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch active events from the backend
    const fetchActiveEvents = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/voter/getActiveVote?address=${publicKey}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        toast({
          title: "Error fetching Active votes",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        console.error("Error fetching active events:", error);
      }
    };

    fetchActiveEvents();
  }, [publicKey]);

  return (
    <div>
      <section>
        <h2 className="mb-4 text-2xl font-bold ">Upcoming Voting Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-80 overflow-y-auto ">
          {events.map((event) => (
            <CardComponent
              key={event.id}
              id={event.id}
              description={event.description}
              title={event.title}
              categories={event.invitedUsers}
              participants={event.invitedUsers.length.toString()}
              startDate={new Date(event.startDate).toLocaleDateString()}
              endDate={new Date(event.endDate).toLocaleDateString()}
              options={event.options}
              entity="voter"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ActiveVote;
