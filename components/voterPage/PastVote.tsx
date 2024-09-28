"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, AlertCircle, VoteIcon } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { useWalletContext } from "@/contexts/WalletContext";
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
  }, [publicKey, toast]);

  console.log("pastEvent", events);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-[#09090B] border border-gray-800 p-6 mb-8">
        <h2 className="text-[ #FFB6C1] text-2xl font-bold mb-6">
          Past Voting Events
        </h2>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Past Events
            </h3>
            <p className="text-gray-400 mb-6">
              You haven&apos;t participated in any completed voting events yet.
            </p>
            <VoteIcon className="w-24 h-24 text-[#98ECFF] mb-6" />
            <p className="text-gray-300 mb-4">
              Once you participate in a voting event and it concludes, it will
              appear here.
            </p>
            <Link href="/about" className="text-[#98ECFF] hover:underline">
              Learn more about VoteChain
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span>
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#98ECFF]">
                    <Check className="h-5 w-5" />
                    <span>Voted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default PastVote;
