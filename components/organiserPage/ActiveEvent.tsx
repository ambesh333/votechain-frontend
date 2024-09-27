"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardComponent } from "../voterPage/Card";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
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

const ActiveEvent = () => {
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch active events from the backend
    const fetchActiveEvents = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/event/activeEvents`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        toast({
          title: "Error fetching active events",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        console.error("Error fetching active events:", error);
      }
    };

    fetchActiveEvents();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-[#09090B] border border-gray-800 p-6 mb-8">
        <h2 className="text-[#98ECFF] text-2xl font-bold mb-6">
          Active Voting Events
        </h2>
        <p className="text-muted-foreground">
          Events that are currently open for voting.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </main>
  );
};

export default ActiveEvent;
