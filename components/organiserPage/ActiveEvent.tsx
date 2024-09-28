"use client";
import React, { useEffect, useState } from "react";
import { CardComponent } from "../voterPage/Card";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, VoteIcon } from "lucide-react";
import Link from "next/link";

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
  }, [toast]);

  return (
    <div>
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg">
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Active Events
          </h3>
          <p className="text-gray-400 mb-6">
            You haven&apos;t created any active voting events yet.
          </p>
          <VoteIcon className="w-24 h-24 text-[#98ECFF] mb-6" />
          <p className="text-gray-300 mb-4">
            Ready to start a new voting event? Use the form on the left to
            create one!
          </p>
          <Link href="/about" className="text-[#98ECFF] hover:underline">
            Learn more about creating events
          </Link>
        </div>
      ) : (
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
              entity="organiser"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveEvent;
