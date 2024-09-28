"use client";
import React, { useEffect, useState } from "react";
import { CardComponent } from "./Card";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useWalletContext } from "@/contexts/WalletContext";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { VoteIcon, AlertCircle } from "lucide-react";
import Link from "next/link";

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
  }, [publicKey, toast]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-[#09090B] border border-gray-800 p-6 mb-8">
        <h2 className="text-[#FFFFFF] text-2xl font-bold mb-6">
          Upcoming Voting Events
        </h2>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-lg">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Active Events
            </h3>
            <p className="text-gray-400 mb-6">
              There are currently no active voting events.
            </p>
            <VoteIcon className="w-24 h-24 text-[#98ECFF] mb-6" />
            <p className="text-gray-300 mb-4">
              Ready to make your voice heard? Check back later for new voting
              opportunities!
            </p>
            <Link href="/about" className="text-[#98ECFF] hover:underline">
              Learn more about VoteChain
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
                entity="voter"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ActiveVote;
