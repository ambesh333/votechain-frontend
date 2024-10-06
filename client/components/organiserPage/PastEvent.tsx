"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, X, AlertCircle, VoteIcon } from "lucide-react";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
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

const PastEvent = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch active events from the backend
    const fetchActiveEvents = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/event/pastEvents`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        toast({
          title: "Error fetching Past events",
          className: "border border-red-500",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        console.error("Error fetching active events:", error);
      }
    };

    fetchActiveEvents();
  }, [toast]);

  console.log("pastEvent", events);

  return (
    <div className="bg-background rounded-lg shadow-sm border border-input p-6 space-y-4">
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg">
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Past Events
          </h3>
          <p className="text-gray-400 mb-6">
            You haven&apos;t completed any voting events yet.
          </p>
          <VoteIcon className="w-24 h-24 text-[#98ECFF] mb-6" />
          <p className="text-gray-300 mb-4">
            Once you complete a voting event, it will appear here.
          </p>
          <Link href="/about" className="text-[#98ECFF] hover:underline">
            Learn more about managing events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#09090B] border-2 border-[#98ECFF] p-6 rounded-none shadow-lg"
            >
              <div className="flex flex-col items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="text-white mt-2">{event.description}</p>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[#98ECFF]">
                  <Check className="h-5 w-5" />
                  <span>Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastEvent;
